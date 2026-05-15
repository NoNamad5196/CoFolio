import { useReveal } from '../hooks/useReveal'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/landing/HeroSection'
import { ProblemSection } from '../components/landing/ProblemSection'
import { FeatureSection } from '../components/landing/FeatureSection'
import { BeforeAfterSection } from '../components/landing/BeforeAfterSection'
import { WorkflowSection } from '../components/landing/WorkflowSection'
import { TemplateSection } from '../components/landing/TemplateSection'
import { DashboardPreviewSection } from '../components/landing/DashboardPreviewSection'
import { PortfolioScoreSection } from '../components/landing/PortfolioScoreSection'
import { ShowcaseSection } from '../components/landing/ShowcaseSection'
import { PricingSection } from '../components/landing/PricingSection'
import { FAQSection } from '../components/landing/FAQSection'
import { FinalCTASection } from '../components/landing/FinalCTASection'

export default function LandingPage() {
  useReveal()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeatureSection />
        <BeforeAfterSection />
        <WorkflowSection />
        <TemplateSection />
        <DashboardPreviewSection />
        <PortfolioScoreSection />
        <ShowcaseSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
