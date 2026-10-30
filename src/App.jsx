import React, { useState } from 'react'
import { 
  Menu, 
  X
} from 'lucide-react'

// Authentic PayPal Double-P Logo SVG Component
function PayPalLogo({ className = "h-8 w-auto" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 115 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PayPal"
    >
      <path 
        fill="#003087" 
        d="M86.7 15.6C79.8 7.3 67.5 4.3 52.3 4.3H18.9c-2.4 0-4.5 1.7-4.9 4.1L.1 94.6c-.3 2 .1 3.9 1.4 5.3 1.2 1.4 3 2.1 4.9 2.1h23.2l5.7-36.4-.2 1.1c.4-2.4 2.5-4.1 4.9-4.1h10.9c25.4 0 45.3-10.3 51.1-40.2.2-1.3.4-2.5.5-3.6-2.5-1.5-6.6-2.6-10.8-3.2z"
      />
      <path 
        fill="#0079C1" 
        d="M102.7 38.6c-5.8 29.9-25.7 40.2-51.1 40.2h-10.9c-2.4 0-4.5 1.7-4.9 4.1l-6.8 43.1c-.3 1.9.1 3.7 1.3 5 1.1 1.2 2.7 1.9 4.5 1.9h20.6c2.1 0 3.9-1.5 4.3-3.6l.1-.8 4.7-29.8.3-1.8c.4-2.1 2.2-3.6 4.3-3.6h2.7c22.1 0 39.4-9 44.5-35 2.1-10.9.3-19.6-4.6-25.7-1.1 2-2.6 4.1-4.6 6z"
      />
      <path 
        fill="#00457C" 
        d="M98.1 32.6c-1.3-.2-2.7-.4-4.2-.4H56.5c-2.4 0-4.5 1.7-4.9 4.1l-9 57.3-.3 1.8c.4-2.4 2.5-4.1 4.9-4.1h10.9c25.4 0 45.3-10.3 51.1-40.2.2-1.3.4-2.5.5-3.6-2.7-6.9-8.1-12.1-16.7-14.9z"
      />
    </svg>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Business') // Default as in Photo 2
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { title: 'Personal', href: '#' },
    { title: 'Business', href: '#' },
    { title: 'Partners', href: '#' },
    { title: 'Useful Info', href: '#' },
  ]

  // Content configuration for each segmented mode
  const tabContent = {
    Personal: {
      title: 'PayPal for You',
      subtitle: 'The simple, secure way to pay, send, and spend',
      desc: 'Join hundreds of millions of people who trust PayPal to shop safely, send money to friends, and split bills worldwide.',
      primaryBtn: 'Sign Up for Free',
      secondaryBtn: 'Explore Personal',
    },
    Business: {
      // Exactly as in Photo 2
      title: 'PayPal Open',
      subtitle: 'One platform for your business needs',
      desc: 'PayPal Open unifies your PayPal business solutions to help you get paid, get growing, and get ahead.',
      primaryBtn: 'Sign Up',
      secondaryBtn: 'Contact Sales',
    },
  }

  const current = tabContent[activeTab]

  return (
    <div className="min-h-screen bg-white text-[#0c0c0d] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section: Logo & Nav items */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <a href="#" className="flex items-center group" aria-label="PayPal Home">
                <PayPalLogo className="h-9 w-auto transform transition duration-200 group-hover:scale-105" />
              </a>

              {/* Desktop Nav Items */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="px-3 py-2 text-[15px] font-semibold text-[#0c0c0d] hover:text-black hover:bg-gray-50 rounded-full transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Section: Log In & Sign Up */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                type="button"
                className="px-6 py-2.5 text-[15px] font-semibold text-[#0c0c0d] bg-[#f5f7fa] hover:bg-[#e9edf2] active:bg-[#dfe4eb] rounded-full transition-all duration-150 cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                className="px-6 py-2.5 text-[15px] font-semibold text-white bg-black hover:bg-neutral-800 active:bg-neutral-900 rounded-full transition-all duration-150 shadow-sm cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                type="button"
                className="px-4 py-1.5 text-xs font-semibold text-[#0c0c0d] bg-[#f5f7fa] rounded-full"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="block text-base font-semibold py-2 text-gray-900 border-b border-gray-50"
              >
                {item.title}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              <button className="w-full py-2.5 text-sm font-semibold text-white bg-black rounded-full">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start pt-10 sm:pt-14 pb-20 px-4 text-center">
        {/* Segmented Pill Switcher (Matches Photo 2) */}
        <div className="inline-flex items-center p-1 bg-[#eaeff5] rounded-full mb-8 shadow-inner transition-all duration-200">
          <button
            type="button"
            onClick={() => setActiveTab('Personal')}
            className={`px-6 py-2 text-sm sm:text-[15px] font-semibold rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === 'Personal'
                ? 'bg-white text-[#0c0c0d] shadow-sm'
                : 'text-gray-500 hover:text-[#0c0c0d]'
            }`}
          >
            Personal
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Business')}
            className={`px-6 py-2 text-sm sm:text-[15px] font-semibold rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === 'Business'
                ? 'bg-white text-[#0c0c0d] shadow-sm'
                : 'text-gray-500 hover:text-[#0c0c0d]'
            }`}
          >
            Business
          </button>
        </div>

        {/* Main Heading - PayPal Open (Photo 2) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0c0c0d] max-w-3xl leading-[1.1] animate-in fade-in duration-300">
          {current.title}
        </h1>

        {/* Sub-heading */}
        <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#0c0c0d] mt-4 max-w-2xl">
          {current.subtitle}
        </h2>

        {/* Description paragraph */}
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mt-4 leading-relaxed font-normal">
          {current.desc}
        </p>

        {/* Action Buttons (Matches Photo 2) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
          {/* Primary CTA (Black Pill) */}
          <button
            type="button"
            className="px-7 sm:px-8 py-3 text-sm sm:text-[15px] font-bold text-white bg-black hover:bg-neutral-800 active:bg-neutral-900 rounded-full transition-all duration-150 shadow-sm cursor-pointer"
          >
            {current.primaryBtn}
          </button>

          {/* Secondary CTA (Light Grayish Pill) */}
          <button
            type="button"
            className="px-7 sm:px-8 py-3 text-sm sm:text-[15px] font-bold text-[#0c0c0d] bg-[#ebf0f6] hover:bg-[#dfe6ef] active:bg-[#d4dde8] rounded-full transition-all duration-150 cursor-pointer"
          >
            {current.secondaryBtn}
          </button>
        </div>
      </main>
    </div>
  )
}

