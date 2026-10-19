import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import CodeBlock from './CodeBlock.jsx'
import ContentErrorBoundary from '../../../components/ui/ContentErrorBoundary.jsx'

/**
 * Safe Markdown rendering.
 *
 * - No rehype-raw: untrusted HTML in content is never parsed or executed.
 * - react-markdown sanitises URL schemes (javascript: etc. are blocked).
 * - GFM tables/autolinks, highlight.js syntax highlighting.
 * - Every fenced block goes through CodeBlock (scrollable + copyable).
 */
const components = {
  h1: (props) => (
    <h1 className="mt-6 mb-2 text-lg font-semibold tracking-tight text-neutral-900 first:mt-0">
      {props.children}
    </h1>
  ),
  h2: (props) => (
    <h2 className="mt-5 mb-2 text-base font-semibold tracking-tight text-neutral-900 first:mt-0">
      {props.children}
    </h2>
  ),
  h3: (props) => (
    <h3 className="mt-4 mb-1.5 text-sm font-semibold text-neutral-900 first:mt-0">
      {props.children}
    </h3>
  ),
  h4: (props) => (
    <h4 className="mt-4 mb-1.5 text-sm font-semibold text-neutral-700 first:mt-0">
      {props.children}
    </h4>
  ),
  p: (props) => (
    <p className="my-3 leading-7 text-neutral-700 first:mt-0 last:mb-0">{props.children}</p>
  ),
  ul: (props) => (
    <ul className="my-3 list-disc space-y-1.5 pl-5 text-neutral-700 marker:text-neutral-400">
      {props.children}
    </ul>
  ),
  ol: (props) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-5 text-neutral-700 marker:text-neutral-400">
      {props.children}
    </ol>
  ),
  li: (props) => <li className="leading-7 [&>p]:my-0">{props.children}</li>,
  a: (props) => (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
    >
      {props.children}
    </a>
  ),
  strong: (props) => <strong className="font-semibold text-neutral-900">{props.children}</strong>,
  em: (props) => <em className="italic">{props.children}</em>,
  blockquote: (props) => (
    <blockquote className="my-4 border-l-2 border-neutral-200 pl-4 text-neutral-600 italic">
      {props.children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-neutral-200" />,
  code: (props) => (
    <code className="rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] break-words text-neutral-800">
      {props.children}
    </code>
  ),
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  table: (props) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full border-collapse text-left text-sm">{props.children}</table>
    </div>
  ),
  thead: (props) => <thead className="bg-neutral-50">{props.children}</thead>,
  th: (props) => (
    <th className="border-b border-neutral-200 px-3 py-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
      {props.children}
    </th>
  ),
  td: (props) => (
    <td className="border-b border-neutral-100 px-3 py-2.5 align-top text-neutral-700 last:border-b-0">
      {props.children}
    </td>
  ),
}

export default function MarkdownRenderer({ children }) {
  return (
    <div className="markdown text-sm">
      <ContentErrorBoundary>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
          components={components}
        >
          {children ?? ''}
        </ReactMarkdown>
      </ContentErrorBoundary>
    </div>
  )
}
