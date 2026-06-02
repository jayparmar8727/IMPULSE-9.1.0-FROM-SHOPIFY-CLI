# Start a TWO-WAY dev server pinned to the persistent Kansawala dev theme.
# --theme-editor-sync => admin "Customize" edits sync back down to local files,
# so they are never silently overwritten. See docs/THEME-DEV-WORKFLOW.md.
$ErrorActionPreference = "Stop"

$cfg = Join-Path $PSScriptRoot "theme.config.ps1"
if (-not (Test-Path $cfg)) {
  Write-Error "Missing scripts/theme.config.ps1 - copy scripts/theme.config.example.ps1 to it and set `$ThemeId. See docs/THEME-DEV-WORKFLOW.md."
  exit 1
}
. $cfg
if ([string]::IsNullOrWhiteSpace($ThemeId) -or $ThemeId -eq "PASTE-PERSISTENT-THEME-ID-HERE") {
  Write-Error "Set `$ThemeId in scripts/theme.config.ps1 (your persistent dev theme). See docs/THEME-DEV-WORKFLOW.md."
  exit 1
}

Write-Host "theme dev -> store=$Store theme=$ThemeId (two-way --theme-editor-sync)" -ForegroundColor Cyan
shopify theme dev --store=$Store --theme=$ThemeId --theme-editor-sync
