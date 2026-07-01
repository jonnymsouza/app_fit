"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DOMINANCES, DOMINANCE_COLORS } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ConfirmDialog"

type CycleRow = {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  vol: Record<string, number>
  total: number
}

type Props = {
  studentId: string
  cycleRows: CycleRow[]
}

function fmt(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

export function CyclesTable({ studentId, cycleRows }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [duplicating, setDuplicating] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<CycleRow | null>(null)

  async function handleDuplicate(cycle: CycleRow) {
    setDuplicating(cycle.id)
    const res = await fetch(`/api/students/${studentId}/cycles/${cycle.id}/duplicate`, { method: "POST" })
    const data = await res.json()
    setDuplicating(null)
    router.push(`/students/${studentId}/cycles/${data.id}`)
  }

  async function handleDelete(cycle: CycleRow) {
    setDeleting(cycle.id)
    await fetch(`/api/students/${studentId}/cycles/${cycle.id}`, { method: "DELETE" })
    setDeleting(null)
    setPendingDelete(null)
    router.refresh()
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ciclo</th>
                <th className="text-left px-3 py-3 font-medium text-gray-400 text-xs">Início</th>
                <th className="text-left px-3 py-3 font-medium text-gray-400 text-xs">Fim</th>
                {DOMINANCES.map((d) => (
                  <th key={d} className="text-center px-3 py-3 font-medium text-xs" style={{ color: DOMINANCE_COLORS[d] }}>
                    {d}
                  </th>
                ))}
                <th className="text-center px-3 py-3 font-medium text-orange-500 text-xs">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cycleRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">{fmt(row.startDate)}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">{fmt(row.endDate)}</td>
                  {DOMINANCES.map((d) => (
                    <td key={d} className="px-3 py-3 text-center text-gray-600 text-sm">
                      {row.vol[d] || "—"}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center font-semibold text-orange-600">{row.total || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/students/${studentId}/cycles/${row.id}`} className="text-blue-600 hover:underline text-xs">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDuplicate(row)}
                        disabled={!!duplicating}
                        className="text-gray-400 hover:text-gray-700 text-xs transition-colors disabled:opacity-40"
                        title="Duplicar ciclo"
                      >
                        {duplicating === row.id ? "..." : "Duplicar"}
                      </button>
                      <button
                        onClick={() => setPendingDelete(row)}
                        disabled={deleting === row.id}
                        className="text-red-400 hover:text-red-600 text-xs transition-colors disabled:opacity-40"
                      >
                        {deleting === row.id ? "..." : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!pendingDelete}
        title="Excluir Ciclo"
        message={`Tem certeza que quer excluir "${pendingDelete?.name}"? Todos os treinos e exercícios desse ciclo serão apagados.`}
        confirmLabel="Excluir Ciclo"
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
