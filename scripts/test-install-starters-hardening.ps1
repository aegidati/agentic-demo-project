param(
    [string]$RepoRoot,
    [string[]]$TestCases,
    [switch]$KeepArtifacts,
    [string]$ReportDirectory,
    [switch]$EmitJsonReport,
    [switch]$EmitJunitReport
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
    $RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $ScriptDir ".."))
} else {
    $RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
}

$InstallScriptPath = Join-Path $RepoRoot "scripts/install-starters.ps1"
$ValidationScriptPath = Join-Path $RepoRoot "scripts/postinstall-checks.ps1"
$TempRoot = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetTempPath()) ("starter-hardening-" + [guid]::NewGuid().ToString("N"))))
$StarterRoot = Join-Path $TempRoot "starters"
$WorkspaceRoot = Join-Path $TempRoot "workspaces"
$ValidationRoot = Join-Path $TempRoot "validation"

New-Item -ItemType Directory -Path $StarterRoot -Force | Out-Null
New-Item -ItemType Directory -Path $WorkspaceRoot -Force | Out-Null
New-Item -ItemType Directory -Path $ValidationRoot -Force | Out-Null

$TestResults = New-Object System.Collections.Generic.List[object]

if (-not [string]::IsNullOrWhiteSpace($ReportDirectory)) {
    if (-not [System.IO.Path]::IsPathRooted($ReportDirectory)) {
        $ReportDirectory = [System.IO.Path]::GetFullPath((Join-Path $RepoRoot $ReportDirectory))
    } else {
        $ReportDirectory = [System.IO.Path]::GetFullPath($ReportDirectory)
    }

    if ((-not $EmitJsonReport) -and (-not $EmitJunitReport)) {
        $EmitJsonReport = $true
        $EmitJunitReport = $true
    }
}

function Add-TestResult {
    param(
        [string]$Name,
        [ValidateSet("PASS", "FAIL")]
        [string]$Status,
        [string]$Details
    )

    $TestResults.Add([pscustomobject]@{
        Test = $Name
        Status = $Status
        Details = $Details
    }) | Out-Null
}

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Convert-ToYamlScalar {
    param([object]$Value)

    if ($null -eq $Value) {
        return "null"
    }

    $text = [string]$Value
    return "'" + ($text -replace "'", "''") + "'"
}

function Convert-ToXmlEscaped {
    param([string]$Value)

    if ($null -eq $Value) {
        return ""
    }

    return [System.Security.SecurityElement]::Escape($Value)
}

function Write-JsonReport {
    param(
        [object[]]$Results,
        [string]$OutputPath,
        [string]$RepositoryRoot,
        [string]$TemporaryRoot,
        [bool]$KeepTempArtifacts
    )

    $report = [pscustomobject]@{
        generatedAt = [DateTime]::UtcNow.ToString("o")
        repositoryRoot = $RepositoryRoot
        tempRoot = $TemporaryRoot
        keepArtifacts = $KeepTempArtifacts
        summary = [pscustomobject]@{
            total = @($Results).Count
            passed = @(@($Results) | Where-Object { $_.Status -eq "PASS" }).Count
            failed = @(@($Results) | Where-Object { $_.Status -eq "FAIL" }).Count
        }
        results = @($Results)
    }

    $parentPath = Split-Path -Parent $OutputPath
    if (-not (Test-Path -LiteralPath $parentPath)) {
        New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
    }

    $report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputPath
}

function Write-JunitReport {
    param(
        [object[]]$Results,
        [string]$OutputPath
    )

    $total = @($Results).Count
    $failures = @(@($Results) | Where-Object { $_.Status -eq "FAIL" }).Count
    $timestamp = [DateTime]::UtcNow.ToString("o")

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add('<?xml version="1.0" encoding="UTF-8"?>') | Out-Null
    $lines.Add("<testsuites>") | Out-Null
    $lines.Add(('  <testsuite name="install-starters-hardening" tests="{0}" failures="{1}" errors="0" skipped="0" timestamp="{2}">' -f $total, $failures, $timestamp)) | Out-Null

    foreach ($result in $Results) {
        $testName = Convert-ToXmlEscaped -Value $result.Test
        $details = Convert-ToXmlEscaped -Value $result.Details
        $lines.Add(('    <testcase classname="install-starters-hardening" name="{0}">' -f $testName)) | Out-Null
        if ($result.Status -eq "FAIL") {
            $lines.Add(('      <failure message="Assertion failed">{0}</failure>' -f $details)) | Out-Null
        }
        $lines.Add("    </testcase>") | Out-Null
    }

    $lines.Add("  </testsuite>") | Out-Null
    $lines.Add("</testsuites>") | Out-Null

    $parentPath = Split-Path -Parent $OutputPath
    if (-not (Test-Path -LiteralPath $parentPath)) {
        New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
    }

    Set-Content -LiteralPath $OutputPath -Value $lines
}

function Invoke-GitQuiet {
    param(
        [string]$RepositoryPath,
        [string[]]$Arguments
    )

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        $null = & git -C $RepositoryPath @Arguments 2>$null
        if ($LASTEXITCODE -ne 0) {
            throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE"
        }
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
}

function New-GitStarterRepo {
    param(
        [string]$Name,
        [hashtable]$Files
    )

    $path = Join-Path $StarterRoot $Name
    New-Item -ItemType Directory -Path $path -Force | Out-Null

    foreach ($entry in $Files.GetEnumerator()) {
        $filePath = Join-Path $path $entry.Key
        $parentPath = Split-Path -Parent $filePath
        if (-not (Test-Path -LiteralPath $parentPath)) {
            New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
        }

        Set-Content -LiteralPath $filePath -Value $entry.Value
    }

    Invoke-GitQuiet -RepositoryPath $path -Arguments @("init", "-b", "main")
    Invoke-GitQuiet -RepositoryPath $path -Arguments @("config", "user.email", "tests@example.com")
    Invoke-GitQuiet -RepositoryPath $path -Arguments @("config", "user.name", "Starter Hardening Tests")
    Invoke-GitQuiet -RepositoryPath $path -Arguments @("add", ".")
    Invoke-GitQuiet -RepositoryPath $path -Arguments @("commit", "-m", "init")

    return $path
}

function New-Workspace {
    param(
        [string]$Name,
        [string]$ProfileName,
        [hashtable]$ProfileStarters,
        [hashtable]$ManualStarters,
        [hashtable]$PrepopulateFiles
    )

    $path = Join-Path $WorkspaceRoot $Name
    New-Item -ItemType Directory -Path $path -Force | Out-Null

    $slots = @("backend", "web", "client", "contracts", "infra", "composition")
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("project:") | Out-Null
    if (-not [string]::IsNullOrWhiteSpace($ProfileName)) {
        $lines.Add("  profile: $ProfileName") | Out-Null
    }

    $lines.Add("profiles:") | Out-Null
    if (-not [string]::IsNullOrWhiteSpace($ProfileName)) {
        $lines.Add("  ${ProfileName}:") | Out-Null
        $lines.Add("    starters:") | Out-Null
        foreach ($slot in $slots) {
            $value = $null
            if ($ProfileStarters.ContainsKey($slot)) {
                $value = $ProfileStarters[$slot]
            }

            $lines.Add("      ${slot}:") | Out-Null
            $lines.Add("        repo: $(Convert-ToYamlScalar -Value $value)") | Out-Null
        }
    }

    $lines.Add("starters:") | Out-Null
    foreach ($slot in $slots) {
        $value = $null
        if ($ManualStarters.ContainsKey($slot)) {
            $value = $ManualStarters[$slot]
        }

        $lines.Add("  ${slot}:") | Out-Null
        $lines.Add("    repo: $(Convert-ToYamlScalar -Value $value)") | Out-Null
    }

    Set-Content -LiteralPath (Join-Path $path "PROJECT-BOOTSTRAP.yaml") -Value $lines

    foreach ($entry in $PrepopulateFiles.GetEnumerator()) {
        $filePath = Join-Path $path $entry.Key
        $parentPath = Split-Path -Parent $filePath
        if (-not (Test-Path -LiteralPath $parentPath)) {
            New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
        }

        Set-Content -LiteralPath $filePath -Value $entry.Value
    }

    return $path
}

function Invoke-ProcessCapture {
    param(
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [hashtable]$EnvironmentOverrides
    )

    $quotedArguments = @(
        foreach ($argument in $Arguments) {
            if ($argument -match '[\s"]') {
                '"' + ($argument -replace '"', '\"') + '"'
            } else {
                $argument
            }
        }
    )

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $FilePath
    $psi.Arguments = [string]::Join(" ", $quotedArguments)
    $psi.WorkingDirectory = $WorkingDirectory
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false

    foreach ($entry in $EnvironmentOverrides.GetEnumerator()) {
        $psi.EnvironmentVariables[$entry.Key] = $entry.Value
    }

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    $null = $process.Start()
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()

    return [pscustomobject]@{
        ExitCode = $process.ExitCode
        StdOut = $stdout
        StdErr = $stderr
        Combined = ($stdout + [Environment]::NewLine + $stderr)
    }
}

function Get-InstallerJsonReport {
    param([string]$Output)

    $match = [regex]::Match($Output, "(?s)=== JSON REPORT ===\s*(\{.*?\})\s*=== SUMMARY ===")
    if (-not $match.Success) {
        throw "JSON report section not found"
    }

    return ($match.Groups[1].Value | ConvertFrom-Json)
}

function Invoke-Installer {
    param(
        [string]$Workspace,
        [string]$WrapperScript,
        [hashtable]$EnvironmentOverrides
    )

    if ([string]::IsNullOrWhiteSpace($WrapperScript)) {
        return Invoke-ProcessCapture -FilePath "powershell.exe" -Arguments @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $InstallScriptPath, "-WorkspaceRoot", $Workspace) -WorkingDirectory $RepoRoot -EnvironmentOverrides $EnvironmentOverrides
    }

    return Invoke-ProcessCapture -FilePath "powershell.exe" -Arguments @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $WrapperScript, "-RepoRoot", $RepoRoot, "-Workspace", $Workspace) -WorkingDirectory $RepoRoot -EnvironmentOverrides $EnvironmentOverrides
}

function New-WrapperScript {
    param(
        [string]$Name,
        [string[]]$Lines
    )

    $path = Join-Path $TempRoot $Name
    Set-Content -LiteralPath $path -Value $Lines
    return $path
}

$repoContracts = New-GitStarterRepo -Name "contracts" -Files @{
    "openapi.yaml" = "openapi: 3.0.0`ninfo:`n  title: Contracts`n  version: 1.0.0"
}
$repoBackend = New-GitStarterRepo -Name "backend" -Files @{
    "README.md" = "backend"
    "src/backend.txt" = "backend starter"
}
$repoWeb = New-GitStarterRepo -Name "web" -Files @{
    "README.md" = "web"
    "src/web.txt" = "web starter"
}
$repoAltWeb = New-GitStarterRepo -Name "web-alt" -Files @{
    "README.md" = "web-alt"
    "src/web.txt" = "alt web starter"
}
$repoInfra = New-GitStarterRepo -Name "infra" -Files @{
    "docker-compose.yml" = "services:`n  db:`n    image: postgres:16"
}
$null = New-GitStarterRepo -Name "relative-backend" -Files @{
    "README.md" = "relative backend"
    "src/backend.txt" = "relative backend starter"
}

$baseProfile = @{
    contracts = $repoContracts
    backend = $repoBackend
    web = $repoWeb
    client = $null
    infra = $repoInfra
    composition = $null
}

$nullOverrides = @{
    backend = $null
    web = $null
    client = $null
    contracts = $null
    infra = $null
    composition = $null
}

$cleanupWrapper = New-WrapperScript -Name "invoke-with-cleanup-failure.ps1" -Lines @(
    "param([string]`$RepoRoot,[string]`$Workspace)",
    "Set-StrictMode -Version Latest",
    "`$ErrorActionPreference = 'Stop'",
    "function Remove-Item {",
    "    [CmdletBinding()]",
    "    param([string]`$LiteralPath,[switch]`$Recurse,[switch]`$Force)",
    "    Write-Error 'Simulated cleanup failure'",
    "}",
    "& (Join-Path `$RepoRoot 'scripts/install-starters.ps1') -WorkspaceRoot `$Workspace"
)

$stderrWrapper = New-WrapperScript -Name "invoke-with-git-stderr.ps1" -Lines @(
    "param([string]`$RepoRoot,[string]`$Workspace)",
    "Set-StrictMode -Version Latest",
    "`$ErrorActionPreference = 'Stop'",
    "`$realGit = (Get-Command git).Source",
    "function git {",
    "    [CmdletBinding()]",
    "    param([Parameter(ValueFromRemainingArguments = `$true)][object[]]`$Arguments)",
    "    [Console]::Error.WriteLine('benign stderr from wrapper')",
    "    & `$realGit @Arguments",
    "}",
    "& (Join-Path `$RepoRoot 'scripts/install-starters.ps1') -WorkspaceRoot `$Workspace"
)

$SelectedTests = @()
if (($null -ne $TestCases) -and ($TestCases.Count -gt 0)) {
    $SelectedTests = @($TestCases)
}

$TestDefinitions = @(
    [pscustomobject]@{
        Name = "TC-01 Profile-first resolution"
        Action = {
            $workspace = New-Workspace -Name "tc01" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            Assert-True ($run.ExitCode -eq 0) "Expected exit code 0"
            Assert-True ($report.results.Where({ $_.slot -eq "web" })[0].repo -eq $repoWeb) "Expected web repo from profile"
            Assert-True ($report.results.Where({ $_.slot -eq "client" })[0].result -eq "SKIP") "Expected client SKIP"
            Assert-True ($report.results.Where({ $_.slot -eq "contracts" })[0].result -eq "PASS") "Expected contracts PASS"

            "profile-first resolution verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-02 Manual override precedence"
        Action = {
            $manualOverrides = @{
                backend = $null
                web = $repoAltWeb
                client = $null
                contracts = $null
                infra = $null
                composition = $null
            }

            $workspace = New-Workspace -Name "tc02" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $manualOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            Assert-True ($run.ExitCode -eq 0) "Expected exit code 0"
            Assert-True ($report.results.Where({ $_.slot -eq "web" })[0].repo -eq $repoAltWeb) "Expected web manual override"
            Assert-True ((Get-Content -LiteralPath (Join-Path $workspace "app/web/src/web.txt") -Raw).Trim() -eq "alt web starter") "Expected overridden web content"

            "manual override verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-03 Canonical path enforcement"
        Action = {
            $relativeBackendForWorkspace = "..\\..\\starters\\relative-backend"
            $profileStarters = @{
                contracts = $repoContracts
                backend = $relativeBackendForWorkspace
                web = $repoWeb
                client = $null
                infra = $repoInfra
                composition = $null
            }

            $workspace = New-Workspace -Name "tc03" -ProfileName "web-stack" -ProfileStarters $profileStarters -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined
            $allowedPaths = @("app/backend", "app/web", "app/client", "app/contracts", "app/infra", "app/composition")
            $createdDirectories = @()

            if (Test-Path -LiteralPath (Join-Path $workspace "app")) {
                $createdDirectories = @(
                    Get-ChildItem -LiteralPath (Join-Path $workspace "app") -Directory |
                        Select-Object -ExpandProperty Name
                )
            }

            Assert-True ((@($report.results | Where-Object { $allowedPaths -notcontains $_.path })).Count -eq 0) "Unexpected non-canonical path in report"
            Assert-True ((@($createdDirectories | Where-Object { $_ -notin @("backend", "web", "contracts", "infra") })).Count -eq 0) "Unexpected directory created outside canonical slots"
            Assert-True ((Get-Content -LiteralPath (Join-Path $workspace "app/backend/src/backend.txt") -Raw).Trim() -eq "relative backend starter") "Expected relative local starter installation"

            "canonical paths and relative local starter resolution verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-04 Collision non distruttiva"
        Action = {
            $workspace = New-Workspace -Name "tc04" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $nullOverrides -PrepopulateFiles @{
                "app/web/existing.txt" = "keep-me"
            }
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined
            $webResult = $report.results.Where({ $_.slot -eq "web" })[0]

            Assert-True ($webResult.result -eq "SKIP") "Expected web SKIP"
            Assert-True ($webResult.collision -eq "yes") "Expected collision=yes"
            Assert-True ((Get-Content -LiteralPath (Join-Path $workspace "app/web/existing.txt") -Raw).Trim() -eq "keep-me") "Existing file was modified"
            Assert-True ($report.results.Where({ $_.slot -eq "backend" })[0].result -eq "PASS") "Other slots should continue"

            "non-destructive collision verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-05 Temp cleanup robustness"
        Action = {
            $workspace = New-Workspace -Name "tc05" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -WrapperScript $cleanupWrapper -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            Assert-True ($run.ExitCode -eq 0) "Cleanup failure should not fail successful install"
            Assert-True ($report.results.Where({ $_.slot -eq "web" })[0].result -eq "PASS") "Expected PASS despite cleanup failure"

            "cleanup failure remained non-blocking"
        }
    },
    [pscustomobject]@{
        Name = "TC-06 Native command stderr tolerance"
        Action = {
            $workspace = New-Workspace -Name "tc06" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -WrapperScript $stderrWrapper -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            Assert-True ($run.ExitCode -eq 0) "Expected success even with benign stderr"
            Assert-True ($report.results.Where({ $_.slot -eq "backend" })[0].result -eq "PASS") "Expected backend PASS"
            Assert-True ($run.Combined -match "benign stderr from wrapper") "Expected wrapper stderr evidence"

            "stderr tolerance verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-07 Idempotent rerun"
        Action = {
            $workspace = New-Workspace -Name "tc07" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $firstRun = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $secondRun = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $secondRun.Combined

            Assert-True ($firstRun.ExitCode -eq 0) "Initial install failed unexpectedly"
            Assert-True ($secondRun.ExitCode -eq 0) "Rerun should not fail"
            Assert-True ($report.results.Where({ $_.slot -eq "backend" })[0].result -eq "SKIP") "Expected backend SKIP on rerun"
            Assert-True ($report.results.Where({ $_.slot -eq "backend" })[0].collision -eq "yes") "Expected collision=yes on rerun"

            "idempotent rerun verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-08 Report schema completeness"
        Action = {
            $workspace = New-Workspace -Name "tc08" -ProfileName "web-stack" -ProfileStarters $baseProfile -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            foreach ($row in @($report.results)) {
                foreach ($field in @("slot", "repo", "path", "result", "collision", "reason")) {
                    Assert-True (($row.PSObject.Properties.Name -contains $field)) "Missing field $field"
                }
            }

            Assert-True ((@($report.results)).Count -eq 6) "Expected six slot results"

            "report schema verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-09 Missing profile guard"
        Action = {
            $workspace = New-Workspace -Name "tc09" -ProfileName "" -ProfileStarters @{} -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            Assert-True ($run.ExitCode -ne 0) "Expected non-zero exit code"
            Assert-True ((@($report.results | Where-Object { $_.result -ne "FAIL" })).Count -eq 0) "Expected all FAIL results"
            Assert-True ((@($report.results | Where-Object { $_.reason -notmatch "project.profile is null or missing" })).Count -eq 0) "Expected explicit missing profile reason"

            "missing profile guard verified"
        }
    },
    [pscustomobject]@{
        Name = "TC-10 Partial failure isolation"
        Action = {
            $profileStarters = @{
                contracts = $repoContracts
                backend = "this-repo-does-not-exist"
                web = $repoWeb
                client = $null
                infra = $repoInfra
                composition = $null
            }

            $workspace = New-Workspace -Name "tc10" -ProfileName "web-stack" -ProfileStarters $profileStarters -ManualStarters $nullOverrides -PrepopulateFiles @{}
            $run = Invoke-Installer -Workspace $workspace -EnvironmentOverrides @{}
            $report = Get-InstallerJsonReport -Output $run.Combined

            Assert-True ($run.ExitCode -ne 0) "Expected non-zero exit code due to one failing slot"
            Assert-True ($report.results.Where({ $_.slot -eq "backend" })[0].result -eq "FAIL") "Expected backend FAIL"
            Assert-True ($report.results.Where({ $_.slot -eq "web" })[0].result -eq "PASS") "Expected other slots to continue"

            "partial failure isolation verified"
        }
    },
    [pscustomobject]@{
        Name = "AC-07 Validation gate negative check"
        Action = {
            $validationRepo = Join-Path $ValidationRoot "negative-gate"
            New-Item -ItemType Directory -Path (Join-Path $validationRepo "scripts") -Force | Out-Null
            Copy-Item -LiteralPath $ValidationScriptPath -Destination (Join-Path $validationRepo "scripts/postinstall-checks.ps1") -Force
            Set-Content -LiteralPath (Join-Path $validationRepo "scripts/install-starters.ps1") -Value 'param(); Write-Host "unsafe"'
            Set-Content -LiteralPath (Join-Path $validationRepo "PROJECT-BOOTSTRAP.yaml") -Value @(
                "project:",
                "  profile: test-profile",
                "profiles:",
                "  test-profile:",
                "    starters:",
                "      backend:",
                "        repo: null",
                "      web:",
                "        repo: null",
                "      client:",
                "        repo: null",
                "      contracts:",
                "        repo: null",
                "      infra:",
                "        repo: null",
                "      composition:",
                "        repo: null",
                "starters:",
                "  backend:",
                "    repo: null",
                "  web:",
                "    repo: null",
                "  client:",
                "    repo: null",
                "  contracts:",
                "    repo: null",
                "  infra:",
                "    repo: null",
                "  composition:",
                "    repo: null"
            )

            $run = Invoke-ProcessCapture -FilePath "powershell.exe" -Arguments @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", (Join-Path $validationRepo "scripts/postinstall-checks.ps1")) -WorkingDirectory $validationRepo -EnvironmentOverrides @{}
            Assert-True ($run.ExitCode -ne 0) "Expected validation gate failure"
            Assert-True (($run.Combined -match "Missing Test-Path -LiteralPath") -or ($run.Combined -match "Missing finally block")) "Expected hardening gate diagnostics"

            "validation gate negative case verified"
        }
    }
)

try {
    foreach ($testDefinition in $TestDefinitions) {
        if (($SelectedTests.Count -gt 0) -and ($SelectedTests -notcontains $testDefinition.Name)) {
            continue
        }

        try {
            $details = & $testDefinition.Action
            Add-TestResult -Name $testDefinition.Name -Status "PASS" -Details $details
        }
        catch {
            Add-TestResult -Name $testDefinition.Name -Status "FAIL" -Details ($_.Exception.ToString())
        }
    }

    if ($EmitJsonReport -or $EmitJunitReport) {
        $effectiveReportDirectory = $ReportDirectory
        $finalResults = [object[]]$TestResults.ToArray()
        if ([string]::IsNullOrWhiteSpace($effectiveReportDirectory)) {
            $effectiveReportDirectory = Join-Path $RepoRoot "scripts/test-results"
        }

        if (-not (Test-Path -LiteralPath $effectiveReportDirectory)) {
            New-Item -ItemType Directory -Path $effectiveReportDirectory -Force | Out-Null
        }

        if ($EmitJsonReport) {
            $jsonPath = Join-Path $effectiveReportDirectory "install-starters-hardening-results.json"
            Write-JsonReport -Results $finalResults -OutputPath $jsonPath -RepositoryRoot $RepoRoot -TemporaryRoot $TempRoot -KeepTempArtifacts ([bool]$KeepArtifacts)
            Write-Host ("JSON report written: " + $jsonPath)
        }

        if ($EmitJunitReport) {
            $junitPath = Join-Path $effectiveReportDirectory "install-starters-hardening-results.junit.xml"
            Write-JunitReport -Results $finalResults -OutputPath $junitPath
            Write-Host ("JUnit report written: " + $junitPath)
        }
    }

    $TestResults | Format-Table -AutoSize | Out-String | Write-Host
    if ((@($TestResults | Where-Object { $_.Status -eq "FAIL" })).Count -gt 0) {
        exit 1
    }

    exit 0
}
finally {
    if ((-not $KeepArtifacts) -and (Test-Path -LiteralPath $TempRoot)) {
        Remove-Item -LiteralPath $TempRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}