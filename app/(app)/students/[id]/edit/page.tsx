import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StudentForm } from "@/components/students/StudentForm"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { format } from "date-fns"

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { id } = await params
  const student = await prisma.student.findFirst({ where: { id, trainerId: session.user.id }, include: { assessment: true } })
  if (!student) notFound()

  const initial = {
    fullName: student.fullName,
    birthDate: student.birthDate ? format(student.birthDate, "yyyy-MM-dd") : "",
    gender: student.gender ?? "",
    profession: student.profession ?? "",
    phone: student.phone ?? "",
    email: student.email ?? "",
    address: student.address ?? "",
    activityLevel: student.activityLevel ?? "",
    weight: student.weight?.toString() ?? "",
    height: student.height?.toString() ?? "",
    bodyFatPercent: student.bodyFatPercent?.toString() ?? "",
    leanMass: student.leanMass?.toString() ?? "",
    waistCm: student.waistCm?.toString() ?? "",
    hipCm: student.hipCm?.toString() ?? "",
    thighCm: student.thighCm?.toString() ?? "",
    assessmentDate: student.assessmentDate ? format(student.assessmentDate, "yyyy-MM-dd") : "",
    mainGoal: student.mainGoal ?? "",
    practiceYears: student.practiceYears ?? "",
    modalities: student.modalities ?? "",
    injuryHistory: student.injuryHistory ?? "",
    healthConditions: student.healthConditions ?? "",
    medications: student.medications ?? "",
    likes: student.likes ?? "",
    dislikes: student.dislikes ?? "",
    trainerNotes: student.trainerNotes ?? "",
    shortTermGoals: student.shortTermGoals ?? "",
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <Breadcrumb items={[
        { label: "Alunos", href: "/students" },
        { label: student.fullName, href: `/students/${id}` },
        { label: "Editar" },
      ]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Aluno</h1>
      <StudentForm initial={initial} studentId={id} initialAssessment={
        student.assessment
          ? (({ id: _id, studentId: _sid, updatedAt: _ua, ...rest }) => rest)(student.assessment)
          : undefined
      } />
    </div>
  )
}
