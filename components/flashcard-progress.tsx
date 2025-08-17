"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface FlashcardProgressProps {
  currentIndex: number
  totalCards: number
  knownCount: number
  unknownCount: number
}

export function FlashcardProgress({ currentIndex, totalCards, knownCount, unknownCount }: FlashcardProgressProps) {
  const progress = ((currentIndex + 1) / totalCards) * 100
  const reviewedCount = knownCount + unknownCount
  const remainingCount = totalCards - reviewedCount

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            {knownCount} Known
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-500" />
            {unknownCount} Unknown
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {remainingCount} Remaining
          </Badge>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
