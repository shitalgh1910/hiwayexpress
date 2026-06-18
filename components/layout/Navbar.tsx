'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'

const navItems = [
  { label: 'गृहपृष्ठ', labelEn: 'Home', href: '/' },
  { label: 'दाङ समाचार', labelEn: 'Dang News', href: '/categories/dang-news' },
  { label: 'नेपाल समाचार', labelEn: 'Nepal News', href: '/categories/nepal-news' },
  { label: 'राजनीति', labelEn: 'Politics', href: '/categories/politics' },
  { label: 'समाज', labelEn: 'Society', href: '/categories/society' },
  { label: 'अर्थ', labelEn: 'Economy', href: '/categories/economy' },
  { label: 'शिक्षा', labelEn: 'Education', href: '/categories/education' },
  { label: 'स्वास्थ्य', labelEn: 'Health', href: '/categories/health' },
  { label: 'खेलकुद', labelEn: 'Sports', href: '/categories/sports' },
  { label: 'मनोरञ्जन', labelEn: 'Entertainment', href: '/categories/entertainment' },
  { label: 'अन्तर्वार्ता', labelEn: 'Interviews', href: '/categories/interviews' },
  { label: 'मत / विचार', labelEn: 'Opinion', href: '/categories/opinion' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-[#1a1a2e] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm px-3 py-2 rounded hover:bg-red-700 transition-colors whitespace-nowrap font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center ml-auto">
            <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोज्नुहोस्..."
                className="bg-transparent text-white placeholder-gray-300 text-sm outline-none w-32"
              />
              <button type="submit" className="ml-2 text-gray-300 hover:text-white">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            className="lg:hidden ml-auto p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#1a1a2e] border-t border-gray-700 px-4 pb-4">
          <form onSubmit={handleSearch} className="py-3">
            <div className="flex items-center bg-white/10 rounded-full px-3 py-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोज्नुहोस्..."
                className="bg-transparent text-white placeholder-gray-300 text-sm outline-none flex-1"
              />
              <button type="submit">
                <Search size={16} className="text-gray-300" />
              </button>
            </div>
          </form>
          <div className="grid grid-cols-2 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm px-3 py-2 rounded hover:bg-red-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
