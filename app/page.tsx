"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Brain, Clock, AlertCircle, RefreshCw, Github, Zap } from "lucide-react"
import Link from "next/link"
import { getModules } from "@/lib/api"
import { ThemeToggle } from "@/components/theme-toggle" // Added ThemeToggle import

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {" "}
      {/* Added dark mode background */}
      {/* Header */}
      <header className="border-b bg-card/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        {" "}
        {/* Added dark mode header */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">AWS Quiz & Flashcards</h1>
                  <p className="text-muted-foreground text-sm">Master AWS concepts through interactive learning</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle /> {/* Added theme toggle button */}
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/AdityaW2005/aws-modules-qb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Choose Your Learning Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Test your knowledge with comprehensive quizzes featuring multiple choice questions, or review key concepts
              with interactive flashcards. All content is dynamically sourced from curated AWS learning materials.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 rounded-lg bg-card border">
              <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Interactive Quizzes</h3>
              <p className="text-sm text-muted-foreground">
                Single and multi-select questions with detailed explanations and instant scoring
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smart Flashcards</h3>
              <p className="text-sm text-muted-foreground">
                Quick review cards with keyboard navigation and progress tracking
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Comprehensive Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Detailed results with time tracking and performance insights
              </p>
            </div>
          </div>

          {/* Module Discovery */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Available AWS Modules</h3>
            <Suspense fallback={<ModulesSkeleton />}>
              <ModulesList />
            </Suspense>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t bg-card/30 dark:bg-gray-800/30 mt-16">
        {" "}
        {/* Added dark mode footer */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Content sourced from{" "}
              <a
                href="https://github.com/AdityaW2005/aws-modules-qb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                AWS Modules Question Bank
              </a>
            </p>
            <p className="mt-2">Built for educational purposes • Not affiliated with AWS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

async function ModulesList() {
  try {
    const modules = await getModules()

    if (modules.length === 0) {
      return <EmptyModulesState />
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    )
  } catch (error) {
    console.error("Failed to load modules:", error)
    return <ErrorModulesState />
  }
}

function ModuleCard({
  module,
}: { module: { id: string; name: string; hasQuestions: boolean; hasFlashcards: boolean } }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          {module.name}
        </CardTitle>
        <CardDescription className="text-sm">AWS fundamentals, best practices, and core concepts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {module.hasQuestions && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                Quiz Available
              </Badge>
            )}
            {module.hasFlashcards && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                Cards Available
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {module.hasQuestions && (
            <Link href={`/quiz/${module.id}`} className="block">
              <Button className="w-full group/btn" variant="default">
                <Brain className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                Take Quiz
              </Button>
            </Link>
          )}
          {module.hasFlashcards && (
            <Link href={`/flashcards/${module.id}`} className="block">
              <Button className="w-full group/btn bg-transparent" variant="outline">
                <Clock className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                Review Flashcards
              </Button>
            </Link>
          )}
          {!module.hasFlashcards && module.hasQuestions && (
            <Button className="w-full bg-transparent" variant="outline" disabled>
              <Clock className="h-4 w-4 mr-2 opacity-50" />
              Flashcards Unavailable
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyModulesState() {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">No AWS Modules Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any AWS modules in the repository. This might be due to network issues or the repository
        structure has changed.
      </p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/AdityaW2005/aws-modules-qb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            Check Repository
          </a>
        </Button>
      </div>
    </div>
  )
}

function ErrorModulesState() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load AWS modules. Please check your internet connection and try again.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="ml-4 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function ModulesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted rounded"></div>
              <div className="h-5 bg-muted rounded w-24"></div>
            </div>
            <div className="h-4 bg-muted rounded w-full mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="h-5 bg-muted rounded w-20"></div>
              <div className="h-5 bg-muted rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
