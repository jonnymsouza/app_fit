"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ConfirmDialog"

export function DeleteStudentButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/students/${studentId}`, { method: "DELETE" })
    router.push("/students")
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Excluir
      </button>

      <ConfirmDialog
        isOpen={open}
        title="Excluir Aluno"
        message={`Tem certeza que quer excluir "${studentName}"? Todos os ciclos e dados de anamnese serão apagados permanentemente.`}
        confirmLabel={loading ? "Excluindo..." : "Excluir Aluno"}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
