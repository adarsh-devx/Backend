# Verdict — AI Solution Comparison (Frontend)

A production-quality React frontend that takes a problem, shows **two AI
solutions side by side**, and has a **judge** score both, explain its reasoning,
and pick a winner when the scores support one.

> **Connected to the real backend.** Comparisons run through the
> Node/Express + LangGraph backend in `../Backend` (`POST /invoke`): Mistral and
> Cohere generate the solutions, Gemini judges them. `services/api/apiClient.js`
> owns the HTTP call and maps the backend's snake_case payload onto the UI data
> model. Override the backend URL with the `VITE_API_BASE_URL` env var
> (default `http://localhost:3000`). Conversations still persist to
> LocalStorage behind the repository interface.
>
> Expect a comparison to take **1–3 minutes** — three LLMs run per problem.

## Run it

```bash
npm install
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # serve the production build
npm run lint     # ESLint
npm test         # Vitest unit tests
```

## Architecture

Feature-based folders. Components render and handle interaction; hooks hold
reusable state; utils hold deterministic logic (scoring, titles, export,
formatting); services hold the API client and the repository. **Components
never touch LocalStorage directly** — only the repository and the `storage` lib
do.

```
src/
  app/                 App shell, layout, routes, providers (conversations, toast)
  components/
    layout/            AppHeader, ConversationSidebar, MobileSidebarDrawer
    ui/                Dialog, CopyButton, Empty/Loading/Error states, boundary
  features/
    chat/              Composer, WelcomeScreen, ChatView, MessageItem, ProblemCard
    chat-history/      ConversationList(+Panel/Item), title + time utils
    solution-comparison/  SolutionComparison/Panel, MarkdownRenderer, CodeBlock
    judge/             JudgeEvaluation, ScoreDisplay, WinnerBadge, winner util
    conversation-actions/  Markdown + JSON export utils
  services/
    mock/              legacy mock fixtures (offline demos/tests only)
    repositories/      interface + LocalStorage impl (+ tests)
    api/               apiClient: real backend client + response mapping (+ tests)
  hooks/               useClipboard, usePersistentState, useScrollLock
  lib/                 id, safe storage helpers (quarantine on corrupt JSON)
  constants/           storage key, statuses, score scale, example prompts
  data/mock/           deterministic mock fixtures
  styles/              global.css (Tailwind v4)
```

### Comparison API & repository

- `apiClient.generateComparison(problem)` POSTs to the backend's `/invoke` and
  returns `{ solutionA: { content, provider }, solutionB: { content, provider },
  judge: { solutionAScore, solutionBScore, reasoning, recommendedSolution } }`.
  The backend emits snake_case (`solution_1`, `solution_1_score`, …); the
  mapping lives only in `apiClient.js`, so no component sees backend field
  names. Failures reject with UI-safe messages (validation, unreachable
  backend, timeout, backend error envelope). A problem starting with `/fail`
  rejects client-side, so failure/retry states stay demonstrable offline.
- `conversationRepository` exposes `list / getById / create / update / remove /
  save`. The LocalStorage implementation centralizes one versioned key, safely
  parses JSON, and **quarantines malformed data under `<key>.corrupt`** instead of
  crashing. Swap in an HTTP implementation of the same interface for a future
  persistence backend.

### Winner logic

`features/judge/utils/winner.js` is pure and independently tested: higher score
wins, equal scores are a tie, missing/invalid scores are inconclusive. An explicit
judge verdict, when present and valid, is honored and never silently contradicted.

## Backend contract

`POST {backend}/invoke` with `{ input: <problem> }` responds:

```jsonc
{ "success": true, "result": {
    "problem": "…",
    "solution_1": "…", "solution_1_provider": "Mistral (open-mistral-7b)",
    "solution_2": "…", "solution_2_provider": "Cohere (command-r-plus-08-2024)",
    "judge": { "solution_1_score": 4.5, "solution_2_score": 8.5,
               "solution_1_reasoning": "…", "solution_2_reasoning": "…" } } }
```

Failures: `400` for a missing/blank `input`, `502` when the graph fails — both
as `{ "success": false, "error": "…" }`. The judge has no explicit
recommendation field, so the winner is derived from the scores (labelled
"higher score" in the UI). Conversation persistence is still LocalStorage; an
HTTP repository (`GET/POST/PATCH/DELETE /api/conversations`) is the planned
next step. The frontend never connects to MongoDB directly.

## Verified

- Backend `tsc --noEmit` clean; build + lint clean; 57 unit tests pass.
- End-to-end against both dev servers: submit → two real solutions with
  provider badges + judge scores/reasoning → score-derived verdict; CORS
  preflight; generating skeleton; `/fail` failure + retry; backend `400`/`502`
  envelopes; clean browser console. (Persistence/rename/delete/export covered
  by unit tests and the earlier manual pass.)
