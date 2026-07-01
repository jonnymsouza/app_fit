import { Skeleton } from "@/components/Skeleton"

export default function StudentsLoading() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex gap-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28 hidden sm:block" />
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-100 flex gap-8">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32 hidden sm:block" />
            <Skeleton className="h-4 w-12 hidden sm:block" />
            <Skeleton className="h-4 w-6" />
          </div>
        ))}
      </div>
    </div>
  )
}
