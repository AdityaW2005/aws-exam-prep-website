"use client"
import { useEffect } from "react"
import { getModules } from "@/lib/api"
import { DEFAULT_COURSE_ID } from "@/lib/github"

// Prefetch modules on the client to warm localStorage cache for offline usage
export function ModulesPrefetch() {
  useEffect(() => {
    // Fire and forget; errors are fine (we just won't have cache)
    const sp = new URLSearchParams(window.location.search)
    const courseId = sp.get('courseId') || DEFAULT_COURSE_ID
    getModules(courseId).catch(() => {})
  }, [])
  return null
}
