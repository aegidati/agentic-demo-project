@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%\.." >nul 2>&1
if errorlevel 1 (
  echo Unable to move to repository root.
  echo Press any key to close...
  pause >nul
  exit /b 1
)

set "LOG_FILE=%CD%\scripts\run-checks.log"

echo ============================================================ > "%LOG_FILE%"
echo Validation launcher started: %DATE% %TIME% >> "%LOG_FILE%"
echo Repository root: %CD% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"

echo Running post-install validation...
powershell -NoProfile -ExecutionPolicy Bypass -File "%CD%\scripts\postinstall-checks.ps1" -SkipNpmCiIfNodeModules >> "%LOG_FILE%" 2>&1
set "PS_EXIT_CODE=%ERRORLEVEL%"

echo.
echo Validation log: %LOG_FILE%
echo.
echo ===== Last 80 lines =====
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path -LiteralPath '%LOG_FILE%') { Get-Content -LiteralPath '%LOG_FILE%' -Tail 80 } else { Write-Host 'Log file not found.' }"
echo =========================
echo.

if "%PS_EXIT_CODE%"=="0" (
  echo Final status: PASS ^(or only SKIP checks^)
) else (
  echo Final status: FAIL ^(see log for details^).
)

popd >nul
echo.
echo Press any key to close...
pause >nul
exit /b %PS_EXIT_CODE%