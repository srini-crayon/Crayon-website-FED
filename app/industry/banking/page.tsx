"use client"

import { getIndustryBankingConfig } from "./config"
import { IndustryBankingContent } from "./IndustryBankingContent"

export default function IndustryBankingPage() {
  const config = getIndustryBankingConfig("generic")!
  return <IndustryBankingContent config={config} backToBankingBase={false} />
}
