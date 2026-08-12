import { Hero } from '../components/Hero/Hero'
import { FeaturedGrid } from '../components/FeaturedGrid/FeaturedGrid'
import { Neighborhoods } from '../components/Neighborhoods/Neighborhoods'
import { Testimonials } from '../components/Testimonials/Testimonials'
import { CTABanner } from '../components/CTABanner/CTABanner'

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGrid />
      <Neighborhoods />
      <Testimonials />
      <CTABanner />
    </>
  )
}
