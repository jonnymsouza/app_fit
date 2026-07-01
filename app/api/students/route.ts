import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const studentSchema = z.object({
  fullName: z.string().min(2),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  profession: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  activityLevel: z.string().optional(),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  bodyFatPercent: z.coerce.number().optional(),
  leanMass: z.coerce.number().optional(),
  waistCm: z.coerce.number().optional(),
  hipCm: z.coerce.number().optional(),
  thighCm: z.coerce.number().optional(),
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
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const students = await prisma.student.findMany({
    where: { trainerId: session.user.id },
    orderBy: { fullName: "asc" },
    include: {
      cycles: {
        orderBy: { cycleNumber: "desc" },
        take: 1,
        include: { trainings: { include: { exercises: true } } },
      },
    },
  })

  return NextResponse.json(students)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = studentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data
  const student = await prisma.student.create({
    data: {
      trainerId: session.user.id,
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : undefined,
      email: data.email || undefined,
    },
  })

  return NextResponse.json(student, { status: 201 })
}
