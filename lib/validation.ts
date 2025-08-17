import type { Question, Flashcard } from "@/types/quiz"
import type { ParseError } from "@/lib/parsers"

export interface ValidationResult {
  isValid: boolean
  errors: ParseError[]
  warnings: ParseError[]
}

export function validateQuizContent(questions: Question[]): ValidationResult {
  const errors: ParseError[] = []
  const warnings: ParseError[] = []

  if (questions.length === 0) {
    errors.push({
      type: "question",
      index: -1,
      message: "No questions found in the quiz",
    })
    return { isValid: false, errors, warnings }
  }

  // Check difficulty distribution
  const difficultyCount = { E: 0, M: 0, H: 0 }
  questions.forEach((q) => difficultyCount[q.difficulty]++)

  if (difficultyCount.E === 0 && difficultyCount.M === 0 && difficultyCount.H === 0) {
    warnings.push({
      type: "question",
      index: -1,
      message: "No difficulty levels found",
    })
  }

  // Check question type distribution
  const typeCount = { SA: 0, MS: 0 }
  questions.forEach((q) => typeCount[q.qtype]++)

  if (typeCount.SA === 0 && typeCount.MS === 0) {
    errors.push({
      type: "question",
      index: -1,
      message: "No valid question types found",
    })
  }

  // Validate individual questions
  questions.forEach((question, index) => {
    // Check explanation quality
    if (question.explanation.length < 20) {
      warnings.push({
        type: "question",
        index,
        message: `Question ${question.index}: Explanation might be too brief`,
      })
    }

    // Check for common explanation patterns
    if (
      !question.explanation.toLowerCase().includes("correct") &&
      !question.explanation.toLowerCase().includes("wrong")
    ) {
      warnings.push({
        type: "question",
        index,
        message: `Question ${question.index}: Explanation doesn't clearly indicate why answers are correct/incorrect`,
      })
    }

    // Validate multi-select consistency
    if (question.qtype === "MS" && question.chooseN && question.answer.length !== question.chooseN) {
      errors.push({
        type: "question",
        index,
        message: `Question ${question.index}: Answer count (${question.answer.length}) doesn't match chooseN (${question.chooseN})`,
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateFlashcardContent(flashcards: Flashcard[]): ValidationResult {
  const errors: ParseError[] = []
  const warnings: ParseError[] = []

  if (flashcards.length === 0) {
    errors.push({
      type: "flashcard",
      index: -1,
      message: "No flashcards found",
    })
    return { isValid: false, errors, warnings }
  }

  // Validate individual flashcards
  flashcards.forEach((flashcard, index) => {
    // Check question quality
    if (flashcard.question.length < 10) {
      warnings.push({
        type: "flashcard",
        index,
        message: `Flashcard ${index + 1}: Question might be too brief`,
      })
    }

    // Check answer quality
    flashcard.answers.forEach((answer, answerIndex) => {
      if (answer.length < 5) {
        warnings.push({
          type: "flashcard",
          index,
          message: `Flashcard ${index + 1}, Answer ${answerIndex + 1}: Answer might be too brief`,
        })
      }
    })

    // Check for multi-answer flashcards
    if (flashcard.answers.length > 1) {
      if (
        !flashcard.question.toLowerCase().includes("choose") &&
        !flashcard.question.includes("2") &&
        !flashcard.question.includes("3")
      ) {
        warnings.push({
          type: "flashcard",
          index,
          message: `Flashcard ${index + 1}: Multiple answers found but question doesn't indicate multi-answer format`,
        })
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
