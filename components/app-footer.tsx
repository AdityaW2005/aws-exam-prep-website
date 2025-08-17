export function AppFooter() {
  return (
    <footer className="border-t bg-card/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Content sourced from{" "}
            <a
              href="https://github.com/AdityaW2005/aws-modules-qb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AWS Modules Question Bank
            </a>
          </p>
          <p className="mt-2">Built for educational purposes • Not affiliated with AWS</p>
        </div>
      </div>
    </footer>
  )
}
