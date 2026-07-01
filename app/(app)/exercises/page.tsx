import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ExercisesClient } from "@/components/exercises/ExercisesClient"

export default async function ExercisesPage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const exercises = await prisma.exercise.findMany({
    where: { OR: [{ isSystem: true }, { trainerId: session.user.id }] },
    orderBy: [{ actionType: "asc" }, { name: "asc" }],
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banco de Exercícios</h1>
          <p className="text-gray-500 text-sm mt-1">{exercises.length} exercícios disponíveis</p>
        </div>
      </div>
      <ExercisesClient exercises={exercises} />
    </div>
  )
}
