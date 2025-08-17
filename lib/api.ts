import type { Module, Question, Flashcard } from "@/types/quiz"

export async function getModules(): Promise<Module[]> {
  const response = await fetch("/api/modules")

  if (!response.ok) {
    throw new Error("Failed to fetch modules")
  }

  const data = await response.json()
  return data.modules
}

export async function getQuizQuestions(moduleId: string): Promise<Question[]> {
  const response = await fetch(`/api/quiz/${moduleId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz for module ${moduleId}`)
  }

  const data = await response.json()
  return data.questions
}

export async function getFlashcards(moduleId: string): Promise<Flashcard[]> {
  const response = await fetch(`/api/flashcards/${moduleId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch flashcards for module ${moduleId}`)
  }

  const data = await response.json()
  return data.flashcards
}
