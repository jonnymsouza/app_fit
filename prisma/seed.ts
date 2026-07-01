import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const exercises = [
  // Empurrada Horizontal
  { actionType: "Empurrada Horizontal", name: "Supino Reto", equipment: "Barra", muscleGroup: "Peito" },
  { actionType: "Empurrada Horizontal", name: "Supino Inclinado Haltere", equipment: "Haltere", muscleGroup: "Peito" },
  { actionType: "Empurrada Horizontal", name: "Supino Declinado Haltere", equipment: "Haltere", muscleGroup: "Peito" },
  { actionType: "Empurrada Horizontal", name: "Crucifixo Haltere", equipment: "Haltere", muscleGroup: "Peito" },
  { actionType: "Empurrada Horizontal", name: "Flexão de Braço", equipment: "Peso Corporal", muscleGroup: "Peito" },
  { actionType: "Empurrada Horizontal", name: "Flexão Arqueiro", equipment: "Peso Corporal", muscleGroup: "Peito" },
  { actionType: "Empurrada Horizontal", name: "Flexão com Haltere", equipment: "Haltere", muscleGroup: "Peito" },

  // Empurrada Vertical
  { actionType: "Empurrada Vertical", name: "Desenvolvimento Haltere", equipment: "Haltere", muscleGroup: "Ombro" },
  { actionType: "Empurrada Vertical", name: "Desenvolvimento com Barra", equipment: "Barra", muscleGroup: "Ombro" },
  { actionType: "Empurrada Vertical", name: "Desenvolvimento Arnold", equipment: "Haltere", muscleGroup: "Ombro" },
  { actionType: "Empurrada Vertical", name: "Elevação Lateral", equipment: "Haltere", muscleGroup: "Ombro" },
  { actionType: "Empurrada Vertical", name: "Press Militar", equipment: "Barra", muscleGroup: "Ombro" },

  // Puxada Vertical
  { actionType: "Puxada Vertical", name: "Puxada Frontal", equipment: "Cabo/Máquina", muscleGroup: "Costas" },
  { actionType: "Puxada Vertical", name: "Barra Fixa", equipment: "Peso Corporal", muscleGroup: "Costas" },
  { actionType: "Puxada Vertical", name: "Barra Fixa Supinada", equipment: "Peso Corporal", muscleGroup: "Costas" },
  { actionType: "Puxada Vertical", name: "Puxada Neutra", equipment: "Cabo/Máquina", muscleGroup: "Costas" },
  { actionType: "Puxada Vertical", name: "Puxada com Elástico", equipment: "Elástico", muscleGroup: "Costas" },

  // Puxada Horizontal
  { actionType: "Puxada Horizontal", name: "Remada Curvada", equipment: "Barra", muscleGroup: "Costas" },
  { actionType: "Puxada Horizontal", name: "Remada Haltere", equipment: "Haltere", muscleGroup: "Costas" },
  { actionType: "Puxada Horizontal", name: "Remada Cabo", equipment: "Cabo/Máquina", muscleGroup: "Costas" },
  { actionType: "Puxada Horizontal", name: "Remada Máquina", equipment: "Máquina", muscleGroup: "Costas" },
  { actionType: "Puxada Horizontal", name: "Remada KB", equipment: "Kettlebell", muscleGroup: "Costas" },

  // Joelho
  { actionType: "Joelho", name: "Agachamento Livre", equipment: "Barra", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Leg Press", equipment: "Máquina", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Afundo", equipment: "Haltere", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Passada", equipment: "Peso Corporal/Haltere", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Agachamento Goblet", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Agachamento Com Aux. TRX", equipment: "TRX", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Agachamento Com Halter", equipment: "Haltere", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Agachamento Frontal", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Back Squat", equipment: "Barra", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Zercher Squat", equipment: "Barra", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Agachamento Sumo", equipment: "Haltere", muscleGroup: "Quadríceps/Glúteo/Adutores" },
  { actionType: "Joelho", name: "Agachamento Overhead", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Overhead Squat", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Agachamento Isométrico", equipment: "Peso Corporal", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Senta e Levanta", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Livre", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo KB Contralateral", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo KB Ipsilateral", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo com 1 Step Frontal", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo com 1 Step Atrás", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Suspenso", equipment: "Banco", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo One Hack", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Afundo Double Hack", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Afundo Overhead", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Afundo Pegada Goblet", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo 2 KB", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Pliométrico", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Salto Lateral", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Suspenso TRX", equipment: "TRX", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Bosu", equipment: "Bosu", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Recuo", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Recuo Pegada Goblet", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Recuo Double Hack", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Recuo One Hack", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Recuo 2 KB", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Avanço", equipment: "Peso Corporal", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Avanço 2 KB", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Avanço Overhead", equipment: "Kettlebell", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo com Barra Frontal", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Afundo com Barra Costas", equipment: "Barra", muscleGroup: "Quadríceps/Glúteo" },
  { actionType: "Joelho", name: "Afundo Isométrico", equipment: "Peso Corporal", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Agachamento One Hack", equipment: "Barra", muscleGroup: "Quadríceps" },
  { actionType: "Joelho", name: "Agachamento Double Hack", equipment: "Barra", muscleGroup: "Quadríceps" },

  // Quadril
  { actionType: "Quadril", name: "Levantamento Terra", equipment: "Barra", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Stiff", equipment: "Barra", muscleGroup: "Posterior" },
  { actionType: "Quadril", name: "Elevação Pélvica Unilateral", equipment: "Banco", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Hip Thrust", equipment: "Barra/Banco", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Ponte", equipment: "Peso Corporal", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Ponte Unilateral", equipment: "Peso Corporal", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Hip Hinge", equipment: "Peso Corporal", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Hip Hinge com Elástico", equipment: "Elástico", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Hip Hinge Base Assimétrica", equipment: "Peso Corporal", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Ponte Feijão", equipment: "Peso Corporal", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Ponte Feijão Unilateral", equipment: "Peso Corporal", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Ponte na Bola", equipment: "Bola", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Ponte Uni Bola", equipment: "Bola", muscleGroup: "Glúteo" },
  { actionType: "Quadril", name: "Flexor Feijão Bilateral", equipment: "Peso Corporal", muscleGroup: "Posterior" },
  { actionType: "Quadril", name: "Flexor Feijão Unilateral", equipment: "Peso Corporal", muscleGroup: "Posterior" },
  { actionType: "Quadril", name: "Flexor Bola Bilateral", equipment: "Bola", muscleGroup: "Posterior" },
  { actionType: "Quadril", name: "Flexor Slide Bilateral", equipment: "Slider", muscleGroup: "Posterior" },
  { actionType: "Quadril", name: "Flexor Slide Unilateral", equipment: "Slider", muscleGroup: "Posterior" },
  { actionType: "Quadril", name: "Mesa Chinesa", equipment: "Peso Corporal", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Terra Educativo", equipment: "Barra", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Terra KB", equipment: "Kettlebell", muscleGroup: "Posterior/Glúteo" },
  { actionType: "Quadril", name: "Good Morning", equipment: "Barra", muscleGroup: "Posterior" },

  // Core - Antirrotação
  { actionType: "Core - Antirrotação", name: "Pallof Press", equipment: "Cabo", muscleGroup: "Core" },
  { actionType: "Core - Antirrotação", name: "Cabo Rotação", equipment: "Cabo", muscleGroup: "Core" },
  { actionType: "Core - Antirrotação", name: "Pallof Press com Elástico", equipment: "Elástico", muscleGroup: "Core" },

  // Core - Anti-hiperextensão
  { actionType: "Core - Anti-hiperextensão", name: "Prancha", equipment: "Peso Corporal", muscleGroup: "Core" },
  { actionType: "Core - Anti-hiperextensão", name: "Dead Bug", equipment: "Peso Corporal", muscleGroup: "Core" },
  { actionType: "Core - Anti-hiperextensão", name: "Prancha com Apoio Alternado", equipment: "Peso Corporal", muscleGroup: "Core" },
  { actionType: "Core - Anti-hiperextensão", name: "Hollow Body", equipment: "Peso Corporal", muscleGroup: "Core" },
  { actionType: "Core - Anti-hiperextensão", name: "Rollout Ab Wheel", equipment: "Roda Abdominal", muscleGroup: "Core" },

  // Core - Antiflexão Lateral
  { actionType: "Core - Antiflexão Lateral", name: "Prancha Lateral", equipment: "Peso Corporal", muscleGroup: "Core" },
  { actionType: "Core - Antiflexão Lateral", name: "Farmer Walk Unilateral", equipment: "Haltere", muscleGroup: "Core" },
  { actionType: "Core - Antiflexão Lateral", name: "Suitcase Carry", equipment: "Kettlebell", muscleGroup: "Core" },
  { actionType: "Core - Antiflexão Lateral", name: "Prancha Lateral com Elevação", equipment: "Peso Corporal", muscleGroup: "Core" },
]

async function main() {
  console.log("Seeding exercises...")

  await prisma.exercise.deleteMany({ where: { isSystem: true } })

  await prisma.exercise.createMany({
    data: exercises.map((ex) => ({ ...ex, isSystem: true })),
  })

  console.log(`✓ ${exercises.length} exercises seeded`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
