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
  { category: "Workflows & Automations", title: "Ask Happy Customers for Referrals", author: "BY CRAYON DATA", businessFunction: "Customer Experience" },
  { category: "Workflows & Automations", title: "Ask Happy Customers for Reviews", author: "BY CRAYON DATA", businessFunction: "Customer Experience" },
  { category: "AI Research Prompts", title: "Assign as B2B or B2C", author: "BY CRAYON DATA", businessFunction: "Data Accelerator" },
  { category: "Workflows & Automations", title: "Automatically Hit No-Shows", author: "BY CRAYON DATA", businessFunction: "Operations" },
  { category: "Workflows & Automations", title: "Call When Email is Opened or Clicked", author: "BY CRAYON DATA", businessFunction: "Customer Experience" },
  { category: "Sequences", title: "Congratulate on New Role", author: "BY CRAYON DATA", businessFunction: "CXO" },
  { category: "Sequences", title: "Conversation Starter Cold Calling Script", author: "By Nick Ross, Senior SDR Manager at Klue", businessFunction: "Customer Experience" },
  { category: "Sequences", title: "Convert Inbound Leads", author: "BY CRAYON DATA", businessFunction: "Data Accelerator" },
  { category: "Workflows & Automations", title: "Create Deal When Contact Is Interested", author: "BY CRAYON DATA", businessFunction: "Operations" },
  { category: "Conversations", title: "Demo Call Scorecard", author: "BY CRAYON DATA", businessFunction: "CXO" },
  { category: "Conversations", title: "Discovery Call Scorecard", author: "BY CRAYON DATA", businessFunction: "Risk & Compliance" },
  { category: "Workflows & Automations", title: "End Sequence for Outdated Contacts", author: "BY CRAYON DATA", businessFunction: "Operations" },
]

const DEFAULT_FEATURES_STR =
  "Everything you need to analyze financial documents and drive smarter investment decisions;" +
  "Conversational Querying - Ask questions about earnings data in plain English and get synthesized answers;" +
  "Document Processing - Automatically extracts key metrics from earnings PDFs, presentations, and transcripts;" +
  "Comparative Analysis - Compares financial metrics across banks, quarters, and business segments;" +
  "Executive Synthesis - Generates board-ready presentations from insights across earnings cycles;" +
  "Trend Detection - Identifies patterns and anomalies in financial performance data;"

const DEFAULT_DESCRIPTION =
  "The Conversational AI Assistant for Banking enables seamless customer engagement across chat, voice and web. Tailored to banking, it understands industry terminology, workflows, and compliance needs. It supports use cases like account inquiries, transactions, ATM locators, customer query resolution. With rapid deployment frameworks, banks can go live in weeks, not months. Built-in integrations streamline operations and reduce contact center load. The result: 24/7 personalized, secure, and cost-efficient digital banking experiences."

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
      { category: "Conversations", title: "HDFC Loan Eligibility Check", author: "BY CRAYON DATA", businessFunction: "Customer Experience" },
      { category: "Workflows & Automations", title: "HDFC KYC Status Tracker", author: "BY CRAYON DATA", businessFunction: "Risk & Compliance" },
      { category: "AI Research Prompts", title: "Portfolio Summary for HDFC Wealth", author: "BY CRAYON DATA", businessFunction: "CXO" },
    ],
    businessFunctions: DEFAULT_BUSINESS_FUNCTIONS,
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
      { category: "Sequences", title: "SIB CASA Activation Follow-up", author: "BY CRAYON DATA", businessFunction: "Operations" },
      { category: "Conversations", title: "SIB Complaint Status", author: "BY CRAYON DATA", businessFunction: "Customer Experience" },
      { category: "Workflows & Automations", title: "SIB FD Renewal Reminder", author: "BY CRAYON DATA", businessFunction: "Data Accelerator" },
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
