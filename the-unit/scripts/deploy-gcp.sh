#!/usr/bin/env bash
# Deploy gumption-api to Cloud Run from source.
#
# Network edge: --allow-unauthenticated (so the browser can call directly).
# App-level auth: Firebase ID token verification inside the service.
# Per-user spend cap: enforced in Firestore by src/rateLimit.ts.
#
# Run setup-secrets.sh ONCE first.
#
# Usage:
#   export PROJECT_ID=temporal-frame-494501-p5
#   bash the-unit/scripts/deploy-gcp.sh
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-gumption-api}"
SA_NAME="${SA_NAME:-gumption-api}"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
DAILY_TOKEN_CAP="${DAILY_TOKEN_CAP:-250000}"

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../api" && pwd)"

echo "==> Project: $PROJECT_ID"
echo "==> Region:  $REGION"
echo "==> Service: $SERVICE"
echo "==> Runtime SA: $SA_EMAIL"
echo "==> Source:  $SOURCE_DIR"

gcloud config set project "$PROJECT_ID" >/dev/null

SECRETS_ARG=""
for SECRET in anthropic-key:ANTHROPIC_API_KEY openai-key:OPENAI_API_KEY xai-key:XAI_API_KEY; do
  NAME="${SECRET%%:*}"
  ENV_VAR="${SECRET##*:}"
  if gcloud secrets describe "$NAME" --project="$PROJECT_ID" >/dev/null 2>&1; then
    SECRETS_ARG+="${ENV_VAR}=${NAME}:latest,"
  else
    echo "   ... secret $NAME not found, skipping (will run without $ENV_VAR)"
  fi
done
SECRETS_ARG="${SECRETS_ARG%,}"

ALLOWED_EMAILS="${ALLOWED_EMAILS:-bryan@norcalcarbmobile.com}"
ENV_VARS="GCP_PROJECT=${PROJECT_ID},GCP_REGION=${REGION},DAILY_TOKEN_CAP=${DAILY_TOKEN_CAP},ALLOWED_EMAILS=${ALLOWED_EMAILS}"

CMD=(
  gcloud run deploy "$SERVICE"
  --source "$SOURCE_DIR"
  --region "$REGION"
  --platform managed
  --allow-unauthenticated
  --service-account "$SA_EMAIL"
  --memory 512Mi
  --cpu 1
  --concurrency 40
  --timeout 300
  --max-instances 10
  --set-env-vars "$ENV_VARS"
)
if [[ -n "$SECRETS_ARG" ]]; then
  CMD+=( --set-secrets "$SECRETS_ARG" )
fi

echo "==> Deploying"
printf '   %s\n' "${CMD[@]}"
"${CMD[@]}"

URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')
echo
echo "Deployed: $URL"
echo "Health:   curl -fsS $URL/healthz"
