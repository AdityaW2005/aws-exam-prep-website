"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { useEffect, useMemo } from "react"

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  const qs = useMemo(() => searchParams.toString(), [searchParams])

  useEffect(() => {
    if (pathname && gaId) {
      const url = pathname + (qs ? `?${qs}` : "")
      // Guard against calling before GA is initialized
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        // GA4 recommended: send manual page_view for SPA navigations
        window.gtag("event", "page_view", { page_path: url })
      }
    }
  }, [pathname, qs, gaId])

  if (!gaId) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Disable automatic page_view to avoid double counting; we'll send manual events.
            gtag('config', '${gaId}', { send_page_view: false });
          `,
        }}
      />
    </>
  )
}
