export {}

declare global {
  interface Window {
    dataLayer: unknown[]
    // Basic gtag typing compatible with config and event calls
    gtag: (...args: any[]) => void
  }
}
