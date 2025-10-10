import { NextResponse } from "next/server"
export const runtime = 'nodejs'
import { fetchQuestionBank } from "@/lib/github"
import { parseQuestions } from "@/lib/parsers"

export async function GET(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  try {
    const { moduleId } = await params
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId') ?? undefined

    const markdown = await fetchQuestionBank(moduleId, courseId)
    const parseResult = parseQuestions(markdown)
    const questions = parseResult.data

    if (questions.length === 0) {
      return NextResponse.json({ error: "No valid questions found in this module" }, { status: 404 })
    }

    const questionsWithIndex = questions.map((q, idx) => ({
      ...q,
      index: q.index ?? idx + 1,
    }))

    return NextResponse.json({
      questions: questionsWithIndex,
      errors: parseResult.errors, // Include parsing errors for debugging
    })
  } catch (error) {
    // We can't access params here; error logging kept generic
    console.error(`Failed to fetch quiz data:`, error)
    return NextResponse.json({ error: "Failed to fetch quiz data" }, { status: 500 })
  }
}
