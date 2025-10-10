import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Book, Layers, Clock } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ModulesList } from "@/components/modules-list"
import Link from "next/link"
import { ModulesPrefetch } from "@/components/modules-prefetch"
import { CourseSelector } from "@/components/course-selector"
import { COURSE_MAP, DEFAULT_COURSE_ID } from "@/lib/github"

export default async function HomePage({ searchParams }: { searchParams: Promise<{ courseId?: string }> }) {
  const { courseId } = await searchParams
  return (
    <div className="min-h-screen bg-background">
      <ModulesPrefetch />
      <AppHeader />
      
      {/* Hero Section (simple + student vibe) */}
      <section className="relative">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              AWS practice made simple
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              A small student-made project for students to prep with quizzes and flashcards. No fluff—just study.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Link href="#modules">
                <Button size="lg" className="rounded-full w-full sm:w-auto">
                  Explore modules <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#modules" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                  View modules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Study smarter, not harder
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-4 sm:px-0">
              Free practice tools for AWS certification prep. Made by a student, for students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-4 sm:p-6 border-0 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Book className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Quiz Practice</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Test your knowledge with curated questions from AWS certification topics.
              </p>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 border-0 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Flashcards</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Quick review cards for key concepts and terms you need to remember.
              </p>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 border-0 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Track your study progress and see how much you've completed.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Pick a module</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
                Compute, storage, networking, and more.
              </p>
            </div>
            
            <Suspense fallback={null}>
              <CourseSelector />
            </Suspense>
            <Suspense fallback={<ModulesSkeleton />}>
              <ModulesList courseId={courseId} />
            </Suspense>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}

function ModulesSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-muted rounded"></div>
              <div className="h-4 sm:h-5 bg-muted rounded w-20 sm:w-24"></div>
            </div>
            <div className="h-3 sm:h-4 bg-muted rounded w-full mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="h-4 sm:h-5 bg-muted rounded w-16 sm:w-20"></div>
              <div className="h-4 sm:h-5 bg-muted rounded w-20 sm:w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 sm:h-10 bg-muted rounded"></div>
              <div className="h-8 sm:h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
