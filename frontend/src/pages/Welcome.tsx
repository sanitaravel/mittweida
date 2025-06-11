import { Link } from 'wouter'
import { Settings } from 'lucide-react'

const Welcome = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">      {/* Header with Settings */}
      <header className="flex justify-end items-center p-6">
        <Link href="/settings">
          <button className="p-3 rounded-full hover:bg-beige transition-colors">
            <Settings size={28} className="text-charcoal" />
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pb-20">
        {/* Welcome Text */}
        <div className="text-center mb-16">
          <h1 className="text-display text-5xl md:text-6xl font-bold text-charcoal mb-4">
            Welcome to Mittweida.
          </h1>
          <p className="text-body text-xl md:text-2xl text-charcoal/80">
            Let's explore at your pace.
          </p>
        </div>

        {/* Question and Buttons */}
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-display text-3xl md:text-4xl text-center text-charcoal mb-8">
            What would you like to do?
          </h2>
          
          <div className="space-y-4">
            <Link href="/routes">
              <button className="btn-primary">
                Select Route
              </button>
            </Link>
            
            <Link href="/create">
              <button className="btn-secondary">
                Create Route
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Welcome
