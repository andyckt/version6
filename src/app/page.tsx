import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import ContentGrid from '@/components/ContentGrid'
import PageTransition from '@/components/PageTransition'

export default function Home() {
  return (
    <main className="pb-16"> {/* Add padding bottom for the navigation */}
      <Header />
      <PageTransition>
        <div className="container-app">
          <ContentGrid />
        </div>
      </PageTransition>
      <Navigation />
    </main>
  )
} 