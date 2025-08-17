import { NextResponse } from "next/server"
export const runtime = 'nodejs'
import { discoverModules } from "@/lib/github"
import type { Module } from "@/types/quiz"

export async function GET() {
  try {
    const moduleIds = await discoverModules()

    const modules: Module[] = await Promise.all(
      moduleIds.map(async (id) => {
        // Check if flashcards exist for this module
        let hasFlashcards = false
        try {
          const response = await fetch(
            `https://raw.githubusercontent.com/AdityaW2005/aws-modules-qb/main/flashcards/aws_${id}_fc.md`,
            { method: 'HEAD', cache: 'no-store' }
          )
          hasFlashcards = response.ok
        } catch {
          hasFlashcards = false
        }

        return {
          id,
          name: `Module ${id.toUpperCase()}`,
          hasQuestions: true, // We know this is true since discoverModules found it
          hasFlashcards,
        }
      }),
    )

    return NextResponse.json({ modules })
  } catch (error) {
  console.error("Failed to discover modules:", error)
  return NextResponse.json({ error: "Failed to discover modules", details: String(error) }, { status: 500 })
  }
}
