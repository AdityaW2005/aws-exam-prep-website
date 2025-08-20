"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle2, AlertCircle, Home, RefreshCw, Send, ChevronLeft, ChevronRight, Eye, EyeOff, Bug } from "lucide-react"
import Link from "next/link"
import { getQuizQuestions } from "@/lib/api"
import { scoreQuiz } from "@/lib/scoring"
import type { Question, QuizState, OptionKey } from "@/types/quiz"

interface QuizPageProps {
  params: Promise<{ moduleId: string }>
}

export default function QuizPage({ params }: QuizPageProps) {
  const { moduleId } = React.use(params)
  const router = useRouter()
  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true)
  const questions = await getQuizQuestions(moduleId)

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
          throw new Error("No questions found for this module")
        }

        const validatedQuestions = questions.map((q, idx) => ({
          ...q,
          index: q.index ?? idx + 1,
        }))

        const now = Date.now()
        setQuizState({
          questions: validatedQuestions,
          currentQuestionIndex: 0,
          responses: {},
          startTime: now,
          questionStartTimes: [now],
          isSubmitted: false,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [moduleId])

  // Timer effect
  useEffect(() => {
    if (!quizState || quizState.isSubmitted) return

    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [quizState])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (!quizState || quizState.isSubmitted) return

      const currentQuestion = quizState.questions[quizState.currentQuestionIndex]

      // Number keys for option selection
      if (["1", "2", "3", "4"].includes(event.key)) {
        const optionKey = ["A", "B", "C", "D"][Number.parseInt(event.key) - 1] as OptionKey
        handleOptionSelect(optionKey)
        return
      }

      // Navigation keys
      switch (event.key.toLowerCase()) {
        case "arrowleft":
        case "p":
          event.preventDefault()
          if (quizState.currentQuestionIndex > 0) {
            goToPreviousQuestion()
          }
          break
        case "arrowright":
        case "n":
          event.preventDefault()
          if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
            goToNextQuestion()
          }
          break
        case "s":
          event.preventDefault()
          if (quizState.currentQuestionIndex === quizState.questions.length - 1) {
            handleSubmit()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [quizState])

  const handleOptionSelect = (optionKey: OptionKey) => {
    if (!quizState || quizState.isSubmitted) return

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    const currentResponses = quizState.responses[currentQuestion.index] || []

    let newResponses: OptionKey[]

    if (currentQuestion.qtype === "SA") {
      // Single answer - replace selection
      newResponses = [optionKey]
    } else {
      // Multi-select - toggle selection
      if (currentResponses.includes(optionKey)) {
        newResponses = currentResponses.filter((key) => key !== optionKey)
      } else {
        newResponses = [...currentResponses, optionKey]
        // Limit selections based on chooseN if specified
        if (currentQuestion.chooseN && newResponses.length > currentQuestion.chooseN) {
          newResponses = newResponses.slice(-currentQuestion.chooseN)
        }
      }
    }

    setQuizState({
      ...quizState,
      responses: {
        ...quizState.responses,
        [currentQuestion.index]: newResponses,
      },
    })
  }

  const goToNextQuestion = () => {
    if (!quizState || quizState.currentQuestionIndex >= quizState.questions.length - 1) return

    const newIndex = quizState.currentQuestionIndex + 1
    const now = Date.now()

    setQuizState({
      ...quizState,
      currentQuestionIndex: newIndex,
      questionStartTimes: [...quizState.questionStartTimes, now],
    })
    setShowAnswer(false)
  }

  const goToPreviousQuestion = () => {
    if (!quizState || quizState.currentQuestionIndex <= 0) return

    setQuizState({
      ...quizState,
      currentQuestionIndex: quizState.currentQuestionIndex - 1,
    })
    setShowAnswer(false)
  }

  const handleSubmit = () => {
    if (!quizState) return

    const results = scoreQuiz(
      quizState.questions,
      quizState.responses,
      quizState.questionStartTimes,
      quizState.startTime,
    )

    // Store results in sessionStorage for the results page
    sessionStorage.setItem("quizResults", JSON.stringify(results))
    sessionStorage.setItem("quizQuestions", JSON.stringify(quizState.questions))
    sessionStorage.setItem("quizResponses", JSON.stringify(quizState.responses))

  router.push(`/quiz/${moduleId}/results`)
  }

  if (loading) {
    return <QuizSkeleton />
  }

  if (error) {
  return <QuizError error={error} moduleId={moduleId} />
  }

  if (!quizState || !quizState.questions || quizState.questions.length === 0) {
  return <QuizError error="Quiz data not available" moduleId={moduleId} />
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]

  if (!currentQuestion) {
  return <QuizError error="Current question not found" moduleId={moduleId} />
  }

  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100
  const elapsedTime = Math.floor((currentTime - quizState.startTime) / 1000)
  const currentResponses = quizState.responses[currentQuestion.index] || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="font-semibold">Module {moduleId.toUpperCase()} Quiz</h1>
                <p className="text-sm text-muted-foreground">
                  Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
              </div>
              <Badge
                variant={
                  currentQuestion.difficulty === "E"
                    ? "secondary"
                    : currentQuestion.difficulty === "M"
                      ? "default"
                      : "destructive"
                }
              >
                {currentQuestion.difficulty === "E" ? "Easy" : currentQuestion.difficulty === "M" ? "Medium" : "Hard"}
              </Badge>
              <Badge variant="outline">{currentQuestion.qtype === "SA" ? "Single Answer" : "Multi-Select"}</Badge>
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <QuestionCard
            question={currentQuestion}
            selectedOptions={currentResponses}
            onOptionSelect={handleOptionSelect}
            showAnswer={showAnswer}
            onToggleShowAnswer={() => setShowAnswer((v) => !v)}
            moduleId={moduleId}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={quizState.currentQuestionIndex === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Use 1-4 keys to select • P/N to navigate • S to submit</span>
            </div>

            {quizState.currentQuestionIndex === quizState.questions.length - 1 ? (
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={goToNextQuestion} className="flex items-center gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">1-4</kbd> Select options
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">←/P</kbd> Previous
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">→/N</kbd> Next
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">S</kbd> Submit
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function QuestionCard({
  question,
  selectedOptions,
  onOptionSelect,
  showAnswer,
  onToggleShowAnswer,
  moduleId,
}: {
  question: Question
  selectedOptions: OptionKey[]
  onOptionSelect: (option: OptionKey) => void
  showAnswer: boolean
  onToggleShowAnswer: () => void
  moduleId: string
}) {
  const createGitHubIssueUrl = (questionIndex: number, questionText: string) => {
    const baseUrl = "https://github.com/AdityaW2005/aws-exam-prep-website/issues/new"
    const title = encodeURIComponent(
      `Issue with Question ${questionIndex} in Module ${moduleId.toUpperCase()}`,
    )
    const body = encodeURIComponent(`**Question:** ${questionText}

**Module:** ${moduleId.toUpperCase()}
**Question Number:** ${questionIndex}

**Issue Description:**
Please describe the issue with this question (incorrect answer, unclear explanation, etc.):

**Expected Behavior:**
What should the correct answer or explanation be?

**Additional Context:**
Add any other context about the problem here.`)

    return `${baseUrl}?title=${title}&body=${body}&labels=question-issue`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl leading-relaxed">
            {question.text}
            {question.qtype === "MS" && question.chooseN && (
              <Badge variant="secondary" className="ml-3">
                Choose {question.chooseN}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleShowAnswer} className="bg-transparent">
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4" /> Hide Answer
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" /> Show Answer
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <a
                href={createGitHubIssueUrl(question.index, question.text)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bug className="h-4 w-4" /> Report Issue
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(["A", "B", "C", "D"] as OptionKey[]).map((optionKey, index) => {
          const isSelected = selectedOptions.includes(optionKey)
          const isCorrect = question.answer.includes(optionKey)
          const borderClass = showAnswer
            ? isCorrect
              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
              : isSelected
                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-border bg-card"
            : isSelected
              ? "border-primary bg-primary/10 shadow-sm"
              : "border-border bg-card hover:border-primary/50"

          return (
            <button
              key={optionKey}
              onClick={() => onOptionSelect(optionKey)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${borderClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
                    showAnswer
                      ? isCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : isSelected
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-muted-foreground/30 bg-background"
                      : isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background"
                  }`}
                >
                  {isSelected && !showAnswer ? <CheckCircle2 className="h-4 w-4" /> : optionKey}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Option {optionKey}</span>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">{index + 1}</kbd>
                    {showAnswer && isCorrect && (
                      <Badge variant="secondary" className="ml-2">Correct</Badge>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed">{question.options[optionKey]}</p>
                </div>
              </div>
            </button>
          )
        })}

        {showAnswer && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Explanation</h5>
            <p className="text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-6 w-px bg-border" />
              <div>
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              <div className="h-6 w-12 bg-muted rounded animate-pulse" />
              <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function QuizError({ error, moduleId }: { error: string; moduleId: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Quiz Loading Failed</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
