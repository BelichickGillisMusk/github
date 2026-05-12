# Deploy gumption-api to Cloud Run from source (PowerShell parity to deploy-gcp.sh).
#
# Usage:
#   $env:PROJECT_ID = "temporal-frame-494501-p5"
#   pwsh the-unit/scripts/deploy-gcp.ps1

$ErrorActionPreference = "Stop"

$ProjectId      = $env:PROJECT_ID;       if (-not $ProjectId)      { throw "Set PROJECT_ID" }
$Region         = if ($env:REGION)          { $env:REGION }          else { "us-central1" }
$Service        = if ($env:SERVICE)         { $env:SERVICE }         else { "gumption-api" }
$SaName         = if ($env:SA_NAME)         { $env:SA_NAME }         else { "gumption-api" }
$DailyTokenCap  = if ($env:DAILY_TOKEN_CAP) { $env:DAILY_TOKEN_CAP } else { "250000" }
$SaEmail        = "$SaName@$ProjectId.iam.gserviceaccount.com"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceDir = (Resolve-Path (Join-Path $ScriptDir "..\api")).Path

Write-Host "==> Project: $ProjectId"
Write-Host "==> Region:  $Region"
Write-Host "==> Service: $Service"
Write-Host "==> Source:  $SourceDir"

gcloud config set project $ProjectId | Out-Null

$SecretsParts = @()
foreach ($pair in @("anthropic-key:ANTHROPIC_API_KEY","openai-key:OPENAI_API_KEY","xai-key:XAI_API_KEY")) {
    $name,$envVar = $pair -split ":"
    gcloud secrets describe $name --project=$ProjectId 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $SecretsParts += "$envVar=$name`:latest"
    } else {
        Write-Host "   ... secret $name not found, skipping ($envVar)"
    }
}
$SecretsArg = $SecretsParts -join ","

$EnvVars = "GCP_PROJECT=$ProjectId,GCP_REGION=$Region,DAILY_TOKEN_CAP=$DailyTokenCap"

$deployArgs = @(
  "run","deploy",$Service,
  "--source",$SourceDir,
  "--region",$Region,
  "--platform","managed",
  "--allow-unauthenticated",
  "--service-account",$SaEmail,
  "--memory","512Mi",
  "--cpu","1",
  "--concurrency","40",
  "--timeout","300",
  "--max-instances","10",
  "--set-env-vars",$EnvVars
)
if ($SecretsArg) { $deployArgs += @("--set-secrets",$SecretsArg) }

Write-Host "==> Deploying"
& gcloud @deployArgs

$Url = gcloud run services describe $Service --region $Region --format='value(status.url)'
Write-Host ""
Write-Host "Deployed: $Url"
Write-Host "Health:   curl $Url/healthz"
