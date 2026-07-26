import Build from './components/Build'
import ContactModal from './components/ContactModal'
import CTA from './components/CTA'
import { CursorTrail, ScrollProgress } from './components/Effects'
import Engagements from './components/Engagements'
import { ErrorBoundary } from './components/ErrorBoundary'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Industries from './components/Industries'
import Manifesto from './components/Manifesto'
import Metrics from './components/Metrics'
import Model from './components/Model'
import Nav from './components/Nav'
import Process from './components/Process'
import Proof from './components/Proof'
import Showcase from './components/Showcase'

export default function App() {
  return (
    <div className="grain relative min-h-screen bg-white">
      <ErrorBoundary>
        <ScrollProgress />
      </ErrorBoundary>
      <ErrorBoundary>
        <CursorTrail />
      </ErrorBoundary>
      <Nav />
      <main className="relative">
        <Hero />
        <Industries />
        <Metrics />
        <Showcase />
        <Manifesto />
        <Build />
        <Process />
        <Model />
        <Proof />
        <Engagements />
        <CTA />
      </main>
      <Footer />
      <ContactModal />
    </div>
  )
}
