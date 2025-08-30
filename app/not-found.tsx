export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline underline-offset-4 hover:opacity-80">
          Return to Home
        </a>
      </div>
    </main>
  )
}
