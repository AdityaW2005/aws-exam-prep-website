export type Difficulty = "E" | "M" | "H"
export type QType = "SA" | "MS"
export type OptionKey = "A" | "B" | "C" | "D"

export interface Question {
  index: number
  difficulty: Difficulty
  qtype: QType
  text: string
  options: Record<OptionKey, string>
  answer: OptionKey[] // single for SA, multiple for MS
  explanation: string
  chooseN?: number // for MS if specified in text: "Choose 2" or "Choose 3"
}

export interface QuizResultDetail {
  index: number
  correct: boolean
  selected: OptionKey[]
  correctAnswer: OptionKey[]
  explanation: string
}

export interface QuizResultSummary {
  score: number
  total: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
  percentage: number
  timeTotalSec: number
  timePerQuestionSec: number[]
  details: QuizResultDetail[]
}

export interface Flashcard {
  id: string
  question: string
  answers: string[] // one or multiple lines starting with "A:"
}

export interface Module {
  id: string
  name: string
  hasQuestions: boolean
  hasFlashcards: boolean
}

export interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  responses: Record<number, OptionKey[]>
  startTime: number
  questionStartTimes: number[]
  isSubmitted: boolean
}
