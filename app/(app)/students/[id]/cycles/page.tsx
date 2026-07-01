import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { calcVolume, DOMINANCES, DOMINANCE_COLORS } from "@/lib/utils"
import { NewCycleButton } from "@/components/cycles/NewCycleButton"
import { CycleHistoryChart } from "@/components/cycles/CycleHistoryChart"
import { CyclesTable } from "@/components/cycles/CyclesTable"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

export default async function CyclesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { id } = await params
  const student = await prisma.student.findFirst({
    where: { id, trainerId: session.user.id },
    include: {
      cycles: {
        orderBy: { cycleNumber: "asc" },
        include: { trainings: { include: { exercises: true } } },
      },
    },
  })

  if (!student) notFound()

  const cycleRows = student.cycles.map((cycle) => {
    const allEx = cycle.trainings.flatMap((t) => t.exercises)
    const vol = calcVolume(allEx)
    const total = Object.values(vol).reduce((a, b) => a + b, 0)
    const c = cycle as typeof cycle & { startDate?: Date | null; endDate?: Date | null }
    return { cycle, c, vol, total }
  })

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0">
          <Breadcrumb items={[
            { label: "Alunos", href: "/students" },
            { label: student.fullName, href: `/students/${id}` },
            { label: "Ciclos" },
          ]} />
          <h1 className="text-2xl font-bold text-gray-900">Ciclos de Treino</h1>
        </div>
        <NewCycleButton studentId={id} />
      </div>

      {cycleRows.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>Nenhum ciclo criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cycleRows.length > 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Histórico de Volume — Todos os Ciclos</h2>
              <CycleHistoryChart data={cycleRows.map(({ cycle, vol, total }) => ({
                name: cycle.name ?? `Ciclo ${cycle.cycleNumber}`,
                ...vol,
                total,
              }))} />
            </div>
          )}

          <CyclesTable
            studentId={id}
            cycleRows={cycleRows.map(({ cycle, c, vol, total }) => ({
              id: cycle.id,
              name: cycle.name ?? `Ciclo ${cycle.cycleNumber}`,
              startDate: c.startDate ? c.startDate.toISOString() : null,
              endDate: c.endDate ? c.endDate.toISOString() : null,
              vol,
              total,
            }))}
          />
        </div>
      )}
    </div>
  )
}
