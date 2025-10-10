import { headers } from "next/headers"
import type { Module, Question, Flashcard } from "@/types/quiz"

async function getServerBaseUrl() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https")
  if (!host) return ""
  return `${proto}://${host}`
}

export async function serverGetModules(courseId?: string): Promise<Module[]> {
  const base = await getServerBaseUrl()
  const url = new URL(`${base}/api/modules`)
  if (courseId) url.searchParams.set('courseId', courseId)
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch modules")
  const data = await res.json()
  return (data.modules ?? []) as Module[]
}

export async function serverGetQuizQuestions(moduleId: string, courseId?: string): Promise<Question[]> {
  const base = await getServerBaseUrl()
  const url = new URL(`${base}/api/quiz/${moduleId}`)
  if (courseId) url.searchParams.set('courseId', courseId)
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch quiz for module ${moduleId}`)
  const data = await res.json()
  return (data.questions ?? []) as Question[]
}

export async function serverGetFlashcards(moduleId: string, courseId?: string): Promise<Flashcard[]> {
  const base = await getServerBaseUrl()
  const url = new URL(`${base}/api/flashcards/${moduleId}`)
  if (courseId) url.searchParams.set('courseId', courseId)
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch flashcards for module ${moduleId}`)
  const data = await res.json()
  return (data.flashcards ?? []) as Flashcard[]
}
