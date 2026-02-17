"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { getIndustryBankingConfig } from "../config"
import { IndustryBankingContent } from "../IndustryBankingContent"

export default function IndustryBankingBankPage() {
  const params = useParams()
  const bank = typeof params?.bank === "string" ? params.bank : undefined
  const config = getIndustryBankingConfig(bank)

  if (!config) notFound()

  return <IndustryBankingContent config={config} backToBankingBase />
}
