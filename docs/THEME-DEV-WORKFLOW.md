# Theme Dev Workflow — local code ↔ Shopify admin (don't lose your customizations)

> Why this exists: edits made in the Shopify admin **Customize** editor kept disappearing — the storefront
> would be "back to stock" days later. This explains why, and the workflow that prevents it.

## The problem

Your store is edited from **two** places, both rendering from the same Shopify **dev theme**:

| Surface | Tool | Lives in |
|---|---|---|
| **Code** — Liquid, CSS, JS, section schemas | VS Code | your local files → **git** |
| **Content / settings** — section placement, text, colours, the homepage layout | Shopify admin → **Customize** | the dev theme's JSON (`templates/*.json`, `config/settings_data.json`, `sections/*-group.json`) |

Two traps make the admin edits vanish:

1. **One-way push.** Running bare `shopify theme dev` treats your *local* files as the truth and **pushes
   them over the dev theme** — wiping any "Customize" edits made in the admin since the last pull. (This is
   what reset the homepage to stock.)
2. **Ephemeral theme.** A theme created by `shopify theme dev` is a *Development* theme, which Shopify
   **auto-deletes after ~7 days of inactivity**. Admin edits that only ever lived on that theme die with it.

The repo already has good discipline for files in git. This adds the missing discipline for the **live dev theme**.

## Setup (one-time)

1. **Create a persistent dev theme** (so it can't auto-delete):
   - Shopify admin → **Online Store → Themes**.
   - Duplicate your live theme, **or** find the Development theme the CLI made and duplicate/rename it into
     the **Theme library** (the unpublished list), e.g. `KW-Dev`.
   - A theme sitting in the library (not the "Development" slot) is **not** auto-deleted.
2. **Copy its theme ID** from the URL: `…/admin/themes/<THEME-ID>/editor` → the number is the ID.
3. **Create your local config:**
   ```powershell
   Copy-Item scripts/theme.config.example.ps1 scripts/theme.config.ps1
   ```
   Open `scripts/theme.config.ps1`, paste the ID into `$ThemeId`. (Gitignored — machine-local.)

## Daily workflow

```powershell
# 1. Start the dev server (two-way sync; admin edits flow back to local)
./scripts/theme-dev.ps1

# 2. Work:
#    - CODE              -> edit in VS Code (saved locally, pushed live by the dev server)
#    - CONTENT/SETTINGS  -> edit in the admin "Customize" editor on the KW-Dev theme

# 3. BEFORE stopping for the day — pull admin edits into local, then commit:
./scripts/theme-pull.ps1
git add -A
git commit -m "Pull admin Customize edits (settings + templates)"
```

## The 5 rules

1. **Persistent theme only.** Never let the throwaway CLI Development theme be your real dev theme. Pin the
   library theme via `scripts/theme.config.ps1`.
2. **Never run bare `shopify theme dev`.** Always `./scripts/theme-dev.ps1` (pins `--theme` + adds `--theme-editor-sync`).
3. **Two-way sync.** `--theme-editor-sync` makes admin "Customize" edits sync **down** to local while the
   server runs — so they end up in git, not just on the theme.
4. **Pull + commit before ending a session.** `./scripts/theme-pull.ps1` then `git commit`. Skip this and
   admin-only edits are lost when the theme changes or expires.
5. **Split by tool.** Code in VS Code; content/settings in admin. Don't edit the same surface from both.

## Recovery — "everything is stock again"

If the storefront/admin reverted to stock but your **local git** still has the real homepage:

```powershell
./scripts/theme-push.ps1   # push local code + committed homepage layout back up to the dev theme
```
Your local `templates/index.json` is the source of truth for the homepage layout — it's committed in git.

If **local is stock too**, restore from a prior commit first:
```powershell
git log --oneline -- templates/index.json      # find the good commit
git checkout <commit> -- templates/index.json  # restore it locally
./scripts/theme-push.ps1                        # push it up
```

## Scripts reference

| Script | What it does |
|---|---|
| `scripts/theme-dev.ps1` | Start dev server, pinned to your persistent theme, `--theme-editor-sync` (two-way). |
| `scripts/theme-pull.ps1` | Pull only the admin-editable JSON (`config/settings_data.json`, `templates/*.json`, `sections/*-group.json`). |
| `scripts/theme-push.ps1` | Push local code with `--nodelete` (won't wipe admin-uploaded files). |
| `scripts/theme.config.ps1` | Your `$Store` + `$ThemeId` (gitignored; copy from `.example`). |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Homepage reset to stock after running dev | Bare `shopify theme dev` pushed local over admin edits | Use `theme-dev.ps1`; restore via `theme-push.ps1` |
| Preview link dead after a few days | CLI Development theme auto-deleted | Use a **library** theme (Setup §1), not the throwaway dev theme |
| Admin edits not in git | Never pulled before ending session | `theme-pull.ps1` + commit each session |
| `theme.config.ps1 missing` error | Config not created | `Copy-Item scripts/theme.config.example.ps1 scripts/theme.config.ps1`, set `$ThemeId` |

> PowerShell note: if scripts are blocked, run them with
> `powershell -ExecutionPolicy Bypass -File scripts/theme-dev.ps1` (or set
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once).
