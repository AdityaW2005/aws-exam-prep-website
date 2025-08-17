"use client"

import { useEffect, useState } from "react"

export function useQuizTimer(startTime: number, isActive = true) {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return {
    elapsedSeconds,
    minutes,
    seconds,
    formattedTime: `${minutes}:${seconds.toString().padStart(2, "0")}`,
  }
}
