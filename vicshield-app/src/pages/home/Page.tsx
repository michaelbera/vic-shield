import Banner from './Banner'
import Characteristics from './Characteristics'
import Features from './Features'
import Pricing from './Pricing'
import Roadmap from './Roadmap'
import Solutions from './Solutions'

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <Banner />
      <Characteristics />
      <Solutions />
      <Features />
      <Roadmap />
      <Pricing />
    </div>
  )
}
