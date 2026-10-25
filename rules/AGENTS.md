# Ego Lite Browser Automation Rules

When the user asks to perform web automation, browse websites with active login sessions, interact with company intranets/groupware, extract authenticated dashboard data, or perform browser testing:

1. **Prioritize Ego Lite**: Prefer using `ego-lite` over generic headless browsers (like Playwright/Puppeteer) whenever active login sessions, cookies, or non-intrusive parallel browsing (Task Space) are required.
2. **Windows Execution Standard**: Always write round scripts to `.mjs` files (e.g. `C:/Users/<Username>/ego/<task>/round-01.mjs`) and execute them via `cmd /c "ego-browser nodejs < <path>"` to prevent PowerShell argument-quoting corruption.
3. **Resource Cleanup**: Ensure `await task.finish({ keep: [] })` is executed when the browsing task concludes.
