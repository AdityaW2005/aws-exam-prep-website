"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Clock, TrendingUp } from "lucide-react"

interface ModuleStats {
  totalModules: number
  totalQuestions: number
  totalFlashcards: number
  lastUpdated: string
}

export function ModuleStatsCard() {
  const [stats, setStats] = useState<ModuleStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // This would be implemented to fetch actual stats from the API
        // For now, we'll use placeholder data
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading

        setStats({
          totalModules: 12,
          totalQuestions: 240,
          totalFlashcards: 180,
          lastUpdated: new Date().toLocaleDateString(),
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-muted rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Learning Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-primary">{stats.totalModules}</span>
            </div>
            <p className="text-xs text-muted-foreground">Modules</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-primary">{stats.totalQuestions}</span>
            </div>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-primary">{stats.totalFlashcards}</span>
            </div>
            <p className="text-xs text-muted-foreground">Flashcards</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-primary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {stats.lastUpdated}</span>
            <Badge variant="secondary" className="text-xs">
              Live Data
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
