import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcBMI(weight: number, heightCm: number): number {
  const h = heightCm / 100
  return Math.round((weight / (h * h)) * 10) / 10
}

export function calcAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export const DOMINANCE_LABELS: Record<string, string> = {
  Joelho: "Joelho",
  Quadril: "Quadril",
  Empurrada: "Empurrada",
  Puxada: "Puxada",
  Core: "Core",
}

export const DOMINANCE_COLORS: Record<string, string> = {
  Joelho: "#22c55e",
  Quadril: "#a855f7",
  Empurrada: "#ef4444",
  Puxada: "#3b82f6",
  Core: "#f97316",
}

export const ACTION_TYPE_TO_DOMINANCE: Record<string, string> = {
  "Joelho": "Joelho",
  "Quadril": "Quadril",
  "Empurrada Horizontal": "Empurrada",
  "Empurrada Vertical": "Empurrada",
  "Puxada Vertical": "Puxada",
  "Puxada Horizontal": "Puxada",
  "Core - Antirrotação": "Core",
  "Core - Anti-hiperextensão": "Core",
  "Core - Antiflexão Lateral": "Core",
  "Core": "Core",
}

export const DOMINANCES = ["Joelho", "Quadril", "Empurrada", "Puxada", "Core"] as const
export type Dominance = (typeof DOMINANCES)[number]

export function calcVolume(exercises: { dominance?: string | null; series?: number | null }[]) {
  const vol: Record<string, number> = { Joelho: 0, Quadril: 0, Empurrada: 0, Puxada: 0, Core: 0 }
  for (const ex of exercises) {
    if (ex.dominance && ex.series && vol[ex.dominance] !== undefined) {
      vol[ex.dominance] += ex.series
    }
  }
  return vol
}
