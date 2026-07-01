"use client"

import { useState } from "react"
import type { Student, StudentAssessment } from "@prisma/client"

type Props = {
  student: Student & { assessment: StudentAssessment | null }
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 text-sm text-gray-500 font-medium w-48">{label}</td>
      <td className="py-2 text-sm text-gray-900">{value}</td>
    </tr>
  )
}

function SidedRow({ label, left, right }: { label: string; left?: string | null; right?: string | null }) {
  if (!left && !right) return null
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 text-sm text-gray-500 font-medium w-48">{label}</td>
      <td className="py-2 text-sm text-gray-900">
        {left && <span className="mr-4">Esq: <strong>{left}</strong></span>}
        {right && <span>Dir: <strong>{right}</strong></span>}
      </td>
    </tr>
  )
}

const TABS = ["Anamnese", "Testes Funcionais", "Preferências"] as const

export function StudentTabs({ student }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Anamnese")
  const a = student.assessment

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-[#0d1b2a] text-[#0d1b2a]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Anamnese" && (
        <div className="space-y-6">
          <table className="w-full">
            <tbody>
              <tr><td colSpan={2} className="pb-2 font-semibold text-gray-700">Dados Pessoais</td></tr>
              <Row label="Sexo" value={student.gender} />
              <Row label="Profissão" value={student.profession} />
              <Row label="Telefone" value={student.phone} />
              <Row label="Email" value={student.email} />
              <Row label="Endereço" value={student.address} />
              <Row label="Nível de Atividade" value={student.activityLevel} />
            </tbody>
          </table>

          <table className="w-full">
            <tbody>
              <tr><td colSpan={2} className="pb-2 font-semibold text-gray-700 pt-4">Medidas Físicas</td></tr>
              <Row label="Peso" value={student.weight ? `${student.weight} kg` : null} />
              <Row label="Altura" value={student.height ? `${student.height} cm` : null} />
              <Row label="% Gordura" value={student.bodyFatPercent ? `${student.bodyFatPercent}%` : null} />
              <Row label="Massa Magra" value={student.leanMass ? `${student.leanMass} kg` : null} />
              <Row label="Cintura" value={student.waistCm ? `${student.waistCm} cm` : null} />
              <Row label="Quadril" value={student.hipCm ? `${student.hipCm} cm` : null} />
              <Row label="Coxa" value={student.thighCm ? `${student.thighCm} cm` : null} />
            </tbody>
          </table>

          <table className="w-full">
            <tbody>
              <tr><td colSpan={2} className="pb-2 font-semibold text-gray-700 pt-4">Objetivo e Histórico</td></tr>
              <Row label="Objetivo Principal" value={student.mainGoal} />
              <Row label="Pratica há" value={student.practiceYears} />
              <Row label="Modalidades" value={student.modalities} />
              <Row label="Lesões / Cirurgias" value={student.injuryHistory} />
              <Row label="Condições de Saúde" value={student.healthConditions} />
              <Row label="Medicamentos" value={student.medications} />
            </tbody>
          </table>
        </div>
      )}

      {tab === "Preferências" && (
        <div className="space-y-4 max-w-xl">
          {student.likes && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-xs font-semibold text-green-700 mb-1">✓ Gosta / Prefere</div>
              <p className="text-sm text-gray-700">{student.likes}</p>
            </div>
          )}
          {student.dislikes && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-xs font-semibold text-red-700 mb-1">✗ Não Gosta / Evitar</div>
              <p className="text-sm text-gray-700">{student.dislikes}</p>
            </div>
          )}
          {student.trainerNotes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-xs font-semibold text-yellow-700 mb-1">⚠ Observações do Personal</div>
              <p className="text-sm text-gray-700">{student.trainerNotes}</p>
            </div>
          )}
          {student.shortTermGoals && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-xs font-semibold text-blue-700 mb-1">◎ Metas de Curto Prazo</div>
              <p className="text-sm text-gray-700">{student.shortTermGoals}</p>
            </div>
          )}
          {!student.likes && !student.dislikes && !student.trainerNotes && !student.shortTermGoals && (
            <p className="text-gray-400 text-sm">Nenhuma preferência registrada.</p>
          )}
        </div>
      )}

      {tab === "Testes Funcionais" && (
        <div>
          {!a ? (
            <p className="text-gray-400 text-sm">Nenhum teste funcional registrado.</p>
          ) : (
            <table className="w-full max-w-xl">
              <tbody>
                <Row label="Overhead Squat" value={a.overheadSquat} />
                <Row label="Hip Hinge" value={a.hipHinge} />
                <SidedRow label="Rot. Ombro Interna" left={a.shoulderInternalRotLeft} right={a.shoulderInternalRotRight} />
                <SidedRow label="Rot. Ombro Externa" left={a.shoulderExternalRotLeft} right={a.shoulderExternalRotRight} />
                <SidedRow label="Afundo" left={a.lungeLeft} right={a.lungeRight} />
                <SidedRow label="Step Down" left={a.stepDownLeft} right={a.stepDownRight} />
                <SidedRow label="Mobilidade Tornozelo" left={a.ankleMobilityLeft} right={a.ankleMobilityRight} />
                <SidedRow label="Posterior de Coxa" left={a.posteriorThighLeft} right={a.posteriorThighRight} />
                <Row label="Ponte Bilateral" value={a.bilateralBridge} />
                <SidedRow label="Ponte Unilateral" left={a.unilateralBridgeLeft} right={a.unilateralBridgeRight} />
                <SidedRow label="Rot. Interna Quadril (°)" left={a.hipInternalRotLeft} right={a.hipInternalRotRight} />
                <SidedRow label="Rot. Externa Quadril (°)" left={a.hipExternalRotLeft} right={a.hipExternalRotRight} />
                <Row label="Prancha Isométrica" value={a.isometricPlank} />
                <Row label="Flexão" value={a.pushUp} />
                <Row label="Barra" value={a.pullUp} />
                <Row label="Compr. da Perna (cm)" value={a.legLengthCm} />
                <Row label="Compr. 90°" value={a.legLength90} />
                <SidedRow label="Isquiotibiais 110°" left={a.hamstrings110Left} right={a.hamstrings110Right} />
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
