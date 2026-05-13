param(
  [string]$ProjectId = "samantha-gumption",
  [string]$Region = "us-west1",
  [string]$Service = "gumption-api"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ApiDir = Join-Path $RepoRoot "api"
$WebDir = Join-Path $RepoRoot "web"

function Test-GcpSecret {
  param([string]$Name)
  & gcloud secrets describe $Name --project $ProjectId *> $null
  return $LASTEXITCODE -eq 0
}

$SecretBindings = @()
foreach ($Name in @("ANTHROPIC_API_KEY", "OPENAI_API_KEY", "XAI_API_KEY", "ALERT_TO_PHONE", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM", "TWILIO_SMS_FROM", "TWILIO_VOICE_FROM")) {
  if (Test-GcpSecret $Name) {
    $SecretBindings += ("{0}={0}:latest" -f $Name)
  }
}

Write-Host "Deploying $Service to Cloud Run in $ProjectId / $Region..."
Push-Location $ApiDir
try {
  $RunArgs = @(
    "run", "deploy", $Service,
    "--source", ".",
    "--project", $ProjectId,
    "--region", $Region,
    "--allow-unauthenticated",
    "--set-env-vars", "GCP_PROJECT_ID=$ProjectId,VERTEX_LOCATION=$Region"
  )
  if ($SecretBindings.Count -gt 0) {
    $RunArgs += "--update-secrets"
    $RunArgs += ($SecretBindings -join ",")
  }
  & gcloud @RunArgs
}
finally {
  Pop-Location
}

Write-Host "Building and deploying Firebase Hosting..."
Push-Location $WebDir
try {
  npm install
  npm run build
  npx -y firebase-tools@latest deploy --only hosting --project $ProjectId
}
finally {
  Pop-Location
}

Write-Host "GCP deploy complete."
