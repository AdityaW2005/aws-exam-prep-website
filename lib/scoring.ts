import type { Question, QuizResultSummary, QuizResultDetail, OptionKey } from "@/types/quiz"

export function scoreQuiz(
  questions: Question[],
  responses: Record<number, OptionKey[]>,
  questionStartTimes: number[],
  totalStartTime: number,
): QuizResultSummary {
  const details: QuizResultDetail[] = []
  let correctCount = 0
  let wrongCount = 0
  let unansweredCount = 0

  const endTime = Date.now()
  const timeTotalSec = Math.round((endTime - totalStartTime) / 1000)
  const timePerQuestionSec = questionStartTimes.map((startTime, index) => {
    const nextStartTime = questionStartTimes[index + 1] || endTime
    return Math.round((nextStartTime - startTime) / 1000)
  })

  questions.forEach((question, index) => {
    const selected = responses[question.index] || []
    const correctAnswer = question.answer

    let correct = false

    if (selected.length === 0) {
      unansweredCount++
    } else {
      // Check if selected answers match exactly
      const selectedSorted = [...selected].sort()
      const correctSorted = [...correctAnswer].sort()
      correct =
        selectedSorted.length === correctSorted.length && selectedSorted.every((val, i) => val === correctSorted[i])

      if (correct) {
        correctCount++
      } else {
        wrongCount++
      }
    }

    details.push({
      index: question.index,
      correct,
      selected,
      correctAnswer,
      explanation: question.explanation,
    })
  })

  const total = questions.length
  const score = correctCount
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  return {
    score,
    total,
    correctCount,
    wrongCount,
    unansweredCount,
    percentage,
    timeTotalSec,
    timePerQuestionSec,
    details,
  }
}
