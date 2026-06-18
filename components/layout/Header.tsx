import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default function Header() {
  const currentDate = new Date().toLocaleDateString('ne-NP', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-red-700 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>{currentDate}</span>
          <div className="flex items-center space-x-3">
            <a href="tel:+977082590000" className="flex items-center gap-1 hover:text-yellow-300">
              <Phone size={12} /> +977-082-590000
            </a>
            <a href="mailto:info@highwayexpress.com.np" className="flex items-center gap-1 hover:text-yellow-300">
              <Mail size={12} /> info@highwayexpress.com.np
            </a>
          </div>
        </div>
      </div>

      {/* Logo & Social */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">HE</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-700 leading-none">
                  Highway Express
                </h1>
                <p className="text-xs text-gray-500 tracking-widest uppercase">
                  हाइवे एक्सप्रेस • Dang, Nepal
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Ad space / Social */}
        <div className="hidden md:flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com/highwayexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://youtube.com/@highwayexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800"
            >
              <YoutubeIcon />
            </a>
            <a
              href="https://twitter.com/highwayexpress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:text-sky-700"
            >
              <TwitterIcon />
            </a>
          </div>
          <div className="bg-gray-100 px-4 py-1 text-xs text-gray-500 rounded">
            विज्ञापनका लागि सम्पर्क गर्नुहोस्
          </div>
        </div>
      </div>
    </header>
  )
}
