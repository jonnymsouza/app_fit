import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { calcAge, calcBMI } from "@/lib/utils"
import { StudentTabs } from "@/components/students/StudentTabs"
import { DeleteStudentButton } from "@/components/students/DeleteStudentButton"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { EvolutionChart } from "@/components/students/EvolutionChart"

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { id } = await params
  const student = await prisma.student.findFirst({
    where: { id, trainerId: session.user.id },
    include: {
      assessment: true,
      cycles: {
        orderBy: { cycleNumber: "asc" },
        include: {
          trainings: {
            include: {
              exercises: {
                select: { exerciseName: true, loadKg: true, reps: true, series: true },
              },
            },
          },
        },
      },
    },
  })

  if (!student) notFound()

  const age = student.birthDate ? calcAge(new Date(student.birthDate)) : null
  const bmi = student.weight && student.height ? calcBMI(student.weight, student.height) : null
  const lastCycle = student.cycles[student.cycles.length - 1]

  const evolutionData = student.cycles.map((cycle) => ({
    name: cycle.name ?? `Ciclo ${cycle.cycleNumber}`,
    exercises: cycle.trainings.flatMap((t) => t.exercises),
  }))

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Breadcrumb items={[
        { label: "Alunos", href: "/students" },
        { label: student.fullName },
      ]} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{student.fullName}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
            {age !== null && <span>{age} anos</span>}
            {student.mainGoal && <span>• {student.mainGoal}</span>}
            {student.weight && <span>• {student.weight}kg</span>}
            {bmi !== null && <span>• IMC {bmi}</span>}
          </div>
        </div>

        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <Link
            href={`/students/${id}/cycles`}
            className="bg-[#0d1b2a] hover:bg-[#1a3350] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {lastCycle ? "Ciclos" : "Criar Ciclo"}
          </Link>
          <Link
            href={`/students/${id}/edit`}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Editar
          </Link>
          <DeleteStudentButton studentId={id} studentName={student.fullName} />
        </div>
      </div>

      <StudentTabs student={student} />

      {evolutionData.length >= 2 && (
        <EvolutionChart cycles={evolutionData} />
      )}
    </div>
  )
}
