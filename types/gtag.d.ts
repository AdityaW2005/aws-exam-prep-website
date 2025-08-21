interface Window {
  gtag: (
    event: string,
    action: string,
    params: {
      page_path: string
    }
  ) => void
}
