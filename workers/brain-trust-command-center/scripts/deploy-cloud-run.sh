#!/usr/bin/env bash
set -euo pipefail

REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-brain-trust-command-center}"

gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions "_REGION=${REGION},_SERVICE=${SERVICE}"
