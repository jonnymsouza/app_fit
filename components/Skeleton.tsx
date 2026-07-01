import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={cn("animate-pulse bg-gray-200 rounded", className)} style={style} />
}
