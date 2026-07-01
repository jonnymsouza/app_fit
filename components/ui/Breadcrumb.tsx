import Link from "next/link"

export type BreadcrumbItem = {
  label: string
  href?: string
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const parent = items.length >= 2 ? items[items.length - 2] : null
  const current = items[items.length - 1]

  return (
    <>
      {/* Mobile: botão voltar */}
      <div className="flex items-center mb-3 md:hidden">
        {parent?.href ? (
          <Link
            href={parent.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 active:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            <ArrowLeft />
            {parent.label}
          </Link>
        ) : (
          <span className="text-sm font-semibold text-gray-900">{current.label}</span>
        )}
      </div>

      {/* Desktop: breadcrumb completo */}
      <nav className="hidden md:flex items-center gap-1 text-sm text-gray-400 mb-1">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight />}
            {item.href ? (
              <Link href={item.href} className="hover:text-gray-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
