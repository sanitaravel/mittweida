import { Link } from 'wouter'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

type TextSize = 'small' | 'medium' | 'large'
type Language = 'en' | 'de'

const Settings = () => {
  const [textSize, setTextSize] = useState<TextSize>('medium')
  const [audioNarration, setAudioNarration] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [language, setLanguage] = useState<Language>('en')

  const handleSave = () => {
    // Save settings to localStorage or context
    console.log('Settings saved:', { textSize, audioNarration, highContrast, language })
    // Show success message or navigate back
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="p-6 border-b border-sandstone/20">
        <h1 className="text-display text-2xl font-bold text-charcoal">
          Settings
        </h1>
      </header>

      {/* Settings Content */}
      <div className="p-6 space-y-8">
        {/* Text Size */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            Text Size:
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {(['small', 'medium', 'large'] as TextSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`p-4 rounded-xl border-2 transition-colors capitalize ${
                  textSize === size
                    ? 'border-sage bg-sage text-white'
                    : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-cream'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Narration */}
        <div className="flex justify-between items-center">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            Enable Audio Narration:
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={audioNarration}
              onChange={(e) => setAudioNarration(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-14 h-8 rounded-full transition-colors ${
              audioNarration ? 'bg-sage' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform m-1 ${
                audioNarration ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>

        {/* High Contrast Mode */}
        <div className="flex justify-between items-center">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            High Contrast Mode:
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-14 h-8 rounded-full transition-colors ${
              highContrast ? 'bg-sage' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform m-1 ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            Language:
          </h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full p-4 rounded-xl border-2 border-charcoal bg-white text-charcoal text-lg focus:ring-2 focus:ring-sage focus:border-sage"
          >
            <option value="en">English</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-cream border-t border-sandstone/20 space-y-4">
        <button
          onClick={handleSave}
          className="btn-primary"
        >
          Save Settings
        </button>
        
        <Link href="/">
          <button className="btn-secondary">
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              Back
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Settings
