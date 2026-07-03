"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Exercise, Training, TrainingExercise } from "@prisma/client"
import { calcVolume, DOMINANCES, DOMINANCE_COLORS } from "@/lib/utils"
import { VolumePanel } from "./VolumePanel"
import { ExerciseRowPicker, parseReps, formatReps, type ExRow } from "./ExerciseRowPicker"

type TrainingState = {
  id: string
  trainingNumber: number
  observations: string
  exercises: ExRow[]
}

const REST_PRESETS = [
  { label: "30s", value: "30" },
  { label: "45s", value: "45" },
  { label: "1min", value: "60" },
  { label: "1:30", value: "90" },
  { label: "2min", value: "120" },
  { label: "3min", value: "180" },
  { label: "4min", value: "240" },
  { label: "5min", value: "300" },
]

const PSE_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

function StepInput({
  value,
  onChange,
  step = 1,
  min = 0,
  placeholder = "—",
  className = "",
}: {
  value: string
  onChange: (v: string) => void
  step?: number
  min?: number
  placeholder?: string
  className?: string
}) {
  function adjust(delta: number) {
    const current = parseFloat(value) || 0
    const next = Math.max(min, current + delta)
    onChange(String(next))
  }

  return (
    <div className={`flex items-center border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => adjust(-step)}
        className="px-2 py-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shrink-0 min-w-[32px] flex items-center justify-center"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-center text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none py-2 min-w-0"
      />
      <button
        type="button"
        onClick={() => adjust(step)}
        className="px-2 py-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shrink-0 min-w-[32px] flex items-center justify-center"
      >
        +
      </button>
    </div>
  )
}

function RepsInput({
  repsMin,
  repsMax,
  onChange,
}: {
  repsMin: string
  repsMax: string
  onChange: (min: string, max: string) => void
}) {
  const hasRange = repsMax !== ""
  const inputBase = "w-full text-center text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none py-2 min-w-0"

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(1, (parseInt(repsMin) || 0) - 1)), repsMax)}
          className="px-2 py-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shrink-0"
        >
          −
        </button>
        <input
          type="number"
          value={repsMin}
          min={1}
          step={1}
          placeholder="—"
          onChange={(e) => onChange(e.target.value, repsMax)}
          className={inputBase}
        />
        <button
          type="button"
          onClick={() => onChange(String((parseInt(repsMin) || 0) + 1), repsMax)}
          className="px-2 py-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shrink-0"
        >
          +
        </button>
      </div>

      {hasRange && (
        <>
          <span className="text-xs text-gray-400 shrink-0">a</span>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
            <button
              type="button"
              onClick={() => onChange(repsMin, String(Math.max(1, (parseInt(repsMax) || 0) - 1)))}
              className="px-2 py-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shrink-0"
            >
              −
            </button>
            <input
              type="number"
              value={repsMax}
              min={1}
              step={1}
              placeholder="—"
              onChange={(e) => onChange(repsMin, e.target.value)}
              className={inputBase}
            />
            <button
              type="button"
              onClick={() => onChange(repsMin, String((parseInt(repsMax) || 0) + 1))}
              className="px-2 py-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shrink-0"
            >
              +
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        title={hasRange ? "Remover variação" : "Adicionar variação (ex: 8 a 12)"}
        onClick={() => onChange(repsMin, hasRange ? "" : (repsMin || ""))}
        className={`shrink-0 text-xs px-1.5 py-1.5 rounded-lg border transition-colors ${
          hasRange
            ? "border-blue-300 text-blue-600 bg-blue-50"
            : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
        }`}
      >
        ±
      </button>
    </div>
  )
}

function rowFromDb(ex: TrainingExercise): ExRow {
  const { repsMin, repsMax } = parseReps(ex.reps ?? "")
  return {
    id: ex.id,
    order: ex.order,
    exerciseId: ex.exerciseId ?? undefined,
    dominance: ex.dominance ?? "",
    muscleTarget: ex.muscleTarget ?? "",
    exerciseName: ex.exerciseName ?? "",
    series: ex.series?.toString() ?? "",
    repsMin,
    repsMax,
    loadKg: ex.loadKg?.toString() ?? "",
    restSeconds: ex.restSeconds?.toString() ?? "",
    rpe: ex.rpe?.toString() ?? "",
  }
}

function blankRow(order: number): ExRow {
  return {
    order, dominance: "", muscleTarget: "", exerciseName: "",
    series: "", repsMin: "", repsMax: "", loadKg: "", restSeconds: "", rpe: "",
  }
}

const TRAINING_COLORS = ["#1e3a5f", "#c0392b", "#27ae60", "#7b2d8b", "#0891b2"]
const TRAINING_NAMES = ["Treino A", "Treino B", "Treino C", "Treino D", "Liberações e Mob."]

type Props = {
  cycleId: string
  studentId: string
  initialName: string
  initialStartDate?: string | null
  initialEndDate?: string | null
  trainings: (Training & { exercises: TrainingExercise[] })[]
  exercises: Exercise[]
}

export function CycleEditor({ cycleId, studentId, initialName, initialStartDate, initialEndDate, trainings, exercises }: Props) {
  const router = useRouter()

  const [name, setName] = useState(initialName)
  const [startDate, setStartDate] = useState(initialStartDate ? initialStartDate.slice(0, 10) : "")
  const [endDate, setEndDate] = useState(initialEndDate ? initialEndDate.slice(0, 10) : "")

  const [state, setState] = useState<TrainingState[]>(
    trainings.map((t) => ({
      id: t.id,
      trainingNumber: t.trainingNumber,
      observations: t.observations ?? "",
      exercises: t.exercises.map(rowFromDb),
    }))
  )

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTraining, setActiveTraining] = useState(0)
  const [volumeOpen, setVolumeOpen] = useState(false)

  function updateObs(ti: number, val: string) {
    setState((s) => s.map((t, i) => i === ti ? { ...t, observations: val } : t))
  }

  function updateRow(ti: number, ri: number, partial: Partial<ExRow>) {
    setState((s) =>
      s.map((t, i) => {
        if (i !== ti) return t
        return { ...t, exercises: t.exercises.map((r, j) => j === ri ? { ...r, ...partial } : r) }
      })
    )
  }

  function addRow(ti: number) {
    setState((s) =>
      s.map((t, i) => i !== ti ? t : { ...t, exercises: [...t.exercises, blankRow(t.exercises.length)] })
    )
  }

  function removeRow(ti: number, ri: number) {
    setState((s) =>
      s.map((t, i) => {
        if (i !== ti) return t
        return { ...t, exercises: t.exercises.filter((_, j) => j !== ri).map((r, j) => ({ ...r, order: j })) }
      })
    )
  }

  async function save() {
    setSaving(true)
    const body = {
      name: name || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      trainings: state.map((t) => ({
        id: t.id,
        observations: t.observations || undefined,
        exercises: t.exercises
          .filter((r) => r.exerciseName || r.exerciseId)
          .map((r, i) => ({
            order: i,
            exerciseId: r.exerciseId || undefined,
            dominance: r.dominance || undefined,
            muscleTarget: r.muscleTarget || undefined,
            exerciseName: r.exerciseName || undefined,
            series: r.series ? parseInt(r.series) : undefined,
            reps: formatReps(r.repsMin, r.repsMax) || undefined,
            loadKg: r.loadKg ? parseFloat(r.loadKg) : undefined,
            restSeconds: r.restSeconds ? parseInt(r.restSeconds) : undefined,
            rpe: r.rpe ? parseInt(r.rpe) : undefined,
          })),
      })),
    }

    await fetch(`/api/students/${studentId}/cycles/${cycleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  const allVolumes = state.map((t) =>
    calcVolume(t.exercises.map((r) => ({
      dominance: r.dominance,
      series: parseInt(r.series) || 0,
      repsMin: r.repsMin,
      loadKg: r.loadKg ? parseFloat(r.loadKg) : 0,
    })))
  )

  const totalVol = DOMINANCES.reduce(
    (acc, d) => ({ ...acc, [d]: allVolumes.reduce((sum, v) => sum + v[d], 0) }),
    {} as Record<string, number>
  )

  const current = state[activeTraining]

  const inputSm = "border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400 py-2 w-full bg-white"

  return (
    <div className="flex gap-6 min-h-0 relative">
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do ciclo"
            className="font-semibold text-gray-900 text-base bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none py-0.5 min-w-0 flex-1 transition-colors"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setVolumeOpen(true)}
              className="md:hidden text-sm border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Volume
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="bg-[#0d1b2a] hover:bg-[#1a3350] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar"}
            </button>
          </div>
        </div>

        {/* Datas do ciclo */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            />
          </div>
        </div>

        {/* Training tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {state.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTraining(i)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                i === activeTraining ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700 bg-gray-100"
              }`}
              style={i === activeTraining ? { backgroundColor: TRAINING_COLORS[i] } : {}}
            >
              {TRAINING_NAMES[i]}
            </button>
          ))}
        </div>

        {/* Observations */}
        <div
          className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4"
          style={{ borderLeftWidth: 3, borderLeftColor: TRAINING_COLORS[activeTraining] }}
        >
          <textarea
            placeholder="Observações do treino (ex: foco em hipertrofia, evitar carga alta no ombro...)"
            value={current.observations}
            onChange={(e) => updateObs(activeTraining, e.target.value)}
            rows={2}
            className="w-full text-sm text-gray-600 bg-transparent resize-none focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* ── DESKTOP TABLE (md+) ── */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium">
                  <th className="text-left px-3 py-3 w-8">#</th>
                  <th className="text-left px-2 py-3 w-28">Dominância</th>
                  <th className="text-left px-2 py-3 w-32">Músculo</th>
                  <th className="text-left px-2 py-3 min-w-[180px]">Exercício</th>
                  <th className="text-center px-2 py-3 w-24">Séries</th>
                  <th className="text-center px-2 py-3 w-44">Repetições</th>
                  <th className="text-center px-2 py-3 w-32">Carga (kg)</th>
                  <th className="text-center px-2 py-3 w-28">Descanso</th>
                  <th className="text-center px-2 py-3 w-20">PSE</th>
                  <th className="text-center px-2 py-3 w-12">Vol</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {current.exercises.map((row, ri) => {
                  const vol = parseInt(row.series) || 0
                  const domColor = DOMINANCE_COLORS[row.dominance]
                  return (
                    <tr key={ri} className="border-b border-gray-100 hover:bg-gray-50/50 group">
                      <td className="px-3 py-2 text-gray-400 text-xs">{ri + 1}</td>
                      <ExerciseRowPicker
                        exercises={exercises}
                        row={row}
                        onChange={(p) => updateRow(activeTraining, ri, p)}
                        mode="table"
                      />
                      {/* Séries */}
                      <td className="px-2 py-2">
                        <StepInput
                          value={row.series}
                          onChange={(v) => updateRow(activeTraining, ri, { series: v })}
                          step={1} min={1}
                        />
                      </td>
                      {/* Reps */}
                      <td className="px-2 py-2">
                        <RepsInput
                          repsMin={row.repsMin}
                          repsMax={row.repsMax}
                          onChange={(min, max) => updateRow(activeTraining, ri, { repsMin: min, repsMax: max })}
                        />
                      </td>
                      {/* Carga */}
                      <td className="px-2 py-2">
                        <StepInput
                          value={row.loadKg}
                          onChange={(v) => updateRow(activeTraining, ri, { loadKg: v })}
                          step={5} min={0}
                          placeholder="kg"
                        />
                      </td>
                      {/* Descanso */}
                      <td className="px-2 py-2">
                        <select
                          value={row.restSeconds}
                          onChange={(e) => updateRow(activeTraining, ri, { restSeconds: e.target.value })}
                          className={inputSm}
                        >
                          <option value="">—</option>
                          {REST_PRESETS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </td>
                      {/* PSE */}
                      <td className="px-2 py-2">
                        <select
                          value={row.rpe}
                          onChange={(e) => updateRow(activeTraining, ri, { rpe: e.target.value })}
                          className={inputSm}
                        >
                          <option value="">—</option>
                          {PSE_OPTIONS.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      {/* Volume */}
                      <td className="px-2 py-2 text-center font-semibold text-sm" style={{ color: domColor || "#9ca3af" }}>
                        {vol || "—"}
                      </td>
                      <td className="px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeRow(activeTraining, ri)}
                          className="text-red-400 hover:text-red-600 text-lg w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => addRow(activeTraining)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              + Adicionar exercício
            </button>
          </div>
        </div>

        {/* ── MOBILE CARDS (< md) ── */}
        <div className="md:hidden space-y-3">
          {current.exercises.map((row, ri) => {
            const vol = parseInt(row.series) || 0
            const domColor = DOMINANCE_COLORS[row.dominance]
            return (
              <div
                key={ri}
                className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3"
                style={{ borderLeftWidth: 4, borderLeftColor: domColor || "#e5e7eb" }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">EXERCÍCIO {ri + 1}</span>
                  <div className="flex items-center gap-3">
                    {vol > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: (domColor || "#888") + "22", color: domColor || "#888" }}>
                        Vol: {vol}
                      </span>
                    )}
                    <button onClick={() => removeRow(activeTraining, ri)} className="text-gray-300 hover:text-red-400 text-2xl leading-none transition-colors">×</button>
                  </div>
                </div>

                {/* Bidirectional picker */}
                <ExerciseRowPicker
                  exercises={exercises}
                  row={row}
                  onChange={(p) => updateRow(activeTraining, ri, p)}
                  mobile
                />

                {/* Séries + Reps */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Séries</label>
                    <StepInput
                      value={row.series}
                      onChange={(v) => updateRow(activeTraining, ri, { series: v })}
                      step={1} min={1}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">
                      Repetições
                      {row.repsMax && <span className="text-blue-500 ml-1">({row.repsMin}–{row.repsMax})</span>}
                    </label>
                    <RepsInput
                      repsMin={row.repsMin}
                      repsMax={row.repsMax}
                      onChange={(min, max) => updateRow(activeTraining, ri, { repsMin: min, repsMax: max })}
                    />
                  </div>
                </div>

                {/* Carga + Descanso + PSE */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Carga (kg)</label>
                    <StepInput
                      value={row.loadKg}
                      onChange={(v) => updateRow(activeTraining, ri, { loadKg: v })}
                      step={5} min={0}
                      placeholder="kg"
                      className="min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Descanso</label>
                    <select
                      value={row.restSeconds}
                      onChange={(e) => updateRow(activeTraining, ri, { restSeconds: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px] bg-white"
                    >
                      <option value="">—</option>
                      {REST_PRESETS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">PSE</label>
                    <select
                      value={row.rpe}
                      onChange={(e) => updateRow(activeTraining, ri, { rpe: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px] bg-white"
                    >
                      <option value="">—</option>
                      {PSE_OPTIONS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={() => addRow(activeTraining)}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors font-medium"
          >
            + Adicionar exercício
          </button>
        </div>
      </div>

      {/* Desktop: VolumePanel sidebar */}
      <div className="hidden md:block w-72 shrink-0">
        <VolumePanel
          trainings={state}
          allVolumes={allVolumes}
          totalVol={totalVol}
          activeTraining={activeTraining}
          isOpen={false}
          onClose={() => {}}
        />
      </div>

      {/* Mobile: VolumePanel bottom sheet */}
      <div className="md:hidden">
        <VolumePanel
          trainings={state}
          allVolumes={allVolumes}
          totalVol={totalVol}
          activeTraining={activeTraining}
          isOpen={volumeOpen}
          onClose={() => setVolumeOpen(false)}
          mobile
        />
      </div>
    </div>
  )
}
