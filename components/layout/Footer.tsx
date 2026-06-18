import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default function Footer() {
  const categories = [
    { label: 'दाङ समाचार', href: '/categories/dang-news' },
    { label: 'नेपाल समाचार', href: '/categories/nepal-news' },
    { label: 'राजनीति', href: '/categories/politics' },
    { label: 'समाज', href: '/categories/society' },
    { label: 'अर्थतन्त्र', href: '/categories/economy' },
    { label: 'शिक्षा', href: '/categories/education' },
    { label: 'स्वास्थ्य', href: '/categories/health' },
    { label: 'खेलकुद', href: '/categories/sports' },
    { label: 'मनोरञ्जन', href: '/categories/entertainment' },
    { label: 'अन्तर्वार्ता', href: '/categories/interviews' },
    { label: 'मत / विचार', href: '/categories/opinion' },
  ]

  return (
    <footer className="bg-[#1a1a2e] text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">HE</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Highway Express</h3>
                <p className="text-xs text-gray-400">हाइवे एक्सप्रेस</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Highway Express दाङ, नेपालको एक विश्वसनीय डिजिटल समाचार पोर्टल हो।
              स्थानीय, राष्ट्रिय र अन्तर्राष्ट्रिय समाचार तपाईंसम्म पुर्‍याउने हाम्रो प्रतिबद्धता छ।
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/highwayexpress" target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com/@highwayexpress" target="_blank" rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300">
                <YoutubeIcon />
              </a>
              <a href="https://twitter.com/highwayexpress" target="_blank" rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">श्रेणीहरू</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm hover:text-red-400 transition-colors">
                    » {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">सम्पर्क</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-red-400 flex-shrink-0" />
                <span>घोराही उप-महानगरपालिका,<br />दाङ, लुम्बिनी प्रदेश, नेपाल</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-red-400 flex-shrink-0" />
                <a href="tel:+977082590000" className="hover:text-white">+977-082-590000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-red-400 flex-shrink-0" />
                <a href="mailto:info@highwayexpress.com.np" className="hover:text-white">
                  info@highwayexpress.com.np
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="text-white font-medium mb-2">उपयोगी लिंकहरू</h5>
              <ul className="space-y-1 text-sm">
                <li><Link href="/about" className="hover:text-red-400">हाम्रो बारेमा</Link></li>
                <li><Link href="/about#contact" className="hover:text-red-400">सम्पर्क गर्नुहोस्</Link></li>
                <li><Link href="/admin" className="hover:text-red-400">एडमिन</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Highway Express. सर्वाधिकार सुरक्षित।
          <span className="ml-2">सञ्चालक: KP Ghimire</span>
        </div>
      </div>
    </footer>
  )
}
