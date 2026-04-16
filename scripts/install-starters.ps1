param(
    [string]$WorkspaceRoot,
    [string]$BootstrapPath,
    [string]$StarterRepoBaseUri,
    [string]$DefaultGitHubOwner = "aegidati"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Convert-ToAbsolutePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [string]$BasePath
    )

    if ([System.IO.Path]::IsPathRooted($Path)) {
        return [System.IO.Path]::GetFullPath($Path)
    }

    if ([string]::IsNullOrWhiteSpace($BasePath)) {
        return [System.IO.Path]::GetFullPath($Path)
    }

    return [System.IO.Path]::GetFullPath((Join-Path $BasePath $Path))
}

function Resolve-RepoValue {
    param([string]$Value)

    if ($null -eq $Value) { return $null }

    $normalized = $Value.Trim()
    if ($normalized -match "^(.*?)(\s+#.*)?$") {
        $normalized = $matches[1].Trim()
    }

    $normalized = $normalized.Trim("'").Trim('"')
    if ([string]::IsNullOrWhiteSpace($normalized)) { return $null }
    if ($normalized -in @("null", "~", "false", "False", "FALSE")) { return $null }

    return $normalized
}

function Invoke-NativeCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command,
        [string[]]$Arguments = @(),
        [string]$WorkingDirectory
    )

    $effectiveArguments = @()
    if (($Command -ieq "git") -and (-not [string]::IsNullOrWhiteSpace($WorkingDirectory))) {
        $effectiveArguments += @("-C", $WorkingDirectory)
    }
    $effectiveArguments += $Arguments

    try {
        $previousErrorActionPreference = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        $output = @(& $Command @effectiveArguments 2>&1 | ForEach-Object { $_.ToString() })
        $ErrorActionPreference = $previousErrorActionPreference

        $exitCode = $LASTEXITCODE
        if ($null -eq $exitCode) { $exitCode = 0 }

        return [pscustomobject]@{
            ExitCode = $exitCode
            Output = $output
        }
    }
    finally {
        $ErrorActionPreference = "Stop"
    }
}

function Get-OriginBaseUri {
    param([string]$RepositoryRoot)

    $result = Invoke-NativeCommand -Command "git" -Arguments @("remote", "get-url", "origin") -WorkingDirectory $RepositoryRoot
    if ($result.ExitCode -ne 0) {
        return $null
    }

    $originUrl = @($result.Output | Select-Object -First 1)[0]
    if ([string]::IsNullOrWhiteSpace($originUrl)) {
        return $null
    }

    if ($originUrl -match "^https://github\.com/([^/]+)/[^/]+(?:\.git)?/?$") {
        return "https://github.com/$($matches[1])"
    }

    if ($originUrl -match "^git@github\.com:([^/]+)/[^/]+(?:\.git)?$") {
        return "https://github.com/$($matches[1])"
    }

    return $null
}

function Resolve-StarterCloneSource {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Repo,
        [string]$RepositoryRoot,
        [string]$ConfiguredBaseUri,
        [string]$DefaultGitHubOwner
    )

    if ($Repo -match "^[a-zA-Z][a-zA-Z0-9+.-]*://") {
        return $Repo
    }

    if ($Repo -match "^git@") {
        return $Repo
    }

    if ($Repo -match "^[^/\\]+/[^/\\]+$") {
        return "https://github.com/$Repo.git"
    }

    if (
        [System.IO.Path]::IsPathRooted($Repo) -or
        $Repo.StartsWith(".", [System.StringComparison]::Ordinal) -or
        $Repo.Contains("\")
    ) {
        $localRepoPath = Convert-ToAbsolutePath -Path $Repo -BasePath $RepositoryRoot
        if (Test-Path -LiteralPath $localRepoPath) {
            return $localRepoPath
        }
    }

    $baseUri = $ConfiguredBaseUri
    if ([string]::IsNullOrWhiteSpace($baseUri)) {
        $baseUri = $env:AGENTIC_STARTER_REPO_BASE_URI
    }
    if ([string]::IsNullOrWhiteSpace($baseUri)) {
        $baseUri = Get-OriginBaseUri -RepositoryRoot $RepositoryRoot
    }

    if ([string]::IsNullOrWhiteSpace($baseUri)) {
        $owner = $DefaultGitHubOwner
        if ([string]::IsNullOrWhiteSpace($owner)) {
            $owner = $env:AGENTIC_STARTER_GITHUB_OWNER
        }
        if ([string]::IsNullOrWhiteSpace($owner)) {
            throw "Unable to resolve starter base URI. Set -StarterRepoBaseUri or -DefaultGitHubOwner."
        }

        $baseUri = "https://github.com/$owner"
    }

    $trimmedBaseUri = $baseUri.TrimEnd('/')
    if ($Repo.EndsWith('.git', [System.StringComparison]::OrdinalIgnoreCase)) {
        return "$trimmedBaseUri/$Repo"
    }

    return "$trimmedBaseUri/$Repo.git"
}

function Get-BootstrapInfo {
    param([string]$ManifestPath)

    if (-not (Test-Path -LiteralPath $ManifestPath)) {
        throw "PROJECT-BOOTSTRAP.yaml not found at $ManifestPath"
    }

    $lines = @(Get-Content -LiteralPath $ManifestPath)
    $activeProfile = $null

    foreach ($line in $lines) {
        if ($line -match "^\s*profile\s*:\s*([a-zA-Z0-9_-]+)") {
            $activeProfile = $matches[1]
            break
        }
    }

    $manualStarters = @{}
    $inManualStarters = $false
    $currentManualKey = $null

    foreach ($line in $lines) {
        if ($line -match "^\s*starters\s*:\s*$") {
            $inManualStarters = $true
            $currentManualKey = $null
            continue
        }

        if ($inManualStarters -and $line -match "^\S") {
            break
        }

        if ($inManualStarters -and $line -match "^\s{2}([a-zA-Z0-9_-]+)\s*:\s*$") {
            $currentManualKey = $matches[1]
            continue
        }

        if ($inManualStarters -and $null -ne $currentManualKey -and $line -match "^\s{4}repo\s*:\s*(.*?)\s*$") {
            $manualStarters[$currentManualKey] = Resolve-RepoValue -Value $matches[1]
        }
    }

    $profileStarters = @{}
    if (-not [string]::IsNullOrWhiteSpace($activeProfile)) {
        $profileHeaderRegex = "^\s{2}" + [regex]::Escape($activeProfile) + "\s*:\s*$"
        $profileStart = -1

        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match $profileHeaderRegex) {
                $profileStart = $i
                break
            }
        }

        if ($profileStart -ge 0) {
            $inProfileStarters = $false
            $currentProfileKey = $null

            for ($j = $profileStart + 1; $j -lt $lines.Count; $j++) {
                $line = $lines[$j]

                if ($line -match "^\s{2}[a-zA-Z0-9_-]+\s*:\s*$") {
                    break
                }

                if (-not $inProfileStarters -and $line -match "^\s{4}starters\s*:\s*$") {
                    $inProfileStarters = $true
                    continue
                }

                if ($inProfileStarters -and $line -match "^\s{4}[a-zA-Z0-9_-]+\s*:\s*$") {
                    break
                }

                if ($inProfileStarters -and $line -match "^\s{6}([a-zA-Z0-9_-]+)\s*:\s*$") {
                    $currentProfileKey = $matches[1]
                    continue
                }

                if ($inProfileStarters -and $null -ne $currentProfileKey -and $line -match "^\s{8}repo\s*:\s*(.*?)\s*$") {
                    $profileStarters[$currentProfileKey] = Resolve-RepoValue -Value $matches[1]
                }
            }
        }
    }

    $resolvedStarters = @{}
    foreach ($slot in @("contracts", "backend", "web", "client", "infra", "composition")) {
        $resolvedValue = $null
        if ($profileStarters.ContainsKey($slot)) {
            $resolvedValue = $profileStarters[$slot]
        }
        if ($manualStarters.ContainsKey($slot) -and $null -ne $manualStarters[$slot]) {
            $resolvedValue = $manualStarters[$slot]
        }
        $resolvedStarters[$slot] = $resolvedValue
    }

    return [pscustomobject]@{
        Profile = $activeProfile
        ProfileStarters = $profileStarters
        ManualStarters = $manualStarters
        ResolvedStarters = $resolvedStarters
        ManifestPath = $ManifestPath
    }
}

function Test-DirectoryHasContent {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return $false
    }

    return @(
        Get-ChildItem -LiteralPath $Path -Force -ErrorAction SilentlyContinue |
            Select-Object -First 1
    ).Count -gt 0
}

function Copy-StarterContent {
    param(
        [string]$SourcePath,
        [string]$TargetPath
    )

    $sourceItems = @(
        Get-ChildItem -LiteralPath $SourcePath -Force -ErrorAction Stop |
            Where-Object { $_.Name -ne ".git" }
    )

    foreach ($item in $sourceItems) {
        Copy-Item -LiteralPath $item.FullName -Destination $TargetPath -Recurse -Force -ErrorAction Stop
    }
}

function New-SlotResult {
    param(
        [string]$Slot,
        [string]$Repo,
        [string]$Path,
        [ValidateSet("PASS", "FAIL", "SKIP")]
        [string]$Result,
        [ValidateSet("yes", "no")]
        [string]$Collision,
        [string]$Reason
    )

    return [pscustomobject]@{
        slot = $Slot
        repo = $Repo
        path = $Path
        result = $Result
        collision = $Collision
        reason = $Reason
    }
}

if ([string]::IsNullOrWhiteSpace($WorkspaceRoot)) {
    $WorkspaceRoot = Convert-ToAbsolutePath -Path (Join-Path $ScriptDir "..")
} else {
    $WorkspaceRoot = Convert-ToAbsolutePath -Path $WorkspaceRoot
}

if ([string]::IsNullOrWhiteSpace($BootstrapPath)) {
    $BootstrapPath = Join-Path $WorkspaceRoot "PROJECT-BOOTSTRAP.yaml"
} else {
    $BootstrapPath = Convert-ToAbsolutePath -Path $BootstrapPath -BasePath $WorkspaceRoot
}

$SlotDefinitions = @(
    [pscustomobject]@{ Slot = "contracts"; Path = "app/contracts" },
    [pscustomobject]@{ Slot = "backend"; Path = "app/backend" },
    [pscustomobject]@{ Slot = "web"; Path = "app/web" },
    [pscustomobject]@{ Slot = "client"; Path = "app/client" },
    [pscustomobject]@{ Slot = "infra"; Path = "app/infra" },
    [pscustomobject]@{ Slot = "composition"; Path = "app/composition" }
)

$results = New-Object System.Collections.Generic.List[object]
$bootstrapInfo = $null
$generalReason = $null

try {
    $bootstrapInfo = Get-BootstrapInfo -ManifestPath $BootstrapPath
    if ([string]::IsNullOrWhiteSpace($bootstrapInfo.Profile)) {
        $generalReason = "project.profile is null or missing in PROJECT-BOOTSTRAP.yaml"
    }
}
catch {
    $generalReason = $_.Exception.Message
}

if (-not (Get-Command -Name "git" -ErrorAction SilentlyContinue)) {
    if ($null -eq $generalReason) {
        $generalReason = "git is required to install starter repositories"
    }
}

if ($null -ne $generalReason) {
    foreach ($slotDefinition in $SlotDefinitions) {
        $resolvedRepo = $null
        if ($null -ne $bootstrapInfo -and $bootstrapInfo.ResolvedStarters.ContainsKey($slotDefinition.Slot)) {
            $resolvedRepo = $bootstrapInfo.ResolvedStarters[$slotDefinition.Slot]
        }

        $results.Add(
            (New-SlotResult -Slot $slotDefinition.Slot -Repo $resolvedRepo -Path $slotDefinition.Path -Result "FAIL" -Collision "no" -Reason $generalReason)
        ) | Out-Null
    }
} else {
    foreach ($slotDefinition in $SlotDefinitions) {
        $slot = $slotDefinition.Slot
        $resolvedRepo = $bootstrapInfo.ResolvedStarters[$slot]
        $targetPath = Convert-ToAbsolutePath -Path $slotDefinition.Path -BasePath $WorkspaceRoot

        if ($null -eq $resolvedRepo) {
            $results.Add(
                (New-SlotResult -Slot $slot -Repo $null -Path $slotDefinition.Path -Result "SKIP" -Collision "no" -Reason "Resolved repo is null")
            ) | Out-Null
            continue
        }

        if (Test-DirectoryHasContent -Path $targetPath) {
            $results.Add(
                (New-SlotResult -Slot $slot -Repo $resolvedRepo -Path $slotDefinition.Path -Result "SKIP" -Collision "yes" -Reason "Target slot exists and is not empty")
            ) | Out-Null
            continue
        }

        $tempPath = $null
        $installSucceeded = $false

        try {
            $tempBasePath = [System.IO.Path]::GetTempPath()
            $tempName = "starter-$slot-$([guid]::NewGuid().ToString('N'))"
            $tempPath = Convert-ToAbsolutePath -Path (Join-Path $tempBasePath $tempName)

            New-Item -ItemType Directory -Path $tempPath -Force | Out-Null
            $tempPath = (Resolve-Path -LiteralPath $tempPath).Path

            $cloneSource = Resolve-StarterCloneSource -Repo $resolvedRepo -RepositoryRoot $WorkspaceRoot -ConfiguredBaseUri $StarterRepoBaseUri -DefaultGitHubOwner $DefaultGitHubOwner
            $cloneResult = Invoke-NativeCommand -Command "git" -Arguments @("clone", "--depth", "1", $cloneSource, $tempPath) -WorkingDirectory $WorkspaceRoot
            if ($cloneResult.ExitCode -ne 0) {
                $clonePreview = @($cloneResult.Output | Select-Object -Last 3) -join " | "
                if ([string]::IsNullOrWhiteSpace($clonePreview)) {
                    $clonePreview = "git clone failed with exit code $($cloneResult.ExitCode)"
                }

                $results.Add(
                    (New-SlotResult -Slot $slot -Repo $resolvedRepo -Path $slotDefinition.Path -Result "FAIL" -Collision "no" -Reason $clonePreview)
                ) | Out-Null
                continue
            }

            if (-not (Test-Path -LiteralPath $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
            }

            Copy-StarterContent -SourcePath $tempPath -TargetPath $targetPath
            $installSucceeded = $true

            $results.Add(
                (New-SlotResult -Slot $slot -Repo $resolvedRepo -Path $slotDefinition.Path -Result "PASS" -Collision "no" -Reason "Installed successfully")
            ) | Out-Null
        }
        catch {
            $reason = $_.Exception.Message
            if ([string]::IsNullOrWhiteSpace($reason)) {
                $reason = "Starter installation failed"
            }

            $results.Add(
                (New-SlotResult -Slot $slot -Repo $resolvedRepo -Path $slotDefinition.Path -Result "FAIL" -Collision "no" -Reason $reason)
            ) | Out-Null
        }
        finally {
            if (-not [string]::IsNullOrWhiteSpace($tempPath) -and (Test-Path -LiteralPath $tempPath)) {
                Remove-Item -LiteralPath $tempPath -Recurse -Force -ErrorAction SilentlyContinue
            }

            if ($installSucceeded) {
                $global:LASTEXITCODE = 0
            }
        }
    }
}

$overall = "PASS"
if (@($results | Where-Object { $_.result -eq "FAIL" }).Count -gt 0) {
    $overall = "FAIL"
}

$reportProfile = $null
if ($null -ne $bootstrapInfo) {
    $reportProfile = $bootstrapInfo.Profile
}

$reportResults = [object[]]$results.ToArray()
$report = [pscustomobject]@{
    profile = $reportProfile
    bootstrap = $BootstrapPath
    results = $reportResults
    overall = $overall
}

Write-Host "=== JSON REPORT ==="
$report | ConvertTo-Json -Depth 6
Write-Host "=== SUMMARY ==="
foreach ($row in $results) {
    Write-Host ("- {0} {1} collision={2} {3}" -f $row.slot, $row.result, $row.collision, $row.reason)
}
Write-Host ("- OVERALL {0}" -f $overall)

if ($overall -eq "FAIL") {
    exit 1
}

exit 0