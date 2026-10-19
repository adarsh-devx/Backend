/** Generic empty state used by history and conversation views. */
export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-10 text-center">
      {Icon && (
        <span className="mb-3 flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-400">
          <Icon size={17} aria-hidden="true" />
        </span>
      )}
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      {description && <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
