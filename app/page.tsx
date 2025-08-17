import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Clock } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ModulesList } from "@/components/modules-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <AppHeader />
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
      <AppFooter />
    </div>
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
