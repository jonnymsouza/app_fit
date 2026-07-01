"use client"

import { useState, useMemo } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"

type ExerciseEntry = {
  exerciseName: string | null
  loadKg: number | null
  reps: string | null
  series: number | null
}

type CycleData = {
  name: string
  exercises: ExerciseEntry[]
}

type Props = {
  cycles: CycleData[]
}

export function EvolutionChart({ cycles }: Props) {
  const exerciseNames = useMemo(() => {
    const names = cycles
      .flatMap((c) => c.exercises.map((e) => e.exerciseName))
      .filter((n): n is string => !!n)
    return Array.from(new Set(names)).sort()
  }, [cycles])

  const [selected, setSelected] = useState<string>(exerciseNames[0] ?? "")

  const chartData = useMemo(() => {
    return cycles.map((cycle) => {
      const match = cycle.exercises.find((e) => e.exerciseName === selected)
      return {
        name: cycle.name,
        "Carga (kg)": match?.loadKg ?? null,
        "Séries": match?.series ?? null,
      }
    })
  }, [cycles, selected])

  const hasData = chartData.some((d) => d["Carga (kg)"] !== null)

  if (exerciseNames.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <h2 className="font-semibold text-gray-900">Evolução por Exercício</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white max-w-[200px] truncate"
        >
          {exerciseNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {!hasData ? (
        <p className="text-sm text-gray-400 py-6 text-center">
          Nenhuma carga registrada para este exercício ainda.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit=" kg" />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === "Carga (kg)" ? [`${value} kg`, name] : [value, name]
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="Carga (kg)"
              stroke="#1e3a5f"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="Séries"
              stroke="#27ae60"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
