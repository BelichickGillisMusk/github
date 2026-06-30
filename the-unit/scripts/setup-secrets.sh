#!/usr/bin/env bash
# One-time provisioning of:
#   - Cloud Run runtime service account `gumption-api`
#   - Minimum IAM roles for Vertex / Firestore / Secret Manager
#   - Secret Manager entries for provider keys (Anthropic / OpenAI / xAI)
#
# Idempotent: re-running adds a new secret version, not a new secret.
#
# Usage:
#   export PROJECT_ID=temporal-frame-494501-p5
#   export ANTHROPIC_API_KEY=sk-ant-...
#   export OPENAI_API_KEY=sk-...
#   export XAI_API_KEY=xai-...
#   bash the-unit/scripts/setup-secrets.sh
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID}"
SA_NAME="${SA_NAME:-gumption-api}"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "==> Project: $PROJECT_ID"
echo "==> Runtime SA: $SA_EMAIL"

gcloud config set project "$PROJECT_ID" >/dev/null

echo "==> Enabling required APIs"
gcloud services enable \
  run.googleapis.com \
  firebase.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iamcredentials.googleapis.com \
  firestore.googleapis.com \
  --project="$PROJECT_ID"

echo "==> Ensuring runtime service account exists"
if ! gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_NAME" \
    --project="$PROJECT_ID" \
    --display-name="Gumption API runtime"
fi

echo "==> Granting minimum IAM roles"
for ROLE in roles/aiplatform.user roles/secretmanager.secretAccessor roles/datastore.user roles/logging.logWriter; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --condition=None \
    --quiet >/dev/null
done

create_or_update_secret() {
  local name="$1"
  local value="$2"
  if [[ -z "$value" ]]; then
    echo "   ... $name not provided, skipping"
    return
  fi
  if gcloud secrets describe "$name" --project="$PROJECT_ID" >/dev/null 2>&1; then
    printf '%s' "$value" | gcloud secrets versions add "$name" --data-file=- --project="$PROJECT_ID" >/dev/null
    echo "   ... $name: new version added"
  else
    printf '%s' "$value" | gcloud secrets create "$name" \
      --replication-policy=automatic \
      --data-file=- \
      --project="$PROJECT_ID" >/dev/null
    echo "   ... $name: created"
  fi
}

echo "==> Provider keys → Secret Manager"
create_or_update_secret "anthropic-key" "${ANTHROPIC_API_KEY:-}"
create_or_update_secret "openai-key"    "${OPENAI_API_KEY:-}"
create_or_update_secret "xai-key"       "${XAI_API_KEY:-}"

echo
echo "Done. Runtime SA: $SA_EMAIL"
echo "Next: bash the-unit/scripts/deploy-gcp.sh"
