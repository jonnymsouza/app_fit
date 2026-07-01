"use client"

import { useState } from "react"
import type { Exercise } from "@prisma/client"

const ACTION_TYPES = [
  "Todos",
  "Joelho",
  "Quadril",
  "Empurrada Horizontal",
  "Empurrada Vertical",
  "Puxada Vertical",
  "Puxada Horizontal",
  "Core - Antirrotação",
  "Core - Anti-hiperextensão",
  "Core - Antiflexão Lateral",
]

type Props = { exercises: Exercise[] }

export function ExercisesClient({ exercises: initial }: Props) {
  const [exercises, setExercises] = useState(initial)
  const [filter, setFilter] = useState("Todos")
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ actionType: "Joelho", name: "", equipment: "", muscleGroup: "" })
  const [saving, setSaving] = useState(false)

  const filtered = exercises.filter((ex) => {
    const matchType = filter === "Todos" || ex.actionType === filter
    const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  async function addExercise(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setExercises((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setForm({ actionType: "Joelho", name: "", equipment: "", muscleGroup: "" })
      setShowForm(false)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="text"
          placeholder="Buscar exercício..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />
        <div className="flex gap-1 flex-wrap">
          {ACTION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === t
                  ? "bg-[#0d1b2a] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-[#0d1b2a] hover:bg-[#1a3350] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Novo Exercício
        </button>
      </div>

      {showForm && (
        <form onSubmit={addExercise} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 flex-wrap items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tipo de Ação</label>
            <select
              required
              value={form.actionType}
              onChange={(e) => setForm({ ...form, actionType: e.target.value })}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ACTION_TYPES.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nome *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nome do exercício"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Equipamento</label>
            <input
              type="text"
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Barra, Haltere..."
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Grupo Muscular</label>
            <input
              type="text"
              value={form.muscleGroup}
              onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Peito, Costas..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 bg-[#0d1b2a] text-white rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Exercício</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo de Ação</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Equipamento</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Grupo Muscular</th>
              <th className="px-4 py-3 text-xs text-gray-400">Fonte</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum exercício encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((ex) => (
                <tr key={ex.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-900">{ex.name}</td>
                  <td className="px-4 py-2 text-gray-500">{ex.actionType}</td>
                  <td className="px-4 py-2 text-gray-500">{ex.equipment ?? "—"}</td>
                  <td className="px-4 py-2 text-gray-500">{ex.muscleGroup ?? "—"}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ex.isSystem
                        ? "bg-blue-50 text-blue-600"
                        : "bg-green-50 text-green-600"
                    }`}>
                      {ex.isSystem ? "Sistema" : "Custom"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
