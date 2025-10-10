import { NextResponse } from "next/server"
export const runtime = 'nodejs'
import { fetchFlashcards } from "@/lib/github"
import { parseFlashcards } from "@/lib/parsers"

export async function GET(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  try {
    const { moduleId } = await params
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId') ?? undefined

    const markdown = await fetchFlashcards(moduleId, courseId)
    const parseResult = parseFlashcards(markdown)
    const flashcards = parseResult.data

    if (flashcards.length === 0) {
      return NextResponse.json({ error: "No valid flashcards found in this module" }, { status: 404 })
    }

    return NextResponse.json({
      flashcards,
      errors: parseResult.errors, // Include parsing errors for debugging
    })
  } catch (error) {
    console.error(`Failed to fetch flashcards data:`, error)
    return NextResponse.json({ error: "Failed to fetch flashcards data" }, { status: 500 })
  }
}
