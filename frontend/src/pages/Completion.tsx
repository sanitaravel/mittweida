import { Link } from 'wouter'
import { Download, Mail, Printer, RotateCcw, LogOut } from 'lucide-react'

const Completion = () => {
  const tourStats = {
    name: 'Short Historical Walk',
    stops: 5,
    duration: '30 min',
    date: new Date().toLocaleDateString()
  }

  const handleDownloadPDF = () => {
    // Implement PDF download
    console.log('Downloading PDF...')
  }

  const handleEmailJournal = () => {
    // Implement email functionality
    console.log('Emailing journal...')
  }

  const handlePrint = () => {
    // Implement print functionality
    window.print()
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Congratulations Section */}
        <div className="text-center mb-12">
          <h1 className="text-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Congratulations!
          </h1>
          <div className="text-body text-xl text-charcoal/80 space-y-2">
            <p>You completed the tour:</p>
            <p className="font-semibold">
              "{tourStats.name}" • {tourStats.stops} stops • {tourStats.duration}
            </p>
            <p className="text-lg text-charcoal/60">
              Completed on {tourStats.date}
            </p>
          </div>
        </div>

        {/* Travel Journal Section */}
        <div className="w-full max-w-md mb-12">
          <h2 className="text-display text-2xl font-semibold text-charcoal text-center mb-6">
            Your Travel Journal
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            <button
              onClick={handleDownloadPDF}
              className="flex flex-col items-center gap-3 p-6 bg-beige rounded-xl border border-sandstone/20 hover:bg-sandstone/20 transition-colors"
            >
              <Download size={32} className="text-charcoal" />
              <span className="text-body text-sm font-medium text-charcoal">PDF</span>
            </button>
            
            <button
              onClick={handleEmailJournal}
              className="flex flex-col items-center gap-3 p-6 bg-beige rounded-xl border border-sandstone/20 hover:bg-sandstone/20 transition-colors"
            >
              <Mail size={32} className="text-charcoal" />
              <span className="text-body text-sm font-medium text-charcoal">Email</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-3 p-6 bg-beige rounded-xl border border-sandstone/20 hover:bg-sandstone/20 transition-colors"
            >
              <Printer size={32} className="text-charcoal" />
              <span className="text-body text-sm font-medium text-charcoal">Print</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/tour/historical">
              <button className="btn-secondary">
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw size={20} />
                  Restart Tour
                </div>
              </button>
            </Link>
            
            <Link href="/">
              <button className="btn-primary">
                <div className="flex items-center justify-center gap-2">
                  <LogOut size={20} />
                  Exit
                </div>
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-body text-sm text-charcoal/60">
          Thank you for exploring Mittweida with us!
        </p>
      </footer>
    </div>
  )
}

export default Completion
