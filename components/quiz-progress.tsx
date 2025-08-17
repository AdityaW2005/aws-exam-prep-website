"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface QuizProgressProps {
  currentIndex: number
  totalQuestions: number
  responses: Record<number, any[]>
  elapsedTime: string
}

export function QuizProgress({ currentIndex, totalQuestions, responses, elapsedTime }: QuizProgressProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const answeredCount = Object.keys(responses).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>{answeredCount} answered</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-muted-foreground" />
            <span>{totalQuestions - answeredCount} remaining</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{elapsedTime}</span>
          </div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
