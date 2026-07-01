import { Skeleton } from "@/components/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="w-2 rounded-t" style={{ height: `${16 + j * 4}px` }} />
              ))}
            </div>
            <Skeleton className="h-3 w-20 mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
