"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Github } from "lucide-react"
import { useRouter } from "next/navigation"

export function RefreshButton() {
  const router = useRouter()
  
  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
      <RefreshCw className="h-4 w-4" />
      Retry
    </Button>
  )
}

export function ErrorRefreshButton() {
  const router = useRouter()
  
  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      className="ml-4 flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Retry
    </Button>
  )
}
