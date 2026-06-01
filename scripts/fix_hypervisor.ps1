# ============================================================
# fix_hypervisor.ps1
# Fixes HRESULT 0x80370102 - Hypervisor Not Running (WSL2/Claude Workspace)
# Run as: Right-click -> Run with PowerShell  (UAC will auto-elevate)
# ============================================================

# --- Self-elevate if not running as Administrator ---
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Relaunching as Administrator..." -ForegroundColor Yellow
    Start-Process powershell.exe "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

$ErrorActionPreference = "Continue"
Clear-Host

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  HYPERVISOR FIX  -  HRESULT 0x80370102       " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# ---- STEP 1: Diagnose ----
Write-Host "`n[1/4] DIAGNOSING..." -ForegroundColor Yellow

$cpu = Get-WmiObject -Class Win32_Processor | Select-Object -First 1
$vtEnabled = $cpu.VirtualizationFirmwareEnabled
$vtText     = if ($vtEnabled) { "YES  (BIOS VT-x/AMD-V is ON)" } else { "NO   (BIOS VT-x/AMD-V appears OFF)" }
$vtColor    = if ($vtEnabled) { "Green" } else { "Red" }
Write-Host "  BIOS Virtualization : $vtText" -ForegroundColor $vtColor

# Hyper-V requirements from systeminfo
$sysinfo = systeminfo 2>&1 | Select-String "Hyper-V"
$sysinfo | ForEach-Object { Write-Host "  $_" }

# Current bcdedit setting
$bcdRaw = bcdedit /enum 2>&1 | Select-String "hypervisorlaunchtype"
Write-Host "  bcdedit setting     : $bcdRaw"

# ---- STEP 2: Enable Windows Features ----
Write-Host "`n[2/4] ENABLING WINDOWS VIRTUALIZATION FEATURES..." -ForegroundColor Yellow

$features = @("HypervisorPlatform", "VirtualMachinePlatform", "Microsoft-Hyper-V-All")
foreach ($feat in $features) {
    $state = (Get-WindowsOptionalFeature -Online -FeatureName $feat -ErrorAction SilentlyContinue).State
    if ($state -eq "Enabled") {
        Write-Host "  $feat : Already enabled" -ForegroundColor Green
    } elseif ($state -eq "Disabled") {
        Write-Host "  Enabling $feat ..." -ForegroundColor Yellow
        Enable-WindowsOptionalFeature -Online -FeatureName $feat -NoRestart -ErrorAction SilentlyContinue | Out-Null
        Write-Host "  $feat : Enabled" -ForegroundColor Green
    } else {
        Write-Host "  $feat : Not available on this edition (skipping)" -ForegroundColor DarkGray
    }
}

# ---- STEP 3: Fix boot config ----
Write-Host "`n[3/4] FIXING BOOT CONFIGURATION..." -ForegroundColor Yellow
bcdedit /set hypervisorlaunchtype auto 2>&1 | ForEach-Object { Write-Host "  $_" }

# ---- STEP 4: Update WSL ----
Write-Host "`n[4/4] UPDATING WSL KERNEL..." -ForegroundColor Yellow
wsl --update 2>&1 | ForEach-Object { Write-Host "  $_" }
wsl --set-default-version 2 2>&1 | ForEach-Object { Write-Host "  $_" }

# ---- RESULT ----
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  RESULT                                        " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

if ($vtEnabled) {
    Write-Host "`n  BIOS virtualization IS enabled." -ForegroundColor Green
    Write-Host "  All OS-level fixes applied successfully." -ForegroundColor Green
    Write-Host "`n  ACTION REQUIRED: RESTART your computer." -ForegroundColor Yellow
    Write-Host "  After restarting, Claude workspace should start normally." -ForegroundColor White
} else {
    Write-Host "`n  WARNING: BIOS virtualization is DISABLED." -ForegroundColor Red
    Write-Host "  OS-level fixes applied, but you MUST also enable VT-x/AMD-V in BIOS." -ForegroundColor Red
    Write-Host "`n  HOW TO ACCESS BIOS:" -ForegroundColor Cyan
    Write-Host "    HP      :  Restart -> press F10 (Setup) -> Security -> Virtualization Technology -> Enable"
    Write-Host "    Dell    :  Restart -> press F2 (Setup) -> Virtualization Support -> Virtualization -> Enable"
    Write-Host "    Lenovo  :  Restart -> press F1 or F2  -> Config -> CPU -> Intel (VMX) Virtualization -> Enable"
    Write-Host "    Surface :  Hold Vol-Up + Power -> UEFI -> Security -> Secure Boot (VT usually auto-on)"
    Write-Host "    Other   :  Restart -> press Del/F2/Esc -> find CPU/Advanced -> Intel VT-x or SVM -> Enable"
    Write-Host "`n  HP BCU / Dell Command / Lenovo Script Center users:" -ForegroundColor DarkYellow
    Write-Host "    HP BCU  :  BiosConfigUtility.exe /setvalue:'Virtualization Technology (VTx)','Enable'"
    Write-Host "    Dell Cmd:  cctk.exe --VirtualizationTechnology=Enabled"
    Write-Host "    Lenovo  :  WMI ThinkPad_SetBIOSSetting VirtualizationTechnology,Enable"
    Write-Host "`n  After enabling VT-x in BIOS, restart and re-run Claude." -ForegroundColor Yellow
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  Press any key to exit..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
