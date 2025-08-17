"use client"

import { Button } from "@/components/ui/button"
import { Github, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppHeader() {
  return (
    <header className="border-b bg-card/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
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
            <ThemeToggle />
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
  )
}
