"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function NewCycleButton({ studentId, className }: { studentId: string; className?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function create() {
    setLoading(true)
    const res = await fetch(`/api/students/${studentId}/cycles`, { method: "POST" })
    const data = await res.json()
    router.push(`/students/${studentId}/cycles/${data.id}`)
    router.refresh()
  }

  return (
    <button
      onClick={create}
      disabled={loading}
      className={`bg-[#0d1b2a] hover:bg-[#1a3350] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${className ?? ""}`}
    >
      {loading ? "Criando..." : "+ Novo Ciclo"}
    </button>
  )
}
