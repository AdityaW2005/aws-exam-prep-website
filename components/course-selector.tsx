"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { COURSE_MAP, DEFAULT_COURSE_ID } from "@/lib/github"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CourseSelector() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const current = searchParams.get('courseId') || DEFAULT_COURSE_ID

  const handleChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('courseId', value)
    router.push(`/?${params.toString()}#modules`)
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Label htmlFor="course" className="mb-2 block">Course</Label>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger id="course" className="w-full">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(COURSE_MAP).map(([name, id]) => (
            <SelectItem key={id} value={id}>{name} [{id}]</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
