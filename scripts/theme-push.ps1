# Push local CODE to the dev theme WITHOUT deleting admin-uploaded files (--nodelete).
# See docs/THEME-DEV-WORKFLOW.md.
$ErrorActionPreference = "Stop"

$cfg = Join-Path $PSScriptRoot "theme.config.ps1"
if (-not (Test-Path $cfg)) {
  Write-Error "Missing scripts/theme.config.ps1 - copy scripts/theme.config.example.ps1 to it. See docs/THEME-DEV-WORKFLOW.md."
  exit 1
}
. $cfg

Write-Host "theme push -> store=$Store theme=$ThemeId (--nodelete)" -ForegroundColor Cyan
shopify theme push --store=$Store --theme=$ThemeId --nodelete
