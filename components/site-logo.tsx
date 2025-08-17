"use client"

import * as React from "react"

type SiteLogoProps = {
  size?: number
  className?: string
}

// A custom, minimal, slightly sassy icon: playful lightning S + spark
export function SiteLogo({ size = 28, className }: SiteLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Site logo"
    >
      {/* Soft background blob */}
      <path
        d="M12 10c4-3 20-3 24 0 4 3 4 17 0 20-4 3-20 3-24 0-4-3-4-17 0-20z"
        fill="currentColor"
        opacity="0.08"
      />
      {/* Lightning-esque S curve */}
      <path
        d="M18 14c5 0 7 3 7 5s-2 3-4 4c-2 1-4 2-4 5 0 3 2 6 7 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spark */}
      <circle cx="33.5" cy="14.5" r="2" fill="currentColor" />
    </svg>
  )
}
