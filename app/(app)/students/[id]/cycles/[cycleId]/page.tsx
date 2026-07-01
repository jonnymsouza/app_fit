import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CycleEditor } from "@/components/cycles/CycleEditor"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

type Params = { id: string; cycleId: string }

export default async function CyclePage({ params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { id, cycleId } = await params

  const [cycle, exercises] = await Promise.all([
    prisma.trainingCycle.findFirst({
      where: { id: cycleId, studentId: id, student: { trainerId: session.user.id } },
      include: {
        student: { select: { fullName: true } },
        trainings: {
          orderBy: { trainingNumber: "asc" },
          include: { exercises: { orderBy: { order: "asc" } } },
        },
      },
    }),
    prisma.exercise.findMany({
      where: { OR: [{ isSystem: true }, { trainerId: session.user.id }] },
      orderBy: [{ actionType: "asc" }, { name: "asc" }],
    }),
  ])

  if (!cycle) notFound()

  const cycleName = cycle.name ?? `Ciclo ${cycle.cycleNumber}`
  const c = cycle as typeof cycle & { startDate?: Date | null; endDate?: Date | null }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <Breadcrumb items={[
        { label: "Alunos", href: "/students" },
        { label: cycle.student.fullName, href: `/students/${id}` },
        { label: "Ciclos", href: `/students/${id}/cycles` },
        { label: cycleName },
      ]} />

      <CycleEditor
        cycleId={cycleId}
        studentId={id}
        initialName={cycleName}
        initialStartDate={c.startDate?.toISOString() ?? null}
        initialEndDate={c.endDate?.toISOString() ?? null}
        trainings={cycle.trainings}
        exercises={exercises}
      />
    </div>
  )
}
