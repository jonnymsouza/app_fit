"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/students", label: "Alunos", icon: "👤" },
  { href: "/exercises", label: "Banco de Exercícios", icon: "🏋" },
]

type Props = {
  onClose?: () => void
}

export function Sidebar({ onClose }: Props) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-60 min-h-screen bg-[#0d1b2a] flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-lg">PT Manager</div>
          <div className="text-blue-300 text-xs mt-0.5">Gestão de Alunos</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white md:hidden text-xl leading-none ml-2">×</button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-gray-400 text-xs mb-1 truncate">{session?.user?.name}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-gray-500 hover:text-white text-xs transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
