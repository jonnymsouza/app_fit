"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { DOMINANCES, DOMINANCE_COLORS } from "@/lib/utils"

type TrainingState = { trainingNumber: number; exercises: { dominance: string; series: string }[] }

type Props = {
  trainings: TrainingState[]
  allVolumes: Record<string, number>[]
  totalVol: Record<string, number>
  activeTraining: number
  isOpen: boolean
  onClose: () => void
  mobile?: boolean
}

const TRAINING_COLORS = ["#1e3a5f", "#c0392b", "#27ae60", "#7b2d8b"]

function VolumePanelContent({
  trainings,
  allVolumes,
  totalVol,
  activeTraining,
}: Omit<Props, "isOpen" | "onClose" | "mobile">) {
  const chartData = DOMINANCES.map((d) => ({
    name: d,
    value: allVolumes[activeTraining][d],
    color: DOMINANCE_COLORS[d],
  })).filter((d) => d.value > 0)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-[#0d1b2a] text-white text-xs font-semibold px-4 py-2">
          Resumo de Volume por Dominância
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-3 py-2 text-gray-500">Dominância</th>
                {trainings.map((_, i) => (
                  <th
                    key={i}
                    className={`text-center px-2 py-2 font-medium ${i === activeTraining ? "text-white" : "text-gray-500"}`}
                    style={i === activeTraining ? { backgroundColor: TRAINING_COLORS[i] } : {}}
                  >
                    T{i + 1}
                  </th>
                ))}
                <th className="text-center px-2 py-2 font-semibold text-orange-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {DOMINANCES.map((d) => (
                <tr key={d} className="border-b border-gray-100">
                  <td className="px-3 py-1.5 font-medium" style={{ color: DOMINANCE_COLORS[d] }}>
                    {d}
                  </td>
                  {allVolumes.map((v, i) => (
                    <td key={i} className="px-2 py-1.5 text-center text-gray-600">
                      {v[d] || "—"}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-center font-semibold text-orange-600">
                    {totalVol[d] || "—"}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-3 py-1.5 font-semibold text-gray-700 text-xs">TOTAL</td>
                {allVolumes.map((v, i) => {
                  const t = Object.values(v).reduce((a, b) => a + b, 0)
                  return (
                    <td key={i} className="px-2 py-1.5 text-center font-semibold text-gray-700">
                      {t || "—"}
                    </td>
                  )
                })}
                <td className="px-2 py-1.5 text-center font-bold text-orange-600">
                  {Object.values(totalVol).reduce((a, b) => a + b, 0) || "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-600 mb-3">
            Volume — Treino {trainings[activeTraining].trainingNumber}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function VolumePanel({ trainings, allVolumes, totalVol, activeTraining, isOpen, onClose, mobile }: Props) {
  if (mobile) {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 z-40 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-gray-50 rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto z-10">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl sticky top-0">
            <span className="font-semibold text-gray-900 text-sm">Resumo de Volume</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <div className="p-4">
            <VolumePanelContent
              trainings={trainings}
              allVolumes={allVolumes}
              totalVol={totalVol}
              activeTraining={activeTraining}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0">
      <VolumePanelContent
        trainings={trainings}
        allVolumes={allVolumes}
        totalVol={totalVol}
        activeTraining={activeTraining}
      />
    </div>
  )
}
