"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { COURSE_MAP, DEFAULT_COURSE_ID } from "@/lib/github"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function CourseSelector() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const current = searchParams.get('courseId') || DEFAULT_COURSE_ID

  const handleChange = (value: string) => {
    if (!value) return
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('courseId', value)
    router.push(`/?${params.toString()}#modules`)
  }

  const entries = Object.entries(COURSE_MAP)

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <Label className="mb-2 block">Course</Label>
      <div className="inline-flex w-full flex-wrap gap-2">
        {entries.map(([name, id]) => (
          <Button
            key={id}
            size="sm"
            variant={current === id ? "default" : "outline"}
            className="rounded-md"
            onClick={() => handleChange(id)}
            aria-pressed={current === id}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  )
}
