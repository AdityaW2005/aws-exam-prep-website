"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  RefreshCw,
  TrendingUp,
  Award,
  BookOpen,
  Bug,
} from "lucide-react"
import Link from "next/link"
import type { QuizResultSummary, Question, OptionKey } from "@/types/quiz"

interface ResultsPageProps {
  params: Promise<{ moduleId: string }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { moduleId } = React.use(params)
  const router = useRouter()
  const [results, setResults] = useState<QuizResultSummary | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Record<number, OptionKey[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load results from sessionStorage
    const resultsData = sessionStorage.getItem("quizResults")
    const questionsData = sessionStorage.getItem("quizQuestions")
    const responsesData = sessionStorage.getItem("quizResponses")

    if (!resultsData || !questionsData || !responsesData) {
      // Redirect to quiz if no results found
  router.push(`/quiz/${moduleId}`)
      return
    }

    try {
      setResults(JSON.parse(resultsData))
      setQuestions(JSON.parse(questionsData))
      setResponses(JSON.parse(responsesData))
    } catch (error) {
      console.error("Failed to parse quiz results:", error)
      router.push(`/quiz/${moduleId}`)
      return
    }

    setLoading(false)
  }, [moduleId, router])

  const retakeQuiz = () => {
    // Clear stored results
    sessionStorage.removeItem("quizResults")
    sessionStorage.removeItem("quizQuestions")
    sessionStorage.removeItem("quizResponses")
  router.push(`/quiz/${moduleId}`)
  }

  const createGitHubIssueUrl = (questionIndex: number, questionText: string) => {
    const baseUrl = "https://github.com/AdityaW2005/aws-modules-qb/issues/new"
  const title = encodeURIComponent(`Issue with Question ${questionIndex} in Module ${moduleId.toUpperCase()}`)
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

  if (loading) {
    return <ResultsSkeleton />
  }

  if (!results) {
    return <ResultsError moduleId={moduleId} />
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { text: "Excellent", variant: "default" as const, icon: Trophy }
    if (percentage >= 80) return { text: "Great", variant: "secondary" as const, icon: Award }
    if (percentage >= 70) return { text: "Good", variant: "secondary" as const, icon: Target }
    if (percentage >= 60) return { text: "Pass", variant: "outline" as const, icon: CheckCircle2 }
    return { text: "Needs Improvement", variant: "destructive" as const, icon: AlertCircle }
  }

  const scoreBadge = getScoreBadge(results.percentage)
  const ScoreIcon = scoreBadge.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Quiz Results</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Module {moduleId.toUpperCase()} Performance Summary</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Button onClick={retakeQuiz} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Score Card */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <ScoreIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  <Badge variant={scoreBadge.variant} className="text-sm sm:text-lg px-3 sm:px-4 py-1">
                    {scoreBadge.text}
                  </Badge>
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold">
                  <span className={getScoreColor(results.percentage)}>
                    {results.score}/{results.total}
                  </span>
                </CardTitle>
                <p className="text-xl sm:text-2xl font-semibold text-primary">{results.percentage}%</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{results.correctCount}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Correct</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-red-600">{results.wrongCount}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Incorrect</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-yellow-600">{results.unansweredCount}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Unanswered</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Time</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {Math.floor(results.timeTotalSec / 60)}:{(results.timeTotalSec % 60).toString().padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Average per Question</p>
                  <p className="text-lg sm:text-xl font-semibold">{Math.round(results.timeTotalSec / results.total)}s</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Questions per Minute</p>
                  <p className="text-lg sm:text-xl font-semibold">{((results.total / results.timeTotalSec) * 60).toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceInsights results={results} questions={questions} />
            </CardContent>
          </Card>

          {/* Detailed Question Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Question-by-Question Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionReview
                questions={questions}
                results={results}
                responses={responses}
                moduleId={moduleId}
                createGitHubIssueUrl={createGitHubIssueUrl}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="flex items-center justify-center gap-2 bg-transparent w-full sm:w-auto">
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={retakeQuiz} size="lg" className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <RefreshCw className="h-5 w-5" />
              Retake Quiz
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function PerformanceInsights({
  results,
  questions,
}: {
  results: QuizResultSummary
  questions: Question[]
}) {
  // Analyze performance by difficulty
  const difficultyStats = { E: { correct: 0, total: 0 }, M: { correct: 0, total: 0 }, H: { correct: 0, total: 0 } }
  const typeStats = { SA: { correct: 0, total: 0 }, MS: { correct: 0, total: 0 } }

  questions.forEach((question, index) => {
    const detail = results.details[index]
    difficultyStats[question.difficulty].total++
    typeStats[question.qtype].total++

    if (detail.correct) {
      difficultyStats[question.difficulty].correct++
      typeStats[question.qtype].correct++
    }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <h4 className="font-semibold mb-3 text-sm sm:text-base">Performance by Difficulty</h4>
        <div className="space-y-3">
          {Object.entries(difficultyStats).map(([difficulty, stats]) => {
            const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            const difficultyName = difficulty === "E" ? "Easy" : difficulty === "M" ? "Medium" : "Hard"
            return (
              <div key={difficulty} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={difficulty === "E" ? "secondary" : difficulty === "M" ? "default" : "destructive"}
                    className="w-14 sm:w-16 justify-center text-xs sm:text-sm"
                  >
                    {difficultyName}
                  </Badge>
                  <span className="text-xs sm:text-sm">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${getScoreColor(percentage)}`}>{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm sm:text-base">Performance by Question Type</h4>
        <div className="space-y-3">
          {Object.entries(typeStats).map(([type, stats]) => {
            const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            const typeName = type === "SA" ? "Single Answer" : "Multi-Select"
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-20 sm:w-24 justify-center text-xs sm:text-sm">
                    {typeName}
                  </Badge>
                  <span className="text-xs sm:text-sm">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${getScoreColor(percentage)}`}>{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function QuestionReview({
  questions,
  results,
  responses,
  moduleId,
  createGitHubIssueUrl,
}: {
  questions: Question[]
  results: QuizResultSummary
  responses: Record<number, OptionKey[]>
  moduleId: string
  createGitHubIssueUrl: (questionIndex: number, questionText: string) => string
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {questions.map((question, index) => {
        const detail = results.details[index]
        const userResponse = responses[question.index] || []
        const timeSpent = results.timePerQuestionSec[index] || 0

        return (
          <AccordionItem key={question.index} value={`question-${question.index}`}>
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center gap-2">
                  {detail.correct ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : userResponse.length === 0 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Question {question.index}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto mr-4">
                  <Badge
                    variant={
                      question.difficulty === "E"
                        ? "secondary"
                        : question.difficulty === "M"
                          ? "default"
                          : "destructive"
                    }
                    className={
                      question.difficulty === "H" 
                        ? "bg-red-500 text-white border-red-600 font-semibold" 
                        : ""
                    }
                  >
                    {question.difficulty === "E" ? "Easy" : question.difficulty === "M" ? "Medium" : "Hard"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {timeSpent}s
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-semibold mb-2">{question.text}</h4>
                  {question.qtype === "MS" && question.chooseN && (
                    <Badge variant="secondary" className="mb-3">
                      Choose {question.chooseN}
                    </Badge>
                  )}
                </div>

                <div className="grid gap-2">
                  {(["A", "B", "C", "D"] as OptionKey[]).map((optionKey) => {
                    const isCorrect = detail.correctAnswer.includes(optionKey)
                    const isSelected = userResponse.includes(optionKey)

                    return (
                      <div
                        key={optionKey}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : isSelected
                              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                              : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                isCorrect
                                  ? "border-green-500 bg-green-500 text-white"
                                  : isSelected
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-muted-foreground/30"
                              }`}
                            >
                              {optionKey}
                            </div>
                            {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                          </div>
                          <p className="flex-1">{question.options[optionKey]}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Explanation</h5>
                  <p className="text-sm leading-relaxed">{question.explanation}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Your answer: {userResponse.length > 0 ? userResponse.join(", ") : "Not answered"}</span>
                  <span>Correct answer: {detail.correctAnswer.join(", ")}</span>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-2 text-xs bg-transparent"
                  >
                    <a
                      href={createGitHubIssueUrl(question.index, question.text)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Bug className="h-3 w-3" />
                      Report Issue
                    </a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

function getScoreColor(percentage: number) {
  if (percentage >= 80) return "text-green-600"
  if (percentage >= 60) return "text-yellow-600"
  return "text-red-600"
}

function ResultsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-5 w-64 bg-muted rounded animate-pulse mt-2" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-20 bg-muted rounded animate-pulse" />
              <div className="h-10 w-28 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 animate-pulse">
              <CardHeader className="text-center pb-4">
                <div className="h-8 w-32 bg-muted rounded mx-auto mb-4" />
                <div className="h-12 w-24 bg-muted rounded mx-auto mb-2" />
                <div className="h-8 w-16 bg-muted rounded mx-auto" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-6 w-6 bg-muted rounded-full mx-auto mb-2" />
                      <div className="h-8 w-8 bg-muted rounded mx-auto mb-1" />
                      <div className="h-4 w-16 bg-muted rounded mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-muted rounded mb-1" />
                    <div className="h-6 w-16 bg-muted rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function ResultsError({ moduleId }: { moduleId: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Results Not Found</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Quiz results are not available. Please take the quiz first to see your results.
          </AlertDescription>
        </Alert>
        <div className="flex gap-3 justify-center">
          <Link href={`/quiz/${moduleId}`}>
            <Button className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Take Quiz
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
