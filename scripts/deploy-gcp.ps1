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

Write-Host "Deploying $Service to Cloud Run in $ProjectId / $Region..."
Push-Location $ApiDir
try {
  gcloud run deploy $Service `
    --source . `
    --project $ProjectId `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars "GCP_PROJECT_ID=$ProjectId,VERTEX_LOCATION=$Region"
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
