"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import type { Exercise } from "@prisma/client"
import { ACTION_TYPE_TO_DOMINANCE, DOMINANCES, DOMINANCE_COLORS } from "@/lib/utils"

export type ExRow = {
  id?: string
  order: number
  exerciseId?: string
  dominance: string
  muscleTarget: string
  exerciseName: string
  series: string
  repsMin: string
  repsMax: string
  loadKg: string
  restSeconds: string
  rpe: string
}

export function parseReps(repsStr: string): { repsMin: string; repsMax: string } {
  if (!repsStr) return { repsMin: "", repsMax: "" }
  const parts = repsStr.split("-")
  if (parts.length === 2) return { repsMin: parts[0].trim(), repsMax: parts[1].trim() }
  return { repsMin: repsStr.trim(), repsMax: "" }
}

export function formatReps(repsMin: string, repsMax: string): string {
  if (!repsMin) return ""
  if (repsMax) return `${repsMin}-${repsMax}`
  return repsMin
}

function ExercisePickerModal({
  exercises,
  activeDominance,
  activeMuscle,
  onSelect,
  onClose,
}: {
  exercises: Exercise[]
  activeDominance: string
  activeMuscle: string
  onSelect: (ex: Exercise) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState("")
  const [filterDominance, setFilterDominance] = useState(activeDominance)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const dom = ACTION_TYPE_TO_DOMINANCE[ex.actionType] ?? ""
      if (filterDominance && dom !== filterDominance) return false
      if (activeMuscle && ex.muscleGroup && !ex.muscleGroup.toLowerCase().includes(activeMuscle.toLowerCase())) return false
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [exercises, filterDominance, activeMuscle, search])

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-xl shadow-xl flex flex-col max-h-[85vh] z-10">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">Selecionar Exercício</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="px-4 py-2 border-b border-gray-100">
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar exercício..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-1.5 px-4 py-2 flex-wrap border-b border-gray-100">
          <button
            onClick={() => setFilterDominance("")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              !filterDominance ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {DOMINANCES.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDominance(filterDominance === d ? "" : d)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
              style={
                filterDominance === d
                  ? { backgroundColor: DOMINANCE_COLORS[d], color: "white" }
                  : { backgroundColor: DOMINANCE_COLORS[d] + "22", color: DOMINANCE_COLORS[d] }
              }
            >
              {d}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">Nenhum exercício encontrado</p>
          ) : (
            <ul>
              {filtered.map((ex) => {
                const dom = ACTION_TYPE_TO_DOMINANCE[ex.actionType] ?? ""
                return (
                  <li key={ex.id}>
                    <button
                      onClick={() => { onSelect(ex); onClose() }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between gap-3 border-b border-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-900">{ex.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
                        style={{ backgroundColor: DOMINANCE_COLORS[dom] + "22", color: DOMINANCE_COLORS[dom] }}
                      >
                        {dom || ex.actionType}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

type PickerProps = {
  exercises: Exercise[]
  row: ExRow
  onChange: (partial: Partial<ExRow>) => void
  /** "table" → renders 3 <td> elements; "stacked" → renders 3 stacked <div> (default) */
  mode?: "table" | "stacked"
  /** alias for mode="stacked" when used in mobile cards */
  mobile?: boolean
}

export function ExerciseRowPicker({ exercises, row, onChange, mode, mobile }: PickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const isTable = mode === "table" && !mobile

  const muscleOptions = useMemo(() => {
    const groups = exercises
      .filter((ex) => {
        if (!row.dominance) return true
        return (ACTION_TYPE_TO_DOMINANCE[ex.actionType] ?? "") === row.dominance
      })
      .map((ex) => ex.muscleGroup)
      .filter((g): g is string => !!g)
    return Array.from(new Set(groups)).sort()
  }, [exercises, row.dominance])

  function handleDominanceChange(dom: string) {
    const muscleStillValid = dom
      ? exercises.some(
          (ex) =>
            (ACTION_TYPE_TO_DOMINANCE[ex.actionType] ?? "") === dom &&
            ex.muscleGroup === row.muscleTarget
        )
      : true
    onChange({
      dominance: dom,
      exerciseId: undefined,
      exerciseName: "",
      muscleTarget: muscleStillValid ? row.muscleTarget : "",
    })
  }

  function handleMuscleChange(muscle: string) {
    let dominance = row.dominance
    if (muscle) {
      const match = exercises.find((ex) => ex.muscleGroup === muscle)
      if (match) dominance = ACTION_TYPE_TO_DOMINANCE[match.actionType] ?? dominance
    }
    onChange({ muscleTarget: muscle, dominance, exerciseId: undefined, exerciseName: "" })
  }

  function handleExerciseSelect(ex: Exercise) {
    onChange({
      exerciseId: ex.id,
      exerciseName: ex.name,
      dominance: ACTION_TYPE_TO_DOMINANCE[ex.actionType] ?? row.dominance,
      muscleTarget: ex.muscleGroup ?? row.muscleTarget,
    })
  }

  const domColor = row.dominance ? DOMINANCE_COLORS[row.dominance] : undefined
  const selectBase = "w-full border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
  const labelBase = "block text-xs text-gray-500 mb-0.5 font-medium"

  const dominanceField = (
    <select
      value={row.dominance}
      onChange={(e) => handleDominanceChange(e.target.value)}
      className={selectBase}
      style={domColor ? { borderColor: domColor, color: domColor } : {}}
    >
      <option value="">— Dominância</option>
      {DOMINANCES.map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>
  )

  const muscleField = (
    <select
      value={row.muscleTarget}
      onChange={(e) => handleMuscleChange(e.target.value)}
      className={selectBase}
    >
      <option value="">— Músculo</option>
      {muscleOptions.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  )

  const exerciseField = (
    <>
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className={`${selectBase} text-left truncate hover:bg-gray-50 transition-colors`}
        style={row.exerciseName ? {} : { color: "#9ca3af" }}
      >
        {row.exerciseName || "— Exercício"}
      </button>
      {pickerOpen && (
        <ExercisePickerModal
          exercises={exercises}
          activeDominance={row.dominance}
          activeMuscle={row.muscleTarget}
          onSelect={handleExerciseSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )

  if (isTable) {
    // Renders 3 <td> cells for use inside a <tr>
    return (
      <>
        <td className="px-1 py-1">{dominanceField}</td>
        <td className="px-1 py-1">{muscleField}</td>
        <td className="px-1 py-1">{exerciseField}</td>
      </>
    )
  }

  // Stacked layout for mobile cards
  return (
    <div className="space-y-1.5">
      <div>
        <label className={labelBase}>Dominância</label>
        {dominanceField}
      </div>
      <div>
        <label className={labelBase}>Músculo Alvo</label>
        {muscleField}
      </div>
      <div>
        <label className={labelBase}>Exercício</label>
        {exerciseField}
      </div>
    </div>
  )
}
