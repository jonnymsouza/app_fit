import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

type Params = { id: string; cycleId: string }

async function getCycle(cycleId: string, studentId: string, trainerId: string) {
  return prisma.trainingCycle.findFirst({
    where: { id: cycleId, studentId, student: { trainerId } },
    include: {
      trainings: {
        orderBy: { trainingNumber: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  })
}

export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, cycleId } = await params
  const cycle = await getCycle(cycleId, id, session.user.id)
  if (!cycle) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(cycle)
}

export async function PUT(req: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, cycleId } = await params
  const existing = await getCycle(cycleId, id, session.user.id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body: {
    name?: string
    startDate?: string
    endDate?: string
    trainings: {
      id: string
      observations?: string
      exercises: {
        order: number
        exerciseId?: string
        dominance?: string
        muscleTarget?: string
        exerciseName?: string
        series?: number
        reps?: string
        loadKg?: number
        restSeconds?: number
        rpe?: number
      }[]
    }[]
  } = await req.json()

  if (body.name !== undefined || body.startDate !== undefined || body.endDate !== undefined) {
    await prisma.trainingCycle.update({
      where: { id: cycleId },
      data: {
        ...(body.name !== undefined && { name: body.name || null }),
        ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
      },
    })
  }

  await prisma.$transaction(
    body.trainings.map((t) =>
      prisma.training.update({
        where: { id: t.id },
        data: {
          observations: t.observations,
          exercises: {
            deleteMany: {},
            create: t.exercises.map((ex, i) => ({
              order: ex.order ?? i,
              exerciseId: ex.exerciseId || undefined,
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
        },
      })
    )
  )

  const updated = await getCycle(cycleId, id, session.user.id)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, cycleId } = await params
  const cycle = await getCycle(cycleId, id, session.user.id)
  if (!cycle) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.trainingCycle.delete({ where: { id: cycleId } })
  return NextResponse.json({ ok: true })
}
