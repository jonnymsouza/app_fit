import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

async function getStudent(id: string, trainerId: string) {
  return prisma.student.findFirst({ where: { id, trainerId } })
}

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  profession: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  activityLevel: z.string().optional(),
  weight: z.coerce.number().optional().nullable(),
  height: z.coerce.number().optional().nullable(),
  bodyFatPercent: z.coerce.number().optional().nullable(),
  leanMass: z.coerce.number().optional().nullable(),
  waistCm: z.coerce.number().optional().nullable(),
  hipCm: z.coerce.number().optional().nullable(),
  thighCm: z.coerce.number().optional().nullable(),
  assessmentDate: z.string().optional(),
  mainGoal: z.string().optional(),
  practiceYears: z.string().optional(),
  modalities: z.string().optional(),
  injuryHistory: z.string().optional(),
  healthConditions: z.string().optional(),
  medications: z.string().optional(),
  likes: z.string().optional(),
  dislikes: z.string().optional(),
  trainerNotes: z.string().optional(),
  shortTermGoals: z.string().optional(),
  assessment: z.record(z.string().nullable()).optional(),
})

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const student = await prisma.student.findFirst({
    where: { id, trainerId: session.user.id },
    include: {
      assessment: true,
      cycles: { orderBy: { cycleNumber: "asc" }, include: { trainings: { include: { exercises: true } } } },
    },
  })

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(student)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const student = await getStudent(id, session.user.id)
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })

  const { assessment, ...rest } = parsed.data

  const updated = await prisma.student.update({
    where: { id },
    data: {
      ...rest,
      birthDate: rest.birthDate ? new Date(rest.birthDate) : undefined,
      assessmentDate: rest.assessmentDate ? new Date(rest.assessmentDate) : undefined,
      email: rest.email || undefined,
      ...(assessment
        ? {
            assessment: {
              upsert: {
                create: { ...assessment, updatedAt: new Date() },
                update: { ...assessment },
              },
            },
          }
        : {}),
    },
    include: { assessment: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const student = await getStudent(id, session.user.id)
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.student.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
