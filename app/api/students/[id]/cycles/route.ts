import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const student = await prisma.student.findFirst({ where: { id, trainerId: session.user.id } })
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const cycles = await prisma.trainingCycle.findMany({
    where: { studentId: id },
    orderBy: { cycleNumber: "asc" },
    include: {
      trainings: {
        orderBy: { trainingNumber: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  })

  return NextResponse.json(cycles)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const student = await prisma.student.findFirst({ where: { id, trainerId: session.user.id } })
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const lastCycle = await prisma.trainingCycle.findFirst({
    where: { studentId: id },
    orderBy: { cycleNumber: "desc" },
  })
  const nextNumber = (lastCycle?.cycleNumber ?? 0) + 1

  const cycle = await prisma.trainingCycle.create({
    data: {
      studentId: id,
      cycleNumber: nextNumber,
      name: `Ciclo ${String(nextNumber).padStart(2, "0")}`,
      trainings: {
        create: [1, 2, 3, 4].map((n) => ({ trainingNumber: n })),
      },
    },
    include: { trainings: { orderBy: { trainingNumber: "asc" }, include: { exercises: true } } },
  })

  return NextResponse.json(cycle, { status: 201 })
}
