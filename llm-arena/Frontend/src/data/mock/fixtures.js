/**
 * Deterministic mock fixtures for the comparison service.
 *
 * These are hand-written sample solutions used because no backend or AI
 * provider exists yet. They are always presented behind explicit
 * "Mock Provider A/B" labels — the UI never claims they are real
 * AI-generated results.
 *
 * Contract mirrored here (proposed frontend data model):
 *   solution{A,B}: { content: markdown, provider: string }
 *   judge: { solutionAScore, solutionBScore, reasoning: markdown,
 *            recommendedSolution: 'A' | 'B' | null }
 */

import { MOCK_PROVIDER_A, MOCK_PROVIDER_B } from '../../constants/index.js'

const CANNED = [
  {
    match: /\b(cach|redis|memoiz|ttl|invalidat)/i,
    solutionA: `**Go-to fix:** wrap the query in a tiny in-process cache with a TTL — no new infrastructure.

### How it works

1. Key the cache by the query arguments.
2. Store each result together with a timestamp.
3. Treat entries as stale after 30–60 seconds, and delete them explicitly on writes.

\`\`\`js
function withTtlCache(fn, ttlMs = 30_000) {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < ttlMs) return hit.value
    const value = fn(...args)
    cache.set(key, { value, at: Date.now() })
    return value
  }
}
\`\`\`

### Trade-offs

| Concern | In-process cache |
| --- | --- |
| Latency | No extra round trip |
| Consistency | Per instance only |
| Eviction | Manual, per key |

**Watch out:** with more than one server instance, each process keeps its own copy, so a write on one node leaves the others stale until the TTL expires. See the [Mozilla caching notes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) for the general idea.`,
    solutionB: `**Go-to fix:** put Redis in front of the query with a short TTL — one cache shared by every instance.

### How it works

1. Namespace keys per query, for example \`orders:report:2026-10\`.
2. Set an explicit expiry of 60 seconds on every write.
3. Delete the key in the same code path that mutates the row.

\`\`\`js
await redis.set(key, JSON.stringify(rows), { EX: 60 })

// on write
await redis.del(key)
\`\`\`

### Trade-offs

| Concern | Redis cache |
| --- | --- |
| Latency | One ~1 ms round trip |
| Consistency | Shared by all instances |
| Operations | A service to run and monitor |

It costs an extra network hop and a new dependency, but invalidation is immediate and every instance reads the same data.`,
    judge: {
      solutionAScore: 8,
      solutionBScore: 9,
      reasoning: `**Solution A** — correct, dependency-free, and easy to reason about. It loses a point because multi-instance staleness is treated as a footnote instead of solved: the cache silently diverges as soon as you scale out.

**Solution B** — attaches the real problem: shared invalidation. Concrete code, explicit TTL, and an honest trade-off table. The extra round trip and Redis dependency are the only real costs.`,
      recommendedSolution: 'B',
    },
  },
  {
    match: /\b(react|re-?render|hook|keystroke|debounc|virtuali|usememo)/i,
    solutionA: `**Go-to fix:** decouple the input from the list — keep the raw keystrokes local and feed a debounced value down the tree.

### How it works

1. Store keystrokes in local state so typing never blocks.
2. Debounce the value that actually reaches the list.
3. Memoize rows so unchanged items keep their identity.

\`\`\`jsx
const [raw, setRaw] = useState('')
const query = useDebouncedValue(raw, 200)
const visible = useMemo(
  () => items.filter((item) => item.name.includes(query)),
  [items, query],
)
\`\`\`

### Trade-offs

| Concern | Debounced input |
| --- | --- |
| Renders | Typing stays cheap |
| Complexity | One small custom hook |
| Feel | 200 ms before results update |

Row memoization matters more than the debounce: with a correct window, only visible rows ever render.`,
    solutionB: `**Go-to fix:** virtualize the list so only the visible window renders, regardless of keystrokes.

### How it works

1. Render only the rows that fit the viewport.
2. Keep the filter logic where it is — the win comes from fewer DOM nodes.
3. Use stable \`key\` values so React reuses rows instead of recreating them.

\`\`\`jsx
<List
  height={600}
  itemCount={items.length}
  itemSize={48}
  width="100%"
>
  {({ index, style }) => (
    <Row style={style} item={items[index]} />
  )}
</List>
\`\`\`

### Trade-offs

| Concern | Virtualization |
| --- | --- |
| Large lists | Constant render cost |
| Complexity | New dependency, variable heights |
| Edge cases | Find-in-page and anchors get harder |

Handles 100k rows smoothly, but it treats the symptom — if each keystroke still triggers expensive work upstream, virtualization only hides the cost.`,
    judge: {
      solutionAScore: 9,
      solutionBScore: 7,
      reasoning: `**Solution A** — finds the actual cause: every keystroke fans out through the tree, and it fixes that with a small, dependency-free change. The 200 ms lag is a fair trade-off, and the note about row memoization is spot on.

**Solution B** — a solid technique for very large lists, but it treats the symptom rather than the re-render trigger, adds a dependency, and complicates find-in-page. Correct, just not the first lever to pull.`,
      recommendedSolution: 'A',
    },
  },
  {
    match: /\b(sql|postgres|mysql|index|materialized|slow query|analytics|dashboard)/i,
    solutionA: `**Go-to fix:** start with a composite index that matches the query's filter and sort — the cheapest fix with the least risk.

### How it works

1. Read the \`EXPLAIN\` plan and find the sequential scan.
2. Create a composite index on the filtered columns first, sorted column last.
3. Re-run \`EXPLAIN (ANALYZE, BUFFERS)\` and confirm the scan type changed.

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_events_org_created
  ON events (org_id, created_at DESC);
\`\`\`

### Trade-offs

| Concern | Composite index |
| --- | --- |
| Freshness | Always up to date |
| Write cost | Slightly slower inserts |
| Complexity | One statement |

If the planner still scans too much under a skewed distribution, an index alone may not get you under a second — but it is the right first move.`,
    solutionB: `**Go-to fix:** pre-aggregate into a materialized view and refresh it on a schedule — constant-time reads no matter how the data grows.

### How it works

1. Move the heavy \`GROUP BY\` into a view definition.
2. Refresh on a schedule, or concurrently when rows must stay visible.
3. Point the dashboard at the view instead of the raw tables.

\`\`\`sql
CREATE MATERIALIZED VIEW dashboard_daily AS
SELECT org_id, date_trunc('day', created_at) AS day, count(*)
FROM events
GROUP BY 1, 2;

REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_daily;
\`\`\`

### Trade-offs

| Concern | Materialized view |
| --- | --- |
| Read speed | Constant, pre-aggregated |
| Freshness | Up to the refresh interval |
| Operations | Another object to refresh and monitor |

Reads become trivial, but the dashboard shows data as of the last refresh — that freshness gap is the real decision.`,
    judge: {
      solutionAScore: 8,
      solutionBScore: 8,
      reasoning: `**Solution A** — textbook first response: the index keeps data fresh, costs one statement, and usually removes most of the scan. It stops short of a guarantee: very selective filters can still read too many rows.

**Solution B** — guarantees fast reads at any data volume and the SQL is correct, but it trades freshness and adds refresh operations. Exactly as strong as indexing when staleness is acceptable, and worse when it is not.

No defensible winner: the right choice depends on how stale the dashboard may be.`,
      recommendedSolution: null,
    },
  },
]

/** Score pairs used by the generic fallback; includes an 8–8 tie. */
const SCORE_PAIRS = [
  [8, 9],
  [9, 7],
  [7, 9],
  [8, 8],
]

function hashCode(text) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function genericPair(problem) {
  const clean = problem.replace(/[`$]/g, '').trim()
  const excerpt = clean.length > 90 ? `${clean.slice(0, 90)}…` : clean

  const solutionA = `**Option A — the smallest change that works.**

### Approach

1. Restate the goal of "${excerpt}" as one measurable sentence.
2. Identify the least machinery that satisfies it end to end.
3. Ship that, measure, and only add complexity when the measurement asks for it.

\`\`\`js
// Step 1 — the minimal version
const outcome = solve({ problem: "${excerpt}" })
\`\`\`

### Trade-offs

| Upside | Downside |
| --- | --- |
| Fast to build and review | May need a rework once scale shows up |
| Fewer moving parts | Limited edge-case coverage |

A good default while the requirement is still moving.`

  const solutionB = `**Option B — build it to last.**

### Approach

1. Separate the moving parts of "${excerpt}" behind a small, explicit interface.
2. Cover the failure modes first — timeouts, empty inputs, and partial results.
3. Keep the first version narrow, but make each piece independently testable.

\`\`\`js
// Step 1 — structure before features
const pipeline = createPipeline({
  validate: validateInput,
  execute: run,
  onError: report,
})
\`\`\`

### Trade-offs

| Upside | Downside |
| --- | --- |
| Holds up as requirements grow | Slower to first working version |
| Easier to test and extend | More code to review up front |

Worth the upfront cost when this sits on a critical path.`

  return { solutionA, solutionB }
}

/**
 * Build a full mock comparison payload for a problem.
 * Deterministic: matching fixture by keyword, otherwise a generic pair with
 * scores derived from a stable hash of the problem text.
 */
export function buildMockComparison(problem) {
  const canned = CANNED.find((entry) => entry.match.test(problem))

  if (canned) {
    return {
      solutionA: { content: canned.solutionA, provider: MOCK_PROVIDER_A },
      solutionB: { content: canned.solutionB, provider: MOCK_PROVIDER_B },
      judge: { ...canned.judge },
    }
  }

  const { solutionA, solutionB } = genericPair(problem)
  const [scoreA, scoreB] = SCORE_PAIRS[hashCode(problem.trim()) % SCORE_PAIRS.length]

  return {
    solutionA: { content: solutionA, provider: MOCK_PROVIDER_A },
    solutionB: { content: solutionB, provider: MOCK_PROVIDER_B },
    judge: {
      solutionAScore: scoreA,
      solutionBScore: scoreB,
      reasoning: `**Solution A** — direct and low-risk: it attacks the stated goal with the fewest moving parts, and the steps are concrete enough to start today. It assumes the simple case holds, which is the main thing to verify first.

**Solution B** — more robust: the structure keeps holding as requirements grow, but it asks for more upfront design and review. Worth the cost only if this path is critical.`,
      recommendedSolution: null,
    },
  }
}
