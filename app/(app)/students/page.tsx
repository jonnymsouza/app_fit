import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"

const PAGE_SIZE = 20

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1") || 1)
  const skip = (page - 1) * PAGE_SIZE

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: { trainerId: session.user.id },
      orderBy: { fullName: "asc" },
      include: { _count: { select: { cycles: true } } },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.student.count({ where: { trainerId: session.user.id } }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <Link
          href="/students/new"
          className="bg-[#0d1b2a] hover:bg-[#1a3350] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Novo Aluno
        </Link>
      </div>

      {students.length === 0 && total === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-4">👤</div>
          <p>Nenhum aluno cadastrado.</p>
          <Link href="/students/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Cadastrar primeiro aluno
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Objetivo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Peso</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ciclos</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.fullName}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{s.mainGoal ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{s.weight ? `${s.weight}kg` : "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{s._count.cycles}</td>
                      <td className="px-4 py-3">
                        <Link href={`/students/${s.id}`} className="text-blue-600 hover:underline">
                          Ver perfil
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>{total} alunos — página {page} de {totalPages}</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/students?page=${page - 1}`}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Anterior
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/students?page=${page + 1}`}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Próximo →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
