import type { Module, Question, Flashcard } from "@/types/quiz"

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return ''
  }
  // Prefer explicit site URL if provided
  const explicit = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  }
  // Assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

// Simple localStorage cache with stale-while-revalidate semantics for client
const cacheGet = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const cacheSet = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify({ value, ts: Date.now() }))
  } catch {
    // ignore
  }
}

const fromCached = <T,>(key: string, maxAgeMs: number): T | null => {
  const cached = cacheGet<{ value: T; ts: number }>(key)
  if (!cached) return null
  if (Date.now() - cached.ts > maxAgeMs) return cached.value // return stale
  return cached.value
}

export async function getModules(courseId?: string): Promise<Module[]> {
  const suffix = courseId ? `:${courseId}` : ''
  const cacheKey = `modules:list${suffix}`
  const stale = fromCached<Module[]>(cacheKey, 6 * 60 * 60 * 1000) // 6h

  try {
    const url = new URL(`${getBaseUrl()}/api/modules`, 'http://dummy')
    // Workaround to build URL; we'll strip origin if running in browser
    if (courseId) url.searchParams.set('courseId', courseId)
    const href = typeof window !== 'undefined' ? `${url.pathname}${url.search}` : `${getBaseUrl()}${url.pathname}${url.search}`
    const response = await fetch(href, { cache: 'no-store' })
    if (!response.ok) throw new Error("Failed to fetch modules")
    const data = await response.json()
    const modules: Module[] = data.modules ?? []
    cacheSet(cacheKey, modules)
    return modules
  } catch (e) {
    if (stale) return stale
    throw e
  }
}

export async function getQuizQuestions(moduleId: string, courseId?: string): Promise<Question[]> {
  const suffix = courseId ? `:${courseId}` : ''
  const cacheKey = `quiz:${moduleId}${suffix}`
  const stale = fromCached<Question[]>(cacheKey, 12 * 60 * 60 * 1000) // 12h
  try {
    const url = new URL(`${getBaseUrl()}/api/quiz/${moduleId}`, 'http://dummy')
    if (courseId) url.searchParams.set('courseId', courseId)
    const href = typeof window !== 'undefined' ? `${url.pathname}${url.search}` : `${getBaseUrl()}${url.pathname}${url.search}`
    const response = await fetch(href, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Failed to fetch quiz for module ${moduleId}`)
    const data = await response.json()
    const questions: Question[] = data.questions ?? []
    cacheSet(cacheKey, questions)
    return questions
  } catch (e) {
    if (stale && Array.isArray(stale) && stale.length > 0) return stale
    throw e
  }
}

export async function getFlashcards(moduleId: string, courseId?: string): Promise<Flashcard[]> {
  const suffix = courseId ? `:${courseId}` : ''
  const cacheKey = `flashcards:${moduleId}${suffix}`
  const stale = fromCached<Flashcard[]>(cacheKey, 12 * 60 * 60 * 1000) // 12h
  try {
    const url = new URL(`${getBaseUrl()}/api/flashcards/${moduleId}`, 'http://dummy')
    if (courseId) url.searchParams.set('courseId', courseId)
    const href = typeof window !== 'undefined' ? `${url.pathname}${url.search}` : `${getBaseUrl()}${url.pathname}${url.search}`
    const response = await fetch(href, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Failed to fetch flashcards for module ${moduleId}`)
    const data = await response.json()
    const flashcards: Flashcard[] = data.flashcards ?? []
    cacheSet(cacheKey, flashcards)
    return flashcards
  } catch (e) {
    if (stale && Array.isArray(stale) && stale.length > 0) return stale
    throw e
  }
}
