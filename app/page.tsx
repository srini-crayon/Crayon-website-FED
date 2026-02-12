import { HeroSection } from "@/components/hero-section"
import { ChallengeSection } from "@/components/challenge-section"
import { FoundationSection } from "@/components/foundation-section"
import { ProductsSection } from "@/components/products-section"
import { ClientsSection } from "@/components/clients-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { LiveWalkthroughSection } from "@/components/live-walkthrough-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { SocialSection } from "@/components/social-section"
import { SecuritySection } from "@/components/security-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <ProductsSection />
      <ChallengeSection />
      <FoundationSection />
      <ClientsSection />
      <UseCasesSection />
      <WhyChooseSection />
      <LiveWalkthroughSection />
      <CaseStudiesSection />
      <SocialSection />
      <SecuritySection />
      <CTASection />
    </main>
  )
}
