const GITHUB_BASE_URL = process.env.GITHUB_RAW_BASE_URL?.replace(/\/$/, '') ||
  "https://raw.githubusercontent.com/AdityaW2005/aws-modules-qb/main"

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
  // Use HEAD requests with small concurrency to avoid timeouts in serverless
  const exists = async (url: string) => {
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
      return res.ok
    } catch {
      return false
    }
  }

  const maxToCheck = 20
  const concurrency = 5
  const queue: Promise<void>[] = []
  const found: string[] = []

  let active = 0
  async function run(task: () => Promise<void>) {
    active++
    try {
      await task()
    } finally {
      active--
    }
  }

  const schedule = (task: () => Promise<void>) => {
    const p = (async () => {
      while (active >= concurrency) {
        await new Promise((r) => setTimeout(r, 10))
      }
      await run(task)
    })()
    queue.push(p)
  }

  for (let i = 1; i <= maxToCheck; i++) {
    const moduleId = `m${i}`
    const url = `${GITHUB_BASE_URL}/question_banks/aws_${moduleId}_qb.md`
    schedule(async () => {
      if (await exists(url)) {
        found.push(moduleId)
      }
    })
  }

  await Promise.all(queue)
  // Ensure deterministic ordering
  return found.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
}
