param(
    [string]$TargetPath = "scripts/postinstall-checks.ps1"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $TargetPath)) {
    throw "File not found: $TargetPath"
}

$content = Get-Content -LiteralPath $TargetPath -Raw

$startMarker = "function Validate-FlutterStarter {"
$endMarker = "function Get-StarterOverallStatus {"

$startIndex = $content.IndexOf($startMarker)
if ($startIndex -lt 0) {
    throw "Start marker not found: $startMarker"
}

$endIndex = $content.IndexOf($endMarker, $startIndex)
if ($endIndex -lt 0) {
    throw "End marker not found: $endMarker"
}

$newFunction = @'
function Validate-FlutterStarter {
    param(
        [string]$StarterId,
        [string]$StarterPath
    )

    Add-Result -Starter $StarterId -Check "Path exists" -Status "PASS" -Details $StarterPath

    $pubspecPath = Join-Path $StarterPath "pubspec.yaml"
    $flutterProjectPath = $StarterPath

    # Support both layouts:
    # - app/client/pubspec.yaml
    # - app/client/app/pubspec.yaml
    if (-not (Test-Path -LiteralPath $pubspecPath)) {
        $nestedPubspecPath = Join-Path (Join-Path $StarterPath "app") "pubspec.yaml"
        if (Test-Path -LiteralPath $nestedPubspecPath) {
            $pubspecPath = $nestedPubspecPath
            $flutterProjectPath = Split-Path -Parent $nestedPubspecPath
        }
    }

    if (-not (Test-Path -LiteralPath $pubspecPath)) {
        Add-Result -Starter $StarterId -Check "Flutter project discovery" -Status "SKIP" -Details "pubspec.yaml not found"
        return
    }
    Add-Result -Starter $StarterId -Check "Flutter project discovery" -Status "PASS" -Details "pubspec.yaml found"

    $hasFlutter = Test-CommandAvailable -Name "flutter"
    $hasDart = Test-CommandAvailable -Name "dart"

    if (-not $hasFlutter -and -not $hasDart) {
        Add-Result -Starter $StarterId -Check "Flutter/Dart availability" -Status "SKIP" -Details "Neither flutter nor dart detected"
        return
    }

    if ($hasFlutter) {
        [void](Invoke-Step -Starter $StarterId -Check "flutter --version" -WorkingDirectory $flutterProjectPath -Command "flutter" -Arguments @("--version"))

        $pkgConfig = Join-Path $flutterProjectPath ".dart_tool/package_config.json"
        if (Test-Path -LiteralPath $pkgConfig) {
            [void](Invoke-Step -Starter $StarterId -Check "flutter analyze" -WorkingDirectory $flutterProjectPath -Command "flutter" -Arguments @("analyze"))
        } else {
            Add-Result -Starter $StarterId -Check "flutter analyze" -Status "SKIP" -Details "Dependencies not restored (.dart_tool/package_config.json missing)"
        }
    } else {
        [void](Invoke-Step -Starter $StarterId -Check "dart --version" -WorkingDirectory $flutterProjectPath -Command "dart" -Arguments @("--version"))
        Add-Result -Starter $StarterId -Check "Flutter-specific checks" -Status "SKIP" -Details "flutter not detected"
    }
}

'@

$before = $content.Substring(0, $startIndex)
$after = $content.Substring($endIndex)

$updated = $before + $newFunction + $after

Set-Content -LiteralPath $TargetPath -Value $updated -Encoding UTF8

Write-Host "Patch applied successfully to $TargetPath"