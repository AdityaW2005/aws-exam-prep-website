import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Brain, Clock, AlertCircle, Github } from "lucide-react"
import Link from "next/link"
import { getModules } from "@/lib/api"
import { RefreshButton, ErrorRefreshButton } from "@/components/refresh-buttons"
import * as React from "react"

export async function ModulesList() {
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
    return <>
      <ErrorModulesState />
      <ModulesListCachedFallback />
    </>
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
        <RefreshButton />
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
        <ErrorRefreshButton />
      </AlertDescription>
    </Alert>
  )
}

// Client-only fallback to use cached modules if available
function ModulesListCachedFallback() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('modules:list')
    if (!raw) return null
    const parsed = JSON.parse(raw) as { value: { id: string; name: string; hasQuestions: boolean; hasFlashcards: boolean }[]; ts: number }
    const modules = parsed?.value ?? []
    if (!Array.isArray(modules) || modules.length === 0) return null
    return (
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-2">Showing cached modules (offline)</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      </div>
    )
  } catch {
    return null
  }
}
