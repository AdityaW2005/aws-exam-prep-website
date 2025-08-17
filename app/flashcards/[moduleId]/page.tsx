"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Home,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { getFlashcards } from "@/lib/api"
import type { Flashcard } from "@/types/quiz"

interface FlashcardsPageProps {
  params: { moduleId: string }
}

interface FlashcardState {
  flashcards: Flashcard[]
  currentIndex: number
  showAnswer: boolean
  knownCards: Set<string>
  unknownCards: Set<string>
  isShuffled: boolean
  originalOrder: Flashcard[]
}

export default function FlashcardsPage({ params }: FlashcardsPageProps) {
  const router = useRouter()
  const [state, setState] = useState<FlashcardState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFlashcards() {
      try {
        setLoading(true)
        const response = await getFlashcards(params.moduleId)
        const flashcards = Array.isArray(response) ? response : response?.flashcards

        if (!flashcards || !Array.isArray(flashcards)) {
          throw new Error("Invalid flashcards data received")
        }

        if (flashcards.length === 0) {
          throw new Error("No flashcards found for this module")
        }

        const validatedFlashcards = flashcards.map((card, idx) => ({
          ...card,
          id: card.id || `card-${idx}`,
          answers: Array.isArray(card.answers) ? card.answers : [card.answers].filter(Boolean),
        }))

        setState({
          flashcards: validatedFlashcards,
          currentIndex: 0,
          showAnswer: false,
          knownCards: new Set(),
          unknownCards: new Set(),
          isShuffled: false,
          originalOrder: [...validatedFlashcards],
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load flashcards")
      } finally {
        setLoading(false)
      }
    }

    loadFlashcards()
  }, [params.moduleId])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (!state) return

      switch (event.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          event.preventDefault()
          goToPrevious()
          break
        case "arrowright":
        case "d":
          event.preventDefault()
          goToNext()
          break
        case " ":
        case "enter":
          event.preventDefault()
          toggleAnswer()
          break
        case "s":
          event.preventDefault()
          shuffleCards()
          break
        case "r":
          event.preventDefault()
          resetProgress()
          break
        case "k":
          event.preventDefault()
          markAsKnown()
          break
        case "u":
          event.preventDefault()
          markAsUnknown()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [state])

  const goToNext = () => {
    if (!state) return

    const nextIndex = state.currentIndex < state.flashcards.length - 1 ? state.currentIndex + 1 : 0

    setState({
      ...state,
      currentIndex: nextIndex,
      showAnswer: false,
    })
  }

  const goToPrevious = () => {
    if (!state) return

    const prevIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.flashcards.length - 1

    setState({
      ...state,
      currentIndex: prevIndex,
      showAnswer: false,
    })
  }

  const toggleAnswer = () => {
    if (!state) return

    setState({
      ...state,
      showAnswer: !state.showAnswer,
    })
  }

  const shuffleCards = () => {
    if (!state) return

    const shuffled = Array.from(state.flashcards).sort(() => Math.random() - 0.5)

    setState({
      ...state,
      flashcards: shuffled,
      currentIndex: 0,
      showAnswer: false,
      isShuffled: true,
    })
  }

  const resetOrder = () => {
    if (!state) return

    setState({
      ...state,
      flashcards: Array.from(state.originalOrder), // Ensure array copy
      currentIndex: 0,
      showAnswer: false,
      isShuffled: false,
    })
  }

  const resetProgress = () => {
    if (!state) return

    setState({
      ...state,
      knownCards: new Set(),
      unknownCards: new Set(),
      currentIndex: 0,
      showAnswer: false,
    })
  }

  const markAsKnown = () => {
    if (!state) return

    const currentCard = state.flashcards[state.currentIndex]
    const newKnownCards = new Set(state.knownCards)
    const newUnknownCards = new Set(state.unknownCards)

    newKnownCards.add(currentCard.id)
    newUnknownCards.delete(currentCard.id)

    setState({
      ...state,
      knownCards: newKnownCards,
      unknownCards: newUnknownCards,
    })
  }

  const markAsUnknown = () => {
    if (!state) return

    const currentCard = state.flashcards[state.currentIndex]
    const newKnownCards = new Set(state.knownCards)
    const newUnknownCards = new Set(state.unknownCards)

    newUnknownCards.add(currentCard.id)
    newKnownCards.delete(currentCard.id)

    setState({
      ...state,
      knownCards: newKnownCards,
      unknownCards: newUnknownCards,
    })
  }

  if (loading) {
    return <FlashcardsSkeleton />
  }

  if (error) {
    return <FlashcardsError error={error} moduleId={params.moduleId} />
  }

  if (!state || state.flashcards.length === 0) {
    return <FlashcardsError error="No flashcards available for this module" moduleId={params.moduleId} />
  }

  const currentCard = state.flashcards[state.currentIndex]
  const progress = ((state.currentIndex + 1) / state.flashcards.length) * 100
  const cardStatus = state.knownCards.has(currentCard.id)
    ? "known"
    : state.unknownCards.has(currentCard.id)
      ? "unknown"
      : "neutral"

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-card/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
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
                <h1 className="font-semibold">Module {params.moduleId.toUpperCase()} Flashcards</h1>
                <p className="text-sm text-muted-foreground">
                  Card {state.currentIndex + 1} of {state.flashcards.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FlashcardStats
                knownCount={state.knownCards.size}
                unknownCount={state.unknownCards.size}
                totalCount={state.flashcards.length}
              />
              {state.isShuffled && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shuffle className="h-3 w-3" />
                  Shuffled
                </Badge>
              )}
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
          <FlashcardDisplay
            card={currentCard}
            showAnswer={state.showAnswer}
            cardStatus={cardStatus}
            onToggleAnswer={toggleAnswer}
            onMarkKnown={markAsKnown}
            onMarkUnknown={markAsUnknown}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={goToPrevious} className="flex items-center gap-2 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={shuffleCards} className="flex items-center gap-2 bg-transparent">
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
              {state.isShuffled && (
                <Button variant="outline" onClick={resetOrder} className="flex items-center gap-2 bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  Original Order
                </Button>
              )}
              <Button variant="outline" onClick={resetProgress} className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Reset Progress
              </Button>
            </div>

            <Button onClick={goToNext} className="flex items-center gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">←/A</kbd> Previous card
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">→/D</kbd> Next card
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Space</kbd> Show/hide answer
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">S</kbd> Shuffle cards
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">K</kbd> Mark as known
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">U</kbd> Mark as unknown
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">R</kbd> Reset progress
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FlashcardDisplay({
  card,
  showAnswer,
  cardStatus,
  onToggleAnswer,
  onMarkKnown,
  onMarkUnknown,
}: {
  card: Flashcard
  showAnswer: boolean
  cardStatus: "known" | "unknown" | "neutral"
  onToggleAnswer: () => void
  onMarkKnown: () => void
  onMarkUnknown: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Question Card */}
      <Card
        className={`min-h-[300px] cursor-pointer transition-all duration-200 hover:shadow-lg ${
          cardStatus === "known"
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : cardStatus === "unknown"
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "hover:border-primary/50"
        }`}
        onClick={onToggleAnswer}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Question
            </CardTitle>
            <div className="flex items-center gap-2">
              {cardStatus === "known" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Known
                </Badge>
              )}
              {cardStatus === "unknown" && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Unknown
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{card.question}</p>
          {!showAnswer && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">Click to reveal answer or press Space</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Card */}
      {showAnswer && (
        <Card className="min-h-[200px] border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {card.answers.map((answer, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                    {card.answers.length > 1 ? index + 1 : "A"}
                  </div>
                  <p className="text-lg leading-relaxed flex-1">{answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {showAnswer && (
        <div className="flex justify-center gap-4">
          <Button
            variant={cardStatus === "unknown" ? "destructive" : "outline"}
            onClick={onMarkUnknown}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Mark as Unknown
          </Button>
          <Button
            variant={cardStatus === "known" ? "default" : "outline"}
            onClick={onMarkKnown}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as Known
          </Button>
        </div>
      )}
    </div>
  )
}

function FlashcardStats({
  knownCount,
  unknownCount,
  totalCount,
}: {
  knownCount: number
  unknownCount: number
  totalCount: number
}) {
  const reviewedCount = knownCount + unknownCount
  const remainingCount = totalCount - reviewedCount

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-green-600 font-medium">{knownCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-red-600 font-medium">{unknownCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground font-medium">{remainingCount}</span>
      </div>
    </div>
  )
}

function FlashcardsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-6 w-px bg-border" />
              <div>
                <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
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
          <Card className="min-h-[300px] animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/2 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function FlashcardsError({ error, moduleId }: { error: string; moduleId: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Flashcards Loading Failed</h1>
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
