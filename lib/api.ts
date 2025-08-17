import type { Module, Question, Flashcard } from "@/types/quiz"

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return ''
  }
  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  }
  // Assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export async function getModules(): Promise<Module[]> {
  const response = await fetch(`${getBaseUrl()}/api/modules`)

  if (!response.ok) {
    throw new Error("Failed to fetch modules")
  }

  const data = await response.json()
  return data.modules
}

export async function getQuizQuestions(moduleId: string): Promise<Question[]> {
  const response = await fetch(`${getBaseUrl()}/api/quiz/${moduleId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz for module ${moduleId}`)
  }

  const data = await response.json()
  return data.questions
}

export async function getFlashcards(moduleId: string): Promise<Flashcard[]> {
  const response = await fetch(`${getBaseUrl()}/api/flashcards/${moduleId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch flashcards for module ${moduleId}`)
  }

  const data = await response.json()
  return data.flashcards
}
