import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ModulesList } from "@/components/modules-list"
import Link from "next/link"
import { ModulesPrefetch } from "@/components/modules-prefetch"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
  <ModulesPrefetch />
      <AppHeader />
      
      {/* Hero Section (simple + student vibe) */}
      <section className="relative">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              AWS practice made simple
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              A small student-made project for students to prep with quizzes and flashcards. No fluff—just study.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="#modules">
                <Button size="lg" className="rounded-full">
                  Explore modules <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#modules" className="hidden sm:inline-block">
                <Button variant="outline" size="lg" className="rounded-full">
                  View modules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

  {/* Removed heavy marketing features for a cleaner page */}

      {/* Modules Section */}
  <section id="modules" className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">Pick a module</h2>
      <p className="text-base text-muted-foreground max-w-2xl mx-auto">Compute, storage, networking, more.</p>
            </div>
            
            <Suspense fallback={<ModulesSkeleton />}>
              <ModulesList />
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
