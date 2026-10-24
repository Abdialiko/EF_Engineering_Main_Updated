'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTelegramPlane,
  FaChevronDown,
  FaBars,
  FaTimes
} from 'react-icons/fa'
import { 
  HiOutlineBuildingOffice2,
  HiOutlineHandRaised
} from 'react-icons/hi2'

interface NavLink {
  name: string
  href: string
  subLinks?: { name: string; href: string }[]
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Clients', href: '/clients' },
    { name: 'Teams', href: '/teams' },
    { name: 'Vacancy', href: '/vacancy' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ]
  
  const topLinks: NavLink[] = [
    { name: 'FAQ', href: '/faq' }
  ]
  
  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100063901428377', icon: <FaFacebookF /> },
    { name: 'Twitter', href: 'https://twitter.com', icon: <FaTwitter /> },
    { name: 'Instagram', href: 'https://instagram.com/ef_architecture_consultanting?igshid=YmMyMTA2M2Y', icon: <FaInstagram /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/endale-abdissa-a13564234', icon: <FaLinkedinIn /> },
    { name: 'Telegram', href: 'https://t.me/efengineeringandconsulting', icon: <FaTelegramPlane /> }
  ]
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }
  
  return (
    <header className="fixed top-0 left-0 w-full z-[9999]" style={{ zIndex: 9999 }}>
      {/* Top header removed for a cleaner modern look */}
      
      {/* Main Header - Sticky and transparent */}
      <div className={`transition-all duration-300 sticky top-0 relative z-[9999] overflow-visible ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-6'
      }`} style={{ zIndex: 9999 }}>
        <div className="container mx-auto px-2 sm:px-3 md:px-4 overflow-visible" style={{ position: 'relative', zIndex: 9999 }}>
          <div className="flex justify-between items-center gap-2 sm:gap-3 md:gap-4 overflow-visible" style={{ position: 'relative', zIndex: 9999 }}>
            {/* Logo - Responsive with favicon fallback */}
            <div className="flex items-center relative z-[10000]">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/images/logo/newlogo.png"
                  alt="EF Engineering"
                  width={144}
                  height={72}
                  className="object-contain transition-all duration-300 group-hover:scale-105
                    h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16
                    max-w-[144px]"
                  priority={true}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                  quality={90}
                />
              </Link>
            </div>
            
            {/* Desktop Navigation - Hidden on small screens */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 relative" style={{ zIndex: 10000, overflow: 'visible' }}>
              {navLinks.map((link, index) => (
                <div key={link.name} className="relative group flex items-center" style={{ zIndex: 10001, overflow: 'visible', position: 'relative' }}>
                  {/* Interactive connecting line */}
                  {index > 0 && (
                    <div className="h-0.5 w-1 sm:w-1.5 lg:w-2 mx-0.5 sm:mx-0.5 lg:mx-1 relative group-hover:w-2 sm:group-hover:w-3 lg:group-hover:w-4 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#042970]/40 via-[#042970]/60 to-[#042970]/40 group-hover:from-[#F54927] group-hover:via-[#F54927] group-hover:to-[#F54927] transition-all duration-300 rounded-full"></div>
                      <div className="absolute inset-0 bg-[#F54927] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  
                  {link.subLinks ? (
                    <>
                      {/* Clean Vertical Navigation Menu - Desktop Only */}
                      <div className="flex flex-col gap-1">
                        {link.subLinks.map((subLink, subIndex) => (
                          <Link
                            key={subLink.name}
                            href={subLink.href}
                            className="font-extrabold text-[10px] sm:text-xs lg:text-sm px-1.5 py-1 sm:px-2 sm:py-1.5 lg:px-2 lg:py-1.5 rounded-md transition-all duration-300 
                              relative overflow-hidden group-hover:scale-105 group-hover:rotate-1
                              text-white hover:text-white bg-[#042970]/40 hover:bg-[#F54927] shadow-md hover:shadow-xl backdrop-blur-sm
                              border border-transparent hover:border-white/30 whitespace-nowrap text-center"
                          >
                            <span className="relative z-10">{subLink.name}</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      href={link.href}
                      className="font-extrabold text-[10px] sm:text-xs lg:text-sm px-1.5 py-1 sm:px-2 sm:py-1.5 lg:px-2 lg:py-1.5 rounded-md transition-all duration-300 
                        relative overflow-hidden group-hover:scale-105 group-hover:rotate-1
                        text-white hover:text-white bg-[#042970]/40 hover:bg-[#F54927] shadow-md hover:shadow-xl backdrop-blur-sm
                        border border-transparent hover:border-white/30 whitespace-nowrap"
                    >
                      <span className="relative z-10">{link.name}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {/* Animated underline */}
                      <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Mobile Menu Button - Enhanced Hamburger */}
            <button 
              className={`md:hidden focus:outline-none p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 
                relative overflow-hidden group
                text-white bg-[#042970]/40 hover:bg-[#F54927] shadow-xl hover:shadow-2xl backdrop-blur-md
                border-2 border-transparent hover:border-white/30
                ${isMenuOpen ? 'bg-[#F54927] text-white scale-110 rotate-90' : 'hover:scale-110 hover:rotate-12'}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
              {isMenuOpen ? (
                <FaTimes className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 rotate-180 relative z-10 font-extrabold" />
              ) : (
                <FaBars className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 relative z-10 font-extrabold" />
              )}
            </button>
          </div>
          
          {/* Mobile Navigation - Enhanced with animations */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-[#F54927] animate-fade-in-down">
              {/* Top Links for Mobile */}
              <div className="flex flex-col space-y-2 pb-4 px-4 pt-4 border-b-2 border-[#F54927]/30">
                {topLinks.map((link, index) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-white font-extrabold text-sm sm:text-base py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 
                      hover:bg-[#F54927] hover:translate-x-2 hover:scale-105 shadow-md hover:shadow-xl relative overflow-hidden group/item
                      bg-[#042970]/40 backdrop-blur-sm border border-transparent hover:border-white/30"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                    <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover/item:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </div>
              
              {/* Main Navigation Links */}
              <div className="flex flex-col space-y-2 py-4 px-4">
                {navLinks.map((link, index) => (
                  <div key={link.name}>
                    {link.subLinks ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(link.name)}
                          className={`w-full text-white hover:text-white font-extrabold text-sm sm:text-base py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl flex justify-between items-center 
                            transition-all duration-300 hover:bg-[#F54927] hover:translate-x-2 hover:scale-105 shadow-md hover:shadow-xl relative overflow-hidden group/item
                            backdrop-blur-sm border border-transparent hover:border-white/30
                            ${
                              openDropdown === link.name 
                                ? 'bg-[#F54927] text-white shadow-xl scale-105' 
                                : 'bg-[#042970]/40'
                            }`}
                        >
                          <span className="relative z-10">{link.name}</span>
                          <FaChevronDown className={`h-5 w-5 transition-transform duration-300 relative z-10 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                          <span className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                          <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover/item:w-full transition-all duration-300"></span>
                        </button>
                        
                        {openDropdown === link.name && (
                          <div 
                            className="pl-4 pb-2 mt-2 space-y-2 bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 shadow-xl border-2 border-[#F54927]/20 min-h-[80px]"
                            style={{ 
                              opacity: 1,
                              visibility: 'visible',
                              display: 'block',
                              backgroundColor: '#ffffff'
                            }}
                          >
                            {/* Mobile Header */}
                            <div className="mb-2 pb-2 border-b border-gray-200/50">
                              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Explore</h3>
                            </div>
                            
                            {link.subLinks && link.subLinks.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {link.subLinks.map((subLink, subIndex) => {
                                  const isClient = subLink.name.toLowerCase() === 'clients'
                                  const isPartner = subLink.name.toLowerCase() === 'partners'
                                  const Icon = isClient ? HiOutlineBuildingOffice2 : isPartner ? HiOutlineHandRaised : HiOutlineBuildingOffice2
                                  
                                  return (
                              <Link
                                key={subLink.name}
                                href={subLink.href}
                                      className="group/sub relative flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 
                                        hover:bg-gradient-to-r hover:from-[#F54927] hover:to-[#d63e1f] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                      style={{ 
                                        color: '#111827',
                                        backgroundColor: 'transparent'
                                      }}
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  setOpenDropdown(null)
                                }}
                                    >
                                      {/* Icon Container */}
                                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                        isClient 
                                          ? 'bg-[#042970]/10 text-[#042970] group-hover/sub:bg-white/20 group-hover/sub:text-white' 
                                          : 'bg-[#F54927]/10 text-[#F54927] group-hover/sub:bg-white/20 group-hover/sub:text-white'
                                      }`}>
                                        <Icon className="w-4 h-4 transition-transform duration-300 group-hover/sub:scale-110 group-hover/sub:rotate-3" />
                                      </div>
                                      
                                      {/* Text Content */}
                                      <div className="flex-1 min-w-0">
                                        <span 
                                          className="block font-extrabold text-xs sm:text-sm text-gray-900 group-hover/sub:text-white transition-colors duration-300"
                                          style={{ fontWeight: '800' }}
                                        >
                                          {subLink.name}
                                        </span>
                                        <span className={`block text-[10px] sm:text-xs mt-0.5 transition-colors duration-300 ${
                                          isClient 
                                            ? 'text-[#042970]/70 group-hover/sub:text-white/90' 
                                            : 'text-[#F54927]/70 group-hover/sub:text-white/90'
                                        }`}>
                                          {isClient ? 'Our valued clients' : 'Strategic partnerships'}
                                        </span>
                                      </div>
                                      
                                      {/* Arrow Indicator */}
                                      <div className="flex-shrink-0 opacity-0 group-hover/sub:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover/sub:translate-x-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                      
                                      {/* Hover Background Effect */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover/sub:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
                              </Link>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="px-4 py-2 text-gray-500 text-sm text-center">No items</div>
                            )}
                            
                            {/* Footer Decoration */}
                            <div className="mt-2 pt-2 border-t border-gray-200/50">
                              <div className="h-1 bg-gradient-to-r from-[#042970] via-[#F54927] to-[#042970] rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link 
                        href={link.href}
                        className="block text-white hover:text-white font-extrabold text-sm sm:text-base py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 
                          hover:bg-[#F54927] hover:translate-x-2 hover:scale-105 shadow-md hover:shadow-xl relative overflow-hidden group/item
                          bg-[#042970]/40 backdrop-blur-sm border border-transparent hover:border-white/30"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative z-10">{link.name}</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#F54927] to-[#d63e1f] opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                        <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover/item:w-full transition-all duration-300"></span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Mobile Social Links - Enhanced */}
              <div className="pt-4 mt-4 px-4 pb-4 border-t-2 border-[#F54927]/30">
                <h3 className="text-gray-900 font-extrabold mb-4 text-base uppercase tracking-wider">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F54927]/10 text-[#F54927] hover:bg-[#F54927] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      aria-label={social.name}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="h-5 w-5 flex items-center justify-center">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}