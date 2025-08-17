import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider" // Added ThemeProvider import
import "./globals.css"

export const metadata: Metadata = {
  title: "AWS Quiz & Flashcards - Interactive Learning Platform",
  description:
    "Master AWS concepts through interactive quizzes and flashcards. Test your knowledge with comprehensive questions and detailed explanations.",
  generator: "v0.app",
  keywords: ["AWS", "quiz", "flashcards", "learning", "cloud computing", "certification"],
  authors: [{ name: "AWS Learning Platform" }],
  openGraph: {
    title: "AWS Quiz & Flashcards",
    description: "Interactive AWS learning platform with quizzes and flashcards",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {" "}
      {/* Added suppressHydrationWarning for theme */}
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
