import type { Question, Flashcard, Difficulty, QType, OptionKey } from "@/types/quiz"

export interface ParseError {
  type: "question" | "flashcard"
  index: number
  message: string
  block?: string
}

export interface ParseResult<T> {
  data: T[]
  errors: ParseError[]
}

export function parseQuestions(markdown: string): ParseResult<Question> {
  const questions: Question[] = []
  const errors: ParseError[] = []

  // Normalize line endings and clean up the markdown
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  // Split by question numbers (1., 2., etc. at start of line)
  const questionBlocks = normalizedMarkdown
    .split(/(?=^\d+\.\s)/m)
    .filter((block) => block.trim())
    .filter((block) => /^\d+\./.test(block.trim()))

  for (let i = 0; i < questionBlocks.length; i++) {
    try {
      const question = parseQuestionBlock(questionBlocks[i].trim(), i)
      if (question) {
        // Validate question numbering order
        if (questions.length > 0 && question.index !== questions[questions.length - 1].index + 1) {
          errors.push({
            type: "question",
            index: i,
            message: `Question numbering out of order. Expected ${questions.length + 1}, got ${question.index}`,
            block: questionBlocks[i].substring(0, 100) + "...",
          })
        }
        questions.push(question)
      }
    } catch (error) {
      errors.push({
        type: "question",
        index: i,
        message: error instanceof Error ? error.message : "Unknown parsing error",
        block: questionBlocks[i].substring(0, 100) + "...",
      })
    }
  }

  return { data: questions, errors }
}

function parseQuestionBlock(block: string, blockIndex: number): Question | null {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)

  if (lines.length === 0) return null

  // Parse first line: "1. [E][SA] Question text"
  const firstLineMatch = lines[0].match(/^(\d+)\.\s*\[([EMH])\]\[([SM][SA])\]\s*(.+)$/)
  if (!firstLineMatch) {
    throw new Error(`Invalid question format in first line: "${lines[0]}"`)
  }

  const [, indexStr, difficulty, qtype, questionText] = firstLineMatch
  const index = Number.parseInt(indexStr)

  // Validate difficulty and question type
  if (!["E", "M", "H"].includes(difficulty)) {
    throw new Error(`Invalid difficulty level: ${difficulty}. Must be E, M, or H`)
  }

  if (!["SA", "MS"].includes(qtype)) {
    throw new Error(`Invalid question type: ${qtype}. Must be SA or MS`)
  }

  // Extract chooseN from question text if present
  const chooseMatch = questionText.match(/$$Choose (\d+)$$/i)
  const chooseN = chooseMatch ? Number.parseInt(chooseMatch[1]) : undefined

  // Validate chooseN for multi-select questions
  if (qtype === "MS" && chooseN && (chooseN < 2 || chooseN > 4)) {
    throw new Error(`Invalid chooseN value: ${chooseN}. Must be between 2 and 4 for multi-select questions`)
  }

  // Parse options A-D
  const options: Record<OptionKey, string> = {} as Record<OptionKey, string>
  let optionEndIndex = 1
  const expectedOptions = ["A", "B", "C", "D"]

  for (let i = 1; i < lines.length; i++) {
    const optionMatch = lines[i].match(/^([ABCD])\.\s*(.+)$/)
    if (optionMatch) {
      const [, letter, text] = optionMatch
      if (!text.trim()) {
        throw new Error(`Empty option text for option ${letter}`)
      }
      options[letter as OptionKey] = text.trim()
      optionEndIndex = i + 1
    } else {
      break
    }
  }

  // Validate we have all options A-D in order
  for (const expectedOption of expectedOptions) {
    if (!options[expectedOption as OptionKey]) {
      throw new Error(`Missing required option ${expectedOption}`)
    }
  }

  // Find Answer line
  let answerLine = ""
  let explanationStartIndex = -1

  for (let i = optionEndIndex; i < lines.length; i++) {
    if (lines[i].startsWith("Answer:")) {
      answerLine = lines[i]
      explanationStartIndex = i + 1
      break
    }
  }

  if (!answerLine) {
    throw new Error("Answer line not found")
  }

  // Parse answer with better validation
  const answerText = answerLine.replace("Answer:", "").trim()
  const answerLetters = answerText
    .split(/[,\s]+/)
    .map((letter) => letter.trim().toUpperCase())
    .filter((letter) => letter.match(/^[ABCD]$/))

  if (answerLetters.length === 0) {
    throw new Error(`No valid answer letters found in: "${answerText}"`)
  }

  // Validate answer consistency with question type
  if (qtype === "SA" && answerLetters.length > 1) {
    throw new Error(`Single answer question cannot have multiple answers: ${answerLetters.join(", ")}`)
  }

  if (qtype === "MS" && answerLetters.length === 1) {
    throw new Error(`Multi-select question must have multiple answers, got: ${answerLetters[0]}`)
  }

  if (chooseN && answerLetters.length !== chooseN) {
    throw new Error(`Answer count (${answerLetters.length}) doesn't match chooseN (${chooseN})`)
  }

  // Remove duplicates and sort
  const uniqueAnswers = [...new Set(answerLetters)].sort()

  // Find Explanation
  let explanation = ""
  for (let i = explanationStartIndex; i < lines.length; i++) {
    if (lines[i].startsWith("Explanation:")) {
      explanation = lines.slice(i).join(" ").replace("Explanation:", "").trim()
      break
    }
  }

  if (!explanation) {
    throw new Error("Explanation not found")
  }

  if (explanation.length < 10) {
    throw new Error("Explanation too short (minimum 10 characters)")
  }

  return {
    index,
    difficulty: difficulty as Difficulty,
    qtype: qtype as QType,
    text: questionText.trim(),
    options,
    answer: uniqueAnswers as OptionKey[],
    explanation,
    chooseN,
  }
}

export function parseFlashcards(markdown: string): ParseResult<Flashcard> {
  const flashcards: Flashcard[] = []
  const errors: ParseError[] = []

  // Normalize line endings
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  // Split by ### headers
  const cardBlocks = normalizedMarkdown
    .split(/(?=^###\s)/m)
    .filter((block) => block.trim())
    .filter((block) => /^###/.test(block.trim()))

  for (let i = 0; i < cardBlocks.length; i++) {
    try {
      const flashcard = parseFlashcardBlock(cardBlocks[i].trim(), i)
      if (flashcard) {
        flashcards.push(flashcard)
      }
    } catch (error) {
      errors.push({
        type: "flashcard",
        index: i,
        message: error instanceof Error ? error.message : "Unknown parsing error",
        block: cardBlocks[i].substring(0, 100) + "...",
      })
    }
  }

  return { data: flashcards, errors }
}

function parseFlashcardBlock(block: string, index: number): Flashcard | null {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)

  if (lines.length === 0) return null

  // Parse header: "### Q1: Question text" or "### Q1: (Choose 2) Question text"
  const headerMatch = lines[0].match(/^###\s*Q\d+:\s*(.+)$/)
  if (!headerMatch) {
    throw new Error(`Invalid flashcard header format: "${lines[0]}"`)
  }

  const question = headerMatch[1].trim()

  if (!question) {
    throw new Error("Empty question text")
  }

  // Parse answers (lines starting with "A:")
  const answers: string[] = []
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith("A:")) {
      const answerText = lines[i].replace("A:", "").trim()
      if (!answerText) {
        throw new Error(`Empty answer text on line ${i + 1}`)
      }
      answers.push(answerText)
    }
  }

  if (answers.length === 0) {
    throw new Error("No answers found")
  }

  // Validate answer length
  for (const answer of answers) {
    if (answer.length < 3) {
      throw new Error(`Answer too short: "${answer}" (minimum 3 characters)`)
    }
  }

  return {
    id: `flashcard-${index + 1}`,
    question,
    answers,
  }
}

// Utility function to validate parsed content
export function validateQuestions(questions: Question[]): ParseError[] {
  const errors: ParseError[] = []

  // Check for duplicate question indices
  const indices = questions.map((q) => q.index)
  const duplicates = indices.filter((index, i) => indices.indexOf(index) !== i)

  if (duplicates.length > 0) {
    errors.push({
      type: "question",
      index: -1,
      message: `Duplicate question indices found: ${duplicates.join(", ")}`,
    })
  }

  // Check for sequential numbering
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].index !== i + 1) {
      errors.push({
        type: "question",
        index: i,
        message: `Question numbering gap: expected ${i + 1}, got ${questions[i].index}`,
      })
    }
  }

  return errors
}

export function validateFlashcards(flashcards: Flashcard[]): ParseError[] {
  const errors: ParseError[] = []

  // Check for duplicate IDs
  const ids = flashcards.map((f) => f.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)

  if (duplicates.length > 0) {
    errors.push({
      type: "flashcard",
      index: -1,
      message: `Duplicate flashcard IDs found: ${duplicates.join(", ")}`,
    })
  }

  return errors
}
