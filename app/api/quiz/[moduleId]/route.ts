import { NextResponse } from "next/server"
import { fetchQuestionBank } from "@/lib/github"
import { parseQuestions } from "@/lib/parsers"

export async function GET(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const { moduleId } = params

    const markdown = await fetchQuestionBank(moduleId)
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
    console.error(`Failed to fetch quiz for module ${params.moduleId}:`, error)
    return NextResponse.json({ error: "Failed to fetch quiz data" }, { status: 500 })
  }
}
