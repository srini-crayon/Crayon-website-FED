import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "LinkedIn | Crayon Data",
  description: "Connect with Crayon Data on LinkedIn.",
}

export default function LinkedInPage() {
  return (
    <div
      className="flex min-h-screen px-5 pt-32 pb-16"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #111827 35%, #e5e7eb 70%, #fafafa 100%)",
      }}
    >
      <div className="w-full" style={{ maxWidth: "1472px", margin: "0 auto", marginTop: "16px" }}>
        <div
          className="sk-ww-linkedin-page-post"
          data-embed-id="25649461"
          style={{ borderRadius: "4px", overflow: "hidden" }}
        ></div>
        <Script src="https://widgets.sociablekit.com/linkedin-page-posts/widget.js" defer />
        <style>{`
          .sk-ww-linkedin-page-post .sk-header-details {
            margin-top: 12px;
          }
        `}</style>
      </div>
    </div>
  )
}
