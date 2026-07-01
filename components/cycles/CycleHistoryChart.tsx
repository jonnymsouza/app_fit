"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DOMINANCE_COLORS } from "@/lib/utils"

type Props = {
  data: Array<Record<string, string | number>>
}

export function CycleHistoryChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        {(["Joelho", "Quadril", "Empurrada", "Puxada", "Core"] as const).map((d) => (
          <Bar key={d} dataKey={d} stackId="a" fill={DOMINANCE_COLORS[d]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
