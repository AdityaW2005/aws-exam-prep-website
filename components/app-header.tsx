"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteLogo } from "@/components/site-logo"

export function AppHeader() {
  return (
    <header className="border-b bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group select-none">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
              <SiteLogo size={22} className="text-primary" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold">AWS Study</span>
              <span className="block text-xs text-muted-foreground">by students, for students</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild className="h-8">
              <a
                href="https://github.com/AdityaW2005/aws-exam-prep-website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">Source</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
