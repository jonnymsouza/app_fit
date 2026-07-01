import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { calcVolume, DOMINANCE_COLORS, DOMINANCES } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

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

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Olá, {session.user.name}! Você tem {students.length} aluno{students.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link
          href="/students/new"
          className="bg-[#0d1b2a] hover:bg-[#1a3350] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Novo Aluno
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-4">👤</div>
          <p className="font-medium">Nenhum aluno cadastrado ainda.</p>
          <Link href="/students/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Cadastrar primeiro aluno
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {students.map((student) => {
            const lastCycle = student.cycles[0]
            const allExercises = lastCycle?.trainings.flatMap((t) => t.exercises) ?? []
            const vol = calcVolume(allExercises)
            const total = Object.values(vol).reduce((a, b) => a + b, 0)

            return (
              <Link key={student.id} href={`/students/${student.id}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">{student.fullName}</h2>
                      {student.mainGoal && (
                        <p className="text-xs text-gray-500 mt-0.5">{student.mainGoal}</p>
                      )}
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {lastCycle ? lastCycle.name ?? `Ciclo ${lastCycle.cycleNumber}` : "Sem ciclo"}
                    </span>
                  </div>

                  {total > 0 && (
                    <div className="flex gap-1 mt-3">
                      {DOMINANCES.map((d) =>
                        vol[d] > 0 ? (
                          <div key={d} className="flex flex-col items-center">
                            <div
                              className="w-2 rounded-t"
                              style={{
                                height: `${Math.min(vol[d] * 4, 32)}px`,
                                backgroundColor: DOMINANCE_COLORS[d],
                              }}
                            />
                            <span className="text-[9px] text-gray-400 mt-0.5">{d[0]}</span>
                          </div>
                        ) : null
                      )}
                      <span className="text-xs text-gray-400 ml-auto self-end">{total} séries</span>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3 text-xs text-gray-400">
                    {student.weight && <span>{student.weight}kg</span>}
                    {student.cycles.length > 0 && <span>{student.cycles.length} ciclo{student.cycles.length !== 1 ? "s" : ""}</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
