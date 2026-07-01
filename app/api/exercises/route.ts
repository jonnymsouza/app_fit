import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const schema = z.object({
  actionType: z.string().min(1),
  name: z.string().min(1),
  equipment: z.string().optional(),
  muscleGroup: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const actionType = searchParams.get("actionType")

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        { OR: [{ isSystem: true }, { trainerId: session.user.id }] },
        actionType ? { actionType } : {},
      ],
    },
    orderBy: [{ actionType: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(exercises)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })

  const exercise = await prisma.exercise.create({
    data: { ...parsed.data, trainerId: session.user.id, isSystem: false },
  })

  return NextResponse.json(exercise, { status: 201 })
}
