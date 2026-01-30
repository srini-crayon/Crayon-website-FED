"use client"

/**
 * Root error boundary. Replaces the root layout when an unhandled error occurs.
 * This avoids Next.js serving the fallback error UI that requests
 * /_next/static/chunks/fallback/* (which can 500 in some setups).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Something went wrong</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            cursor: "pointer",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
