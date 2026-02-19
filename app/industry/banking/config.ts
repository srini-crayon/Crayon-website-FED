/**
 * Industry Banking config per bank (Option A: frontend-only).
 * Used for /industry/banking (generic), /industry/banking/hdfc, /industry/banking/sib.
 */

export type BankSlug = "generic" | "hdfc" | "sib"

export type IndustryBankingCard = {
  category: string
  title: string
  author: string
  businessFunction: string
  /** Short description shown on card hover */
  description?: string
  /** Agent ID from API – when set, card links to /agents/[id] */
  id?: string
}

export type PartnershipPhase = {
  timeframe: string
  title: string
  titleColor: string
  bgColor: string
  bullets: { text: string; bold: string[] }[]
  subBullets?: string[]
}

export type PartnershipConfig = {
  title: string
  subtitle?: string
  phases: PartnershipPhase[]
}

export type IndustryBankingConfig = {
  slug: BankSlug
  /** Short label for breadcrumb and h1, e.g. "Banking", "HDFC", "SIB" */
  label: string
  /** Full page title, e.g. "AI for Banking" */
  title: string
  /** Hero description paragraph */
  description: string
  /** Semicolon-separated: first segment = features heading, rest = "Title - Description" items */
  featuresStr: string
  /** Agent/template cards for this bank */
  cards: IndustryBankingCard[]
  /** Business function filter options (first is "All") */
  businessFunctions: readonly string[]
  /** When set, show Partnership section with this title and phases; when undefined, hide section */
  partnership?: PartnershipConfig
}

const DEFAULT_BUSINESS_FUNCTIONS = [
  "All",
  "CXO",
  "Data Accelerator",
  "Customer Experience",
  "Operations",
  "Risk & Compliance",
] as const

const DEFAULT_CARDS: IndustryBankingCard[] = [
  { category: "Workflows & Automations", title: "Ask Happy Customers for Referrals", author: "BY CRAYON DATA", businessFunction: "Customer Experience", description: "Trigger referral requests from satisfied customers and track who recommends your product." },
  { category: "Workflows & Automations", title: "Ask Happy Customers for Reviews", author: "BY CRAYON DATA", businessFunction: "Customer Experience", description: "Automatically ask happy customers for reviews and ratings at the right moment." },
  { category: "AI Research Prompts", title: "Assign as B2B or B2C", author: "BY CRAYON DATA", businessFunction: "Data Accelerator", description: "Classify and route leads or contacts as B2B or B2C for targeted workflows." },
  { category: "Workflows & Automations", title: "Automatically Hit No-Shows", author: "BY CRAYON DATA", businessFunction: "Operations", description: "Follow up with no-show contacts and reschedule or re-engage automatically." },
  { category: "Workflows & Automations", title: "Call When Email is Opened or Clicked", author: "BY CRAYON DATA", businessFunction: "Customer Experience", description: "Trigger a call or task when a prospect opens or clicks your email for timely outreach." },
  { category: "Sequences", title: "Congratulate on New Role", author: "BY CRAYON DATA", businessFunction: "CXO", description: "Send personalized congratulations when contacts change roles for relationship building." },
  { category: "Sequences", title: "Conversation Starter Cold Calling Script", author: "By Nick Ross, Senior SDR Manager at Klue", businessFunction: "Customer Experience", description: "Cold calling script and talking points to start conversations with prospects." },
  { category: "Sequences", title: "Convert Inbound Leads", author: "BY CRAYON DATA", businessFunction: "Data Accelerator", description: "Nurture and convert inbound leads with sequenced touchpoints and follow-ups." },
  { category: "Workflows & Automations", title: "Create Deal When Contact Is Interested", author: "BY CRAYON DATA", businessFunction: "Operations", description: "Create a deal or opportunity when a contact shows buying intent." },
  { category: "Conversations", title: "Demo Call Scorecard", author: "BY CRAYON DATA", businessFunction: "CXO", description: "Score and evaluate demo calls for consistency and coaching." },
  { category: "Conversations", title: "Discovery Call Scorecard", author: "BY CRAYON DATA", businessFunction: "Risk & Compliance", description: "Assess discovery calls with structured scorecards for quality and compliance." },
  { category: "Workflows & Automations", title: "End Sequence for Outdated Contacts", author: "BY CRAYON DATA", businessFunction: "Operations", description: "Automatically end sequences for contacts that are no longer relevant or engaged." },
]

const DEFAULT_FEATURES_STR =
  "Everything you need to analyze financial documents and drive smarter investment decisions;" +
  "Conversational Querying - Ask questions about earnings data in plain English and get synthesized answers;" +
  "Document Processing - Automatically extracts key metrics from earnings PDFs, presentations, and transcripts;" +
  "Comparative Analysis - Compares financial metrics across banks, quarters, and business segments;" +
  "Executive Synthesis - Generates board-ready presentations from insights across earnings cycles;" +
  "Trend Detection - Identifies patterns and anomalies in financial performance data;"

const DEFAULT_DESCRIPTION =
  "A conversational AI built for banking that connects with customers on chat, voice, and web. It speaks your language—industry terms, workflows, and compliance—and handles account inquiries, transactions, ATM locators, and support. Go live in weeks with ready-made integrations that cut contact center load and deliver secure, personalized, 24/7 digital banking at lower cost."

const HDFC_PARTNERSHIP_PHASES: PartnershipPhase[] = [
  {
    timeframe: "2017-2020",
    title: "Launch Phase",
    titleColor: "#1e3a5f",
    bgColor: "#e8f4fc",
    bullets: [
      { text: "Started working with HDFC Bank in 2017 for marketing campaigns through emails on CC customer base", bold: ["2017"] },
      { text: "Did multiple rounds of UAT on customer engagement, customer spending uplift, Choice recommendations", bold: [] },
      { text: "Delivered a 11% uplift in engagement", bold: ["11% uplift"] },
      { text: "With the success of the launch, worked with the bank to increase their Lifestyle spends", bold: [] },
      { text: "Project scope: Personalization for the CC base of 20M+ customers", bold: ["20M+"] },
    ],
  },
  {
    timeframe: "2020-2025",
    title: "Growth Phase",
    titleColor: "#9e2a6e",
    bgColor: "#fce8f4",
    bullets: [
      { text: "Signed 1st contract for personalization of CC in March 2020 with HDFC Bank.", bold: ["1st contract", "March 2020"] },
      { text: "Consistently delivered ~300 - 500 CR INR in incremental offer spends MoM for 5 years.", bold: ["5 years"] },
      { text: "Launched Festive treats in 2023, 2024 and 2025. Delivered uplift of 7% - 8% in incremental spends (~2000-3000 CR INR) YoY hosting more than 9000+ merchants offers", bold: ["2023", "2024", "2025", "7% - 8%", "9000+"] },
      { text: "Launched multiple campaigns across portfolios and bank products", bold: [] },
      { text: "Delivered incremental offer spends of 4000 - 6000 CR INR YOY for 5 years", bold: ["5 years"] },
    ],
  },
  {
    timeframe: "2025",
    title: "Expansion Phase",
    titleColor: "#5c3d8a",
    bgColor: "#f3e8fc",
    bullets: [
      { text: "Signed 2ND contract with the bank for DC personalization in Jul 2025.", bold: ["2ND contract", "Jul 2025"] },
      { text: "Launched 2 use cases for DC project within 2 months of the contract start date.", bold: ["2 use cases", "2 months"] },
      { text: "Signed 3RD contract with the bank for unification of all their digital properties in Aug 2025.", bold: ["3RD contract", "Aug 2025"] },
      { text: "Smartbuy \"For You\": Creation of customer genomes and processing personalization for 70M+ Bank customers", bold: ["personalization", "70M+"] },
      { text: "1.2M customer visits served per month and 5% lift on engagement MoM", bold: ["1.2M", "5%"] },
    ],
  },
  {
    timeframe: "2026",
    title: "Future Phase",
    titleColor: "#b45309",
    bgColor: "#fef3e8",
    bullets: [
      { text: "New Projects in Discussion", bold: [] },
    ],
    subBullets: ["UPM", "Travel AI", "Calendar 360"],
  },
]

/** Per-bank config. Add or edit entries for demo pitch. */
export const INDUSTRY_BANKING_CONFIGS: Record<BankSlug, IndustryBankingConfig> = {
  generic: {
    slug: "generic",
    label: "Banking",
    title: "AI for Banking",
    description: DEFAULT_DESCRIPTION,
    featuresStr: DEFAULT_FEATURES_STR,
    cards: DEFAULT_CARDS,
    businessFunctions: DEFAULT_BUSINESS_FUNCTIONS,
  },
  hdfc: {
    slug: "hdfc",
    label: "HDFC",
    title: "AI for HDFC",
    description:
      "Conversational AI tailored for HDFC Bank: seamless customer engagement across chat, voice, and web. Supports account inquiries, transactions, loan servicing, and compliance. Rapid deployment with built-in integrations to reduce contact center load and deliver 24/7 personalized, secure experiences.",
    featuresStr: DEFAULT_FEATURES_STR,
    cards: [
      ...DEFAULT_CARDS.slice(0, 6),
      { category: "Conversations", title: "HDFC Loan Eligibility Check", author: "BY CRAYON DATA", businessFunction: "Customer Experience", description: "Check loan eligibility for HDFC products with instant criteria and documentation guidance." },
      { category: "Workflows & Automations", title: "HDFC KYC Status Tracker", author: "BY CRAYON DATA", businessFunction: "Risk & Compliance", description: "Track and update KYC status for HDFC customers with automated reminders." },
      { category: "AI Research Prompts", title: "Portfolio Summary for HDFC Wealth", author: "BY CRAYON DATA", businessFunction: "CXO", description: "Generate portfolio summaries and insights for HDFC wealth clients." },
    ],
    businessFunctions: DEFAULT_BUSINESS_FUNCTIONS,
    partnership: {
      title: "Crayon <> HDFC Bank – 8 Year Partnership",
      subtitle: "From launch to expansion — key milestones and impact over eight years of collaboration.",
      phases: HDFC_PARTNERSHIP_PHASES,
    },
  },
  sib: {
    slug: "sib",
    label: "SIB",
    title: "AI for SIB",
    description:
      "Conversational AI for State Bank of India (SIB): enable seamless customer engagement across channels. Tailored to Indian banking terminology, workflows, and regulatory needs. Use cases include account inquiries, fund transfers, branch/ATM locators, and customer query resolution with rapid deployment.",
    featuresStr: DEFAULT_FEATURES_STR,
    cards: [
      ...DEFAULT_CARDS.slice(0, 5),
      { category: "Sequences", title: "SIB CASA Activation Follow-up", author: "BY CRAYON DATA", businessFunction: "Operations", description: "Follow up on CASA activation for SIB customers and nudge incomplete activations." },
      { category: "Conversations", title: "SIB Complaint Status", author: "BY CRAYON DATA", businessFunction: "Customer Experience", description: "Check and communicate complaint status for SIB customers." },
      { category: "Workflows & Automations", title: "SIB FD Renewal Reminder", author: "BY CRAYON DATA", businessFunction: "Data Accelerator", description: "Send FD renewal reminders and options before maturity for SIB customers." },
      ...DEFAULT_CARDS.slice(8, 12),
    ],
    businessFunctions: DEFAULT_BUSINESS_FUNCTIONS,
  },
}

const VALID_BANK_SLUGS: BankSlug[] = ["generic", "hdfc", "sib"]

export function getIndustryBankingConfig(bank: string | undefined): IndustryBankingConfig | null {
  if (!bank || !VALID_BANK_SLUGS.includes(bank as BankSlug)) return null
  return INDUSTRY_BANKING_CONFIGS[bank as BankSlug] ?? null
}

export function getIndustryBankingConfigOrThrow(bank: string | undefined): IndustryBankingConfig {
  const config = getIndustryBankingConfig(bank)
  if (!config) throw new Error(`Unknown industry banking slug: ${bank}`)
  return config
}
