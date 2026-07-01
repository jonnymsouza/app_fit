import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

type Params = { id: string; cycleId: string }

export async function POST(_req: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: studentId, cycleId } = await params

  const source = await prisma.trainingCycle.findFirst({
    where: { id: cycleId, studentId, student: { trainerId: session.user.id } },
    include: {
      trainings: {
        orderBy: { trainingNumber: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  })

  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const last = await prisma.trainingCycle.findFirst({
    where: { studentId },
    orderBy: { cycleNumber: "desc" },
  })
  const nextNumber = (last?.cycleNumber ?? 0) + 1

  const copy = await prisma.trainingCycle.create({
    data: {
      studentId,
      cycleNumber: nextNumber,
      name: `Ciclo ${String(nextNumber).padStart(2, "0")}`,
      trainings: {
        create: source.trainings.map((t) => ({
          trainingNumber: t.trainingNumber,
          observations: t.observations,
          exercises: {
            create: t.exercises.map((ex) => ({
              order: ex.order,
              exerciseId: ex.exerciseId,
              dominance: ex.dominance,
              muscleTarget: ex.muscleTarget,
              exerciseName: ex.exerciseName,
              series: ex.series,
              reps: ex.reps,
              loadKg: ex.loadKg,
              restSeconds: ex.restSeconds,
              rpe: ex.rpe,
            })),
          },
        })),
      },
    },
  })

  return NextResponse.json({ id: copy.id }, { status: 201 })
}
