"use client"

/**
 * Error boundary for /reseller. Catches errors in the reseller page or its children
 * and renders a simple UI so Next does not need to serve fallback chunks.
 */
export default function ResellerError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
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
    </div>
  )
}
