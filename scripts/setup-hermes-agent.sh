#!/usr/bin/env bash
set -euo pipefail

INSTALL_URL="https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh"
HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
LOCAL_BIN="$HOME/.local/bin"
BASHRC="$HOME/.bashrc"
INSTALLER="$HERMES_HOME/install.sh"

log() {
  printf '[setup:hermes] %s\n' "$*"
}

ensure_local_bin_on_path() {
  mkdir -p "$LOCAL_BIN"

  case ":$PATH:" in
    *":$LOCAL_BIN:"*) ;;
    *) export PATH="$LOCAL_BIN:$PATH" ;;
  esac

  touch "$BASHRC"
  if [[ "$(< "$BASHRC")" != *'HOME/.local/bin'* ]]; then
    {
      printf '\n'
      printf '# Hermes Agent and local user binaries\n'
      printf 'export PATH="$HOME/.local/bin:$PATH"\n'
    } >> "$BASHRC"
    log "Added ~/.local/bin to $BASHRC"
  else
    log "~/.local/bin is already configured in $BASHRC"
  fi
}

download_installer() {
  mkdir -p "$HERMES_HOME"
  log "Downloading Hermes Agent installer"
  curl -fsSL "$INSTALL_URL" -o "$INSTALLER"
  chmod +x "$INSTALLER"
}

install_or_update_hermes() {
  log "Using HERMES_HOME=$HERMES_HOME"
  log "Installing or refreshing Hermes Agent prerequisites"
  bash "$INSTALLER" \
    --hermes-home "$HERMES_HOME" \
    --skip-setup \
    --non-interactive
}

verify_hermes() {
  if ! command -v hermes >/dev/null 2>&1; then
    log "Hermes was installed, but the hermes command is not on PATH in this shell"
    log "Try: source ~/.bashrc && hermes --help"
    exit 1
  fi

  log "Hermes command is available at $(command -v hermes)"
  hermes --help >/dev/null
}

ensure_local_bin_on_path
download_installer
install_or_update_hermes
verify_hermes

log "Hermes Agent setup complete"
