import { StudentForm } from "@/components/students/StudentForm"

export default function NewStudentPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Aluno</h1>
      <StudentForm />
    </div>
  )
}
