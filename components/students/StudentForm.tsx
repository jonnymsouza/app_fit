"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type StudentFormData = {
  fullName: string
  birthDate: string
  gender: string
  profession: string
  phone: string
  email: string
  address: string
  activityLevel: string
  weight: string
  height: string
  bodyFatPercent: string
  leanMass: string
  waistCm: string
  hipCm: string
  thighCm: string
  assessmentDate: string
  mainGoal: string
  practiceYears: string
  modalities: string
  injuryHistory: string
  healthConditions: string
  medications: string
  likes: string
  dislikes: string
  trainerNotes: string
  shortTermGoals: string
}

const empty: StudentFormData = {
  fullName: "", birthDate: "", gender: "", profession: "", phone: "", email: "",
  address: "", activityLevel: "", weight: "", height: "", bodyFatPercent: "",
  leanMass: "", waistCm: "", hipCm: "", thighCm: "", assessmentDate: "",
  mainGoal: "", practiceYears: "", modalities: "", injuryHistory: "",
  healthConditions: "", medications: "", likes: "", dislikes: "",
  trainerNotes: "", shortTermGoals: "",
}

type Props = { initial?: Partial<StudentFormData>; studentId?: string }

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#0d1b2a] text-white text-sm font-semibold hover:bg-[#1a3350] transition-colors"
      >
        <span>{title}</span>
        <svg
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>}
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  rows,
  options,
  required,
  colSpan,
}: {
  label: string
  name: keyof StudentFormData
  type?: string
  value: string
  onChange: (name: keyof StudentFormData, val: string) => void
  rows?: number
  options?: string[]
  required?: boolean
  colSpan?: boolean
}) {
  const base = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  return (
    <div className={colSpan ? "col-span-full" : ""}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
        <select className={base} value={value} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">—</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : rows ? (
        <textarea className={base} value={value} rows={rows} onChange={(e) => onChange(name, e.target.value)} />
      ) : (
        <input type={type} className={base} value={value} onChange={(e) => onChange(name, e.target.value)} />
      )}
    </div>
  )
}

function hasAny(form: StudentFormData, keys: (keyof StudentFormData)[]): boolean {
  return keys.some((k) => !!form[k])
}

export function StudentForm({ initial, studentId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<StudentFormData>({ ...empty, ...initial })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function set(name: keyof StudentFormData, val: string) {
    setForm((f) => ({ ...f, [name]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : v])
    )

    const url = studentId ? `/api/students/${studentId}` : "/api/students"
    const method = studentId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? "Erro ao salvar.")
      setLoading(false)
      return
    }

    const data = await res.json()
    router.push(`/students/${data.id}`)
    router.refresh()
  }

  const measuresHasData = hasAny(form, ["weight", "height", "bodyFatPercent", "leanMass", "waistCm", "hipCm", "thighCm", "assessmentDate"])
  const historyHasData = hasAny(form, ["mainGoal", "practiceYears", "modalities", "injuryHistory", "healthConditions", "medications"])
  const prefsHasData = hasAny(form, ["likes", "dislikes", "trainerNotes", "shortTermGoals"])

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Nome — always visible */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Nome Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nome completo do aluno"
        />
      </div>

      <AccordionSection title="Dados Pessoais" defaultOpen>
        <Field label="Data de Nascimento" name="birthDate" type="date" value={form.birthDate} onChange={set} />
        <Field label="Sexo" name="gender" value={form.gender} onChange={set} options={["Masculino", "Feminino", "Outro"]} />
        <Field label="Profissão" name="profession" value={form.profession} onChange={set} />
        <Field label="Nível de Atividade" name="activityLevel" value={form.activityLevel} onChange={set}
          options={["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo", "Extremamente ativo"]} />
        <Field label="Telefone" name="phone" type="tel" value={form.phone} onChange={set} />
        <Field label="Email" name="email" type="email" value={form.email} onChange={set} />
        <Field label="Endereço" name="address" value={form.address} onChange={set} colSpan />
      </AccordionSection>

      <AccordionSection title="Medidas e Avaliação Física" defaultOpen={measuresHasData}>
        <Field label="Peso (kg)" name="weight" type="number" value={form.weight} onChange={set} />
        <Field label="Altura (cm)" name="height" type="number" value={form.height} onChange={set} />
        <Field label="% Gordura" name="bodyFatPercent" type="number" value={form.bodyFatPercent} onChange={set} />
        <Field label="Massa Magra (kg)" name="leanMass" type="number" value={form.leanMass} onChange={set} />
        <Field label="Cintura (cm)" name="waistCm" type="number" value={form.waistCm} onChange={set} />
        <Field label="Quadril (cm)" name="hipCm" type="number" value={form.hipCm} onChange={set} />
        <Field label="Coxa (cm)" name="thighCm" type="number" value={form.thighCm} onChange={set} />
        <Field label="Data da Avaliação" name="assessmentDate" type="date" value={form.assessmentDate} onChange={set} />
      </AccordionSection>

      <AccordionSection title="Objetivo e Histórico" defaultOpen={historyHasData}>
        <Field label="Objetivo Principal" name="mainGoal" value={form.mainGoal} onChange={set} colSpan />
        <Field label="Pratica há" name="practiceYears" value={form.practiceYears} onChange={set} />
        <Field label="Modalidades" name="modalities" value={form.modalities} onChange={set} />
        <Field label="Histórico de Lesões / Cirurgias" name="injuryHistory" value={form.injuryHistory} onChange={set} rows={2} colSpan />
        <Field label="Doenças / Condições de Saúde" name="healthConditions" value={form.healthConditions} onChange={set} rows={2} colSpan />
        <Field label="Medicamentos em Uso" name="medications" value={form.medications} onChange={set} rows={2} colSpan />
      </AccordionSection>

      <AccordionSection title="Preferências e Observações" defaultOpen={prefsHasData}>
        <Field label="Gosta / Prefere" name="likes" value={form.likes} onChange={set} rows={2} colSpan />
        <Field label="Não Gosta / Evitar" name="dislikes" value={form.dislikes} onChange={set} rows={2} colSpan />
        <Field label="Observações do Personal" name="trainerNotes" value={form.trainerNotes} onChange={set} rows={2} colSpan />
        <Field label="Metas de Curto Prazo" name="shortTermGoals" value={form.shortTermGoals} onChange={set} rows={2} colSpan />
      </AccordionSection>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#0d1b2a] hover:bg-[#1a3350] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Salvando..." : studentId ? "Salvar Alterações" : "Cadastrar Aluno"}
        </button>
      </div>
    </form>
  )
}
