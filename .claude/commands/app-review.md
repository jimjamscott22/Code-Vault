---
description: Review the app codebase and produce prioritized improvement/feature suggestions with file-level specificity
---

# App Review

Structured review workflow: explore architecture, run cheap verification, then produce actionable suggestions. **Do not implement changes** unless the user explicitly asks.

## Process

1. **Discover the stack.** Read `README.md`, `CLAUDE.md`, or equivalent. Identify entry points, layer boundaries (UI / API / core / persistence), and where tests live. If unclear, use a code-explorer subagent to map the tree first.
2. **Review.** Use a code-reviewer subagent against the checklist below. Focus on hot paths, user-facing flows, and integration boundaries.
3. **Verify where cheap.** Run the project's test command (e.g. `uv run pytest`, `npm test`). If the app has a smoke-start path (CLI `--help`, headless UI, health endpoint), run it. Failed tests or startup errors become the **top finding**.

## Review checklist

- **Correctness:** logic bugs, edge cases, error handling, race conditions
- **Performance:** hot paths, redundant I/O, N+1 queries, UI re-renders, blocking calls in async code
- **Security:** input validation, secrets handling, unsafe file/DB/network operations, dependency risk
- **Testing:** coverage gaps, missing failure/edge cases, flaky or absent integration tests
- **Maintainability:** duplication, oversized modules, unclear naming, tight coupling
- **UX / accessibility:** primary user flows, feedback, theming, keyboard navigation, error messages

Adapt emphasis to the app type (e.g. keystroke latency for typing apps, graph render perf for visualization apps, rate limiting for API aggregators).

## Suggestion quality bar

Each suggestion must include:

- **What & where:** specific file/function/module — not generic advice
- **Why:** concrete impact (bug risk, perf, user pain, maintenance cost)
- **Effort:** S / M / L
- **Severity:** Critical / Recommended / Nice-to-have

Prefer changes that fit the existing architecture over rewrites.

## Output

Markdown, grouped by category (Performance, Testing, UX, Features, Code Quality, Security):

- **3–5 suggestions**, each following the quality bar
- End with a **"Start here"** list ordered by impact vs. effort (quick wins first, then high-impact medium effort)

If verification failed, lead with a **Blockers** section before categorized suggestions.
