"use client"
import { useEffect } from "react"
import { getModules } from "@/lib/api"

// Prefetch modules on the client to warm localStorage cache for offline usage
export function ModulesPrefetch() {
  useEffect(() => {
    // Fire and forget; errors are fine (we just won't have cache)
    getModules().catch(() => {})
  }, [])
  return null
}
