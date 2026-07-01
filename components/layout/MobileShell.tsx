"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"

export function MobileShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar (always visible md+) */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 shrink-0">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0d1b2a] text-white flex items-center px-4 py-3 gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/80 hover:text-white p-1 -ml-1"
            aria-label="Abrir menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-bold text-base">PT Manager</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
