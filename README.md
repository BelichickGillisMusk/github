# Silverback Platform

Multi-property web platform for Silverback Agency sites and apps.

## Cursor startup

Use the repository-level npm script to install or reuse Hermes Agent on a new
Cursor Cloud machine:

```bash
npm ci && npm run setup:hermes
```

The setup script:

- ensures `~/.local/bin` exists and is added to `~/.bashrc`
- uses the official Hermes Agent installer
- installs or reuses Hermes under `~/.hermes`
- installs Hermes-managed `uv`, Python 3.11, and browser tooling prerequisites
- skips the interactive Hermes setup wizard so startup can run unattended

After startup, verify the command is available in a fresh shell:

```bash
source ~/.bashrc && hermes --help
```

Recommended Cursor startup command:

```bash
npm ci && npm run setup:hermes
```
