import Build from './components/Build'
import ContactModal from './components/ContactModal'
import CTA from './components/CTA'
import { ScrollProgress } from './components/Effects'
import Engagements from './components/Engagements'
import { ErrorBoundary } from './components/ErrorBoundary'
import FirstYear from './components/FirstYear'
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
      <Nav />
      <main className="relative">
        <Hero />
        <Metrics />
        <Showcase />
        <Manifesto />
        <Process />
        <FirstYear />
        <Build />
        <Model />
        <Proof />
        <Engagements />
        {/* A quiet "who this is for" band, right before the close */}
        <Industries />
        <CTA />
      </main>
      <Footer />
      <ContactModal />
    </div>
  )
}
