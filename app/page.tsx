import { HeroSection } from "@/components/hero-section"
import { StatsBar } from "@/components/stats-bar"
import { ChallengeSection } from "@/components/challenge-section"
import { FoundationSection } from "@/components/foundation-section"
import { ProductsSection } from "@/components/products-section"
import { ClientsSection } from "@/components/clients-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { BlogSection } from "@/components/blog-section"
import { SocialSection } from "@/components/social-section"
import { CTASection } from "@/components/cta-section"
import { SecuritySection } from "@/components/security-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <StatsBar />
      <ChallengeSection />
      <FoundationSection />
      <ProductsSection />
      <ClientsSection />
      <WhyChooseSection />
      <UseCasesSection />
      <CaseStudiesSection />
      <BlogSection />
      <SocialSection />
      <SecuritySection />
      <CTASection />
    </main>
  )
}
