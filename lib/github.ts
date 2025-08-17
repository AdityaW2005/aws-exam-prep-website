const GITHUB_BASE_URL = "https://raw.githubusercontent.com/AdityaW2005/aws-modules-qb/main"

export async function fetchQuestionBank(moduleId: string): Promise<string> {
  const url = `${GITHUB_BASE_URL}/question_banks/aws_${moduleId}_qb.md`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch question bank for module ${moduleId}: ${response.statusText}`)
  }

  return response.text()
}

export async function fetchFlashcards(moduleId: string): Promise<string> {
  const url = `${GITHUB_BASE_URL}/flashcards/aws_${moduleId}_fc.md`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch flashcards for module ${moduleId}: ${response.statusText}`)
  }

  return response.text()
}

export async function discoverModules(): Promise<string[]> {
  const modules: string[] = []

  // Try to discover modules by attempting to fetch m1, m2, etc.
  for (let i = 1; i <= 20; i++) {
    const moduleId = `m${i}`
    try {
      await fetchQuestionBank(moduleId)
      modules.push(moduleId)
    } catch {
      // Module doesn't exist, continue checking
      continue
    }
  }

  return modules
}
