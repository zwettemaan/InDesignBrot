@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%~dp0.."
set "RUNTIME_DIR=%~dp0runtime"

if not exist "%PROJECT_DIR%\InDesignBrot_main.js" (
    echo Missing %PROJECT_DIR%\InDesignBrot_main.js 1>&2
    exit /b 1
)

if not exist "%PROJECT_DIR%\InDesignBrot.idjs" (
    echo Missing %PROJECT_DIR%\InDesignBrot.idjs 1>&2
    exit /b 1
)

if not exist "%PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxp.js" (
    echo Missing %PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxp.js 1>&2
    exit /b 1
)

if not exist "%PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN.js" (
    echo Missing %PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN.js 1>&2
    exit /b 1
)

if not exist "%PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN_bridge_runner.idjs" (
    echo Missing %PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN_bridge_runner.idjs 1>&2
    exit /b 1
)

if not exist "%RUNTIME_DIR%\CreativeDeveloperTools_UXP" mkdir "%RUNTIME_DIR%\CreativeDeveloperTools_UXP"

if exist "%RUNTIME_DIR%\InDesignBrot_doscript_probe.idjs" del "%RUNTIME_DIR%\InDesignBrot_doscript_probe.idjs"
if exist "%RUNTIME_DIR%\InDesignBrot_doscript_probe_helper.js" del "%RUNTIME_DIR%\InDesignBrot_doscript_probe_helper.js"
if exist "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN.js" del "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN.js"
if exist "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN_bridge_runner.idjs" del "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN_bridge_runner.idjs"

copy /y "%PROJECT_DIR%\InDesignBrot_main.js" "%RUNTIME_DIR%\InDesignBrot_main.js" >nul
copy /y "%PROJECT_DIR%\InDesignBrot.idjs" "%RUNTIME_DIR%\InDesignBrot.idjs" >nul
copy /y "%PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxp.js" "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxp.js" >nul
copy /y "%PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN.js" "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN.js" >nul
copy /y "%PROJECT_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN_bridge_runner.idjs" "%RUNTIME_DIR%\CreativeDeveloperTools_UXP\crdtuxpIDSN_bridge_runner.idjs" >nul

echo Staged InDesignBrot runtime into %RUNTIME_DIR%
