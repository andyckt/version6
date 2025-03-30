import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'

export default function Booklet() {
  return (
    <main className="pb-16 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-lg font-medium">My Booklet</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="container-app py-4">
          {/* New booklet interface will go here */}
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  )
} 