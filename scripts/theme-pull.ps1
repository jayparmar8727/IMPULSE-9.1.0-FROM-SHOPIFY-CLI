# Pull admin-edited CONTENT/SETTINGS to local BEFORE ending a session, then COMMIT.
# Only the admin-editable JSON is pulled, so local code is never clobbered.
# See docs/THEME-DEV-WORKFLOW.md.
$ErrorActionPreference = "Stop"

$cfg = Join-Path $PSScriptRoot "theme.config.ps1"
if (-not (Test-Path $cfg)) {
  Write-Error "Missing scripts/theme.config.ps1 - copy scripts/theme.config.example.ps1 to it. See docs/THEME-DEV-WORKFLOW.md."
  exit 1
}
. $cfg

Write-Host "theme pull (admin JSON only) <- store=$Store theme=$ThemeId" -ForegroundColor Cyan
shopify theme pull --store=$Store --theme=$ThemeId `
  --only=config/settings_data.json `
  --only=templates/*.json `
  --only=sections/*-group.json

Write-Host "Done. Review with 'git status' and commit the admin edits." -ForegroundColor Green
