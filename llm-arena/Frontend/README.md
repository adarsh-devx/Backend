# Verdict — AI Solution Comparison (Frontend)

A production-quality React frontend that takes a problem, shows **two mock AI
solutions side by side**, and has a **judge** score both, explain its reasoning,
and pick a winner when the scores support one.

> **Frontend-only.** There is no backend, database, or real AI integration yet.
> Everything runs through a mock service and a LocalStorage repository behind
> clean interfaces, so a future Node/Express/MongoDB backend can be dropped in
> without rewriting the UI. Mock results are labeled as mock — they are never
> presented as genuine AI output.

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
formatting); services hold the mock generator and the repository. **Components
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
    mock/              comparisonService (async, labeled mock, /fail trigger)
    repositories/      interface + LocalStorage impl (+ tests)
    api/               apiClient placeholder for the future HTTP layer
  hooks/               useClipboard, usePersistentState, useScrollLock
  lib/                 id, safe storage helpers (quarantine on corrupt JSON)
  constants/           storage key, statuses, score scale, example prompts
  data/mock/           deterministic mock fixtures
  styles/              global.css (Tailwind v4)
```

### Mock service & repository

- `comparisonService.generateComparison(problem)` returns a Promise resolving to
  `{ solutionA, solutionB, judge }` with realistic latency. A problem starting
  with `/fail` rejects, so failure/retry can be demonstrated deterministically.
- `conversationRepository` exposes `list / getById / create / update / remove /
  save`. The LocalStorage implementation centralizes one versioned key, safely
  parses JSON, and **quarantines malformed data under `<key>.corrupt`** instead of
  crashing. Swap in an HTTP implementation of the same interface for the backend.

### Winner logic

`features/judge/utils/winner.js` is pure and independently tested: higher score
wins, equal scores are a tie, missing/invalid scores are inconclusive. An explicit
judge verdict, when present and valid, is honored and never silently contradicted.

## Future backend

Replace the LocalStorage repository with an HTTP repository calling the
Node/Express API (`GET/POST/PATCH/DELETE /api/conversations`, `POST
/api/comparisons`). The contract must be agreed when the backend is built. The
frontend never connects to MongoDB directly.

## Verified

- Build, lint, and 45 unit tests pass.
- Manual browser pass: submit → two solutions → judge; multi-message
  conversations; reload persistence; rename/delete (with confirm + cancel);
  edit → invalidate → regenerate; `/fail` failure + retry; copy + Markdown/JSON
  export; sidebar collapse + mobile drawer; corrupt-JSON quarantine; responsive
  from 320px up; keyboard + focus states; no console errors.
