"use client"

/** Impact section (formerly Case Studies): Group 1410104296, 1410104295, Article cards */

/** Card order matches spec: 3 columns × 3 rows (7 cards). coloredLead = phrase in card color; rest of description = black */
const impactCards = [
  { metric: "7%", category: "Banking", description: "increase in customer spends for the largest private bank in India", coloredLead: "increase in customer spends", color: "#1C69E3" },
  { metric: "17%", category: "Travel", description: "increase in redemptions for a cross-border traveler program in SEA", coloredLead: "increase in redemptions", color: "#CF57C8" },
  { metric: "126%", category: "FinTech", description: "increase in digital activation for a fast-scaling FinTech ecosystem in Myanmar", coloredLead: "increase in digital activation", color: "#00B388" },
  { metric: "80%", category: "Travel", description: "reduction in booking time for a travel experience platform in the Middle East", coloredLead: "reduction in booking time", color: "#7C52EE" },
  { metric: "10×", category: "Banking", description: "ROI in customer value management for a major financial institution for the largest Islamic bank in the middle east", coloredLead: "ROI", color: "#DE8900" },
  { metric: "100M+", category: "Banking & Travel", description: "customer genomes powering 1:1 personalization for Banks and Travel", coloredLead: "customer genomes powering 1:1 personalization", color: "#1C69E3" },
  { metric: "8M", category: "Neo Banking", description: "Pay-day loans in less than 6 months for a Neo banking initiative in Tanzania", coloredLead: "Pay-day loans in less than 6 months", color: "#FF3F42" },
]

export function CaseStudiesSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Group 1410104295 / 1410104294 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4" style={{ gap: "12px" }}>
              <span
                className="shrink-0"
                style={{
                  minWidth: "32px",
                  height: "1px",
                  background: "rgba(10, 10, 10, 0.4)",
                }}
              />
              <span
                className="font-mono uppercase flex items-center"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "1.2px",
                  color: "rgba(10, 10, 10, 0.7)",
                }}
              >
                Impact
              </span>
            </div>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                background: "linear-gradient(90deg, #CF57C8 0%, #DE8900 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Impact Stories — Built. Deployed. Delivered.
            </h2>
          </div>
          <p
            className="text-left max-w-[415px]"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#737373",
            }}
          >
            Across our global client base, we&apos;ve delivered transformational outcomes powered by AI-led personalization, data science, and autonomous decisioning.
          </p>
        </div>

        {/* Cards grid - Group 1410104296: Background 1317×699, Article 439×224 per CSS reference */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px overflow-hidden box-border"
          style={{ maxWidth: "1317px", margin: "0 auto" }}
        >
          {impactCards.map((card, index) => (
            <article
              key={index}
              className="bg-white relative w-full box-border"
              style={{
                background: "#FFFFFF",
                width: "100%",
                minHeight: "224px",
                height: "224px",
              }}
            >
              {/* Overlay: 4×4px, left 32px, top 37.5px - rgba(115, 115, 115, 0.4) */}
              <span
                className="absolute rounded-full"
                style={{
                  width: "4px",
                  height: "4px",
                  left: "32px",
                  top: "37.5px",
                  background: "rgba(115, 115, 115, 0.4)",
                  borderRadius: "9999px",
                }}
              />
              {/* Category: left 44px, top 32px, Geist Mono 10px/15px, letter-spacing 1px, uppercase, #737373 */}
              <span
                className="absolute flex items-center uppercase"
                style={{
                  left: "44px",
                  top: "32px",
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "15px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#737373",
                }}
              >
                {card.category}
              </span>
              {/* Metric: left 32px; top 76px (7%, 17%) or 80px (rest); Geist 300, 60px; color per card */}
              <span
                className="absolute flex items-center"
                style={{
                  left: "32px",
                  top: index <= 1 ? "76px" : "80px",
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  fontStyle: "normal",
                  fontWeight: 300,
                  fontSize: "60px",
                  lineHeight: index <= 1 ? "68px" : "60px",
                  color: card.color,
                }}
              >
                {card.metric}
              </span>
              {/* Heading 3: colored lead phrase in card color, rest in black; normal weight (no bold) */}
              <h3
                className="absolute"
                style={{
                  left: "32px",
                  top: "144px",
                  right: "32px",
                  fontFamily: "'Poppins', sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#0A0A0A",
                }}
              >
                <span style={{ color: card.color }}>{card.coloredLead}</span>
                {card.description.slice(card.coloredLead.length).trim() && (
                  <span> {card.description.slice(card.coloredLead.length).trim()}</span>
                )}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
