'use client'
import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineClock, HiOutlineArrowRight, HiOutlinePaperAirplane, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import Link from 'next/link'
import apiCall from '../../lib/apiCall'
import validate from '../../lib/contactValidation'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    service_id: '',
    message: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    message: '',
    notify: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiCall.get('services')
        if (response.status === 200) {
          const data = response.data as any
          setServices(Array.isArray(data) ? data : data?.data || [])
        }
      } catch (err) {
        console.error('Error fetching services:', err)
      }
    }
    fetchServices()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    let processedValue = value
    if (name === 'phone_no') {
      processedValue = value.replace(/\D/g, '').substring(0, 10)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    if (value && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setErrors(prev => ({ ...prev, notify: '' }))
    
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await apiCall.post('contacts', formData)
      
      if (response.status === 201 || response.status === 200) {
        setFormData({
          name: '',
          email: '',
          phone_no: '',
          address: '',
          service_id: '',
          message: ''
        })
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        setErrors(prev => ({
          ...prev,
          notify: 'Failed to send message. Please try again.'
        }))
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error)
      
      let errorMessage = 'Failed to send message. Please try again.'
      
      if (error.response) {
        const responseData = error.response.data
        const status = error.response.status
        
        if (status === 422) {
          if (responseData?.errors) {
            const validationErrors = Object.values(responseData.errors).flat()
            errorMessage = validationErrors.length > 0 ? validationErrors.join(', ') : 'Validation error. Please check all fields.'
          } else {
            errorMessage = responseData?.message || 'Validation error. Please check all fields.'
          }
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later or contact us directly.'
        } else {
          errorMessage = responseData?.message || responseData?.error || `Server error (${status}). Please try again.`
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      }
      
      setErrors(prev => ({
        ...prev,
        notify: errorMessage
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: HiOutlineMapPin,
      title: 'Office Address',
      details: ['Bole Sub-City, Woreda 06', 'Megenagna to Lamberet Road', 'Shola Building 1st Floor', 'Room No. 106, Addis Ababa'],
      color: '#8B5CF6',
      link: 'https://maps.google.com',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bgPattern: 'bg-purple-500/10',
      hoverGradient: 'from-purple-600 via-pink-600 to-rose-600'
    },
    {
      icon: HiOutlinePhone,
      title: 'Phone',
      details: ['+251-6-677479', '+251-9-11240283'],
      color: '#06B6D4',
      link: 'tel:+2516677479',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      bgPattern: 'bg-cyan-500/10',
      hoverGradient: 'from-cyan-600 via-blue-600 to-indigo-700'
    },
    {
      icon: HiOutlineEnvelope,
      title: 'Email',
      details: ['info@efengineering-architect.com'],
      color: '#F59E0B',
      link: 'mailto:info@efengineering-architect.com',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bgPattern: 'bg-amber-500/10',
      hoverGradient: 'from-amber-600 via-orange-600 to-red-600'
    },
    {
      icon: HiOutlineClock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 1:00 PM'],
      color: '#10B981',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgPattern: 'bg-emerald-500/10',
      hoverGradient: 'from-emerald-600 via-teal-600 to-cyan-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Simplified Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Minimal floating orbs - reduced for performance */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-br from-[#F54927]/10 to-transparent rounded-full blur-2xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-[#042970]/10 to-transparent rounded-full blur-2xl opacity-40"></div>
      </div>

      <PageHeader title="Contact Us" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section with Animated Text */}
        <Reveal variant="up" delay={0}>
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#F54927]/10 to-[#042970]/10 rounded-full mb-4 sm:mb-5 border border-[#F54927]/20">
              <HiOutlineSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F54927] animate-pulse" />
              <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs">Get In Touch</p>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-5 leading-tight">
              Let's{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54927] via-[#ff6b4a] to-[#042970]">
                  Connect
                </span>
              </span>
              <br />
              <span className="text-[#042970]">Together</span>
            </h1>
            
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed px-4 mb-6 sm:mb-7 max-w-2xl mx-auto">
              Ready to bring your vision to life? Our team is here to help with inquiries, consultations, and partnerships.
            </p>
            
            {/* Interactive badges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              {[
                { text: '⚡ Quick Response', color: 'from-[#F54927] to-[#ff6b4a]' },
                { text: '🎯 Expert Consultation', color: 'from-[#042970] to-[#0a3a8a]' },
                { text: '💬 24/7 Support', color: 'from-[#F54927] to-[#ff6b4a]' },
                { text: '🚀 Free Quote', color: 'from-[#042970] to-[#0a3a8a]' }
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r ${badge.color} text-white rounded-full text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Interactive Contact Info Cards */}
        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              const isHovered = hoveredCard === index
              
              const CardContent = (
                <div
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative p-4 sm:p-5 bg-gradient-to-br ${info.gradient} text-white rounded-xl sm:rounded-2xl border-2 border-white/30 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl overflow-hidden h-full flex flex-col`}
                  style={{
                    boxShadow: isHovered ? `0 20px 50px -10px ${info.color}, 0 0 30px ${info.color}40` : '0 8px 25px -8px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Simplified animated background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                      style={{
                        boxShadow: isHovered ? `0 8px 20px -5px ${info.color}60` : '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mb-2 sm:mb-3">
                    {info.title}
                  </h3>
                    <div className="space-y-1 sm:space-y-1.5 flex-1">
                    {info.details.map((detail, i) => (
                        <p key={i} className="text-white/95 text-xs sm:text-sm leading-tight font-medium">
                        {detail}
                      </p>
                    ))}
                    </div>
                    {info.link && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/30 group-hover:border-white/50 transition-colors duration-300">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-white">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            {info.title === 'Phone' ? 'Tap to Call' : info.title === 'Email' ? 'Tap to Email' : 'View on Map'}
                          </span>
                          <HiOutlineArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
              
              return info.link ? (
                <a 
                  key={index}
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  {CardContent}
                </a>
              ) : (
                <div key={index}>
                  {CardContent}
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Form and Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16 items-start">
          {/* Enhanced Contact Form - Takes 1 column (50% width) */}
          <Reveal variant="left" delay={200}>
            <div className="relative group h-full flex flex-col">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F54927] via-[#ff6b4a] to-[#042970] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              
              <div className="relative p-4 sm:p-5 md:p-6 bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 shadow-2xl hover:shadow-[#F54927]/20 transition-all duration-500 flex-1 flex flex-col">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F54927]/5 to-transparent rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#042970]/5 to-transparent rounded-full -ml-10 -mb-10"></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-[#F54927] to-[#042970] rounded-full"></div>
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1">
                  Send us a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54927] to-[#ff6b4a]">Message</span>
                </h2>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        We'll respond within 24 hours
                </p>
                    </div>
              </div>
              
              {/* Success Toast */}
              {showSuccess && (
                    <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5 border-2 border-[#10B981] rounded-xl animate-fade-in shadow-lg">
                  <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center flex-shrink-0">
                          <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[#10B981] font-bold text-sm">Success!</p>
                          <p className="text-[#10B981]/80 text-xs">We'll get back to you soon.</p>
                        </div>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {errors.notify && (
                    <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-[#F54927]/10 to-[#F54927]/5 border-2 border-[#F54927] rounded-xl animate-shake shadow-lg">
                      <p className="text-[#F54927] font-bold text-sm">{errors.notify}</p>
                </div>
              )}

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
                {/* Name and Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="group/field">
                        <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                      Your Name <span className="text-[#F54927]">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white ${
                        errors.name 
                              ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                              : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                      }`}
                          placeholder="John Doe"
                    />
                    {errors.name && (
                          <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{errors.name}</p>
                    )}
                  </div>
                      <div className="group/field">
                        <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                      Your Email <span className="text-[#F54927]">*</span>
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white ${
                        errors.email 
                              ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                              : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                      }`}
                          placeholder="john@example.com"
                    />
                    {errors.email && (
                          <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone and Address Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="group/field">
                        <label htmlFor="phone_no" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                      Phone Number <span className="text-[#F54927]">*</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone_no"
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white ${
                        errors.phone_no 
                              ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                              : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                      }`}
                      placeholder="0912345678"
                      maxLength={10}
                    />
                    {errors.phone_no && (
                          <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{errors.phone_no}</p>
                    )}
                  </div>
                      <div className="group/field">
                        <label htmlFor="address" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                      Address
                    </label>
                    <input 
                      type="text" 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 focus:border-[#F54927] transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white hover:border-[#042970]/30"
                      placeholder="Your Address"
                    />
                  </div>
                </div>

                {/* Services Dropdown */}
                    <div className="group/field">
                      <label htmlFor="service_id" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                    Services
                  </label>
                  <select
                    id="service_id"
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 focus:border-[#F54927] transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white hover:border-[#042970]/30 cursor-pointer"
                  >
                    <option value="" disabled>Select a Service</option>
                    {services.length > 0 && 
                      services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.title || service.name}
                        </option>
                      ))
                    }
                    <option value="">Other</option>
                  </select>
                </div>

                {/* Message Textarea */}
                    <div className="group/field">
                      <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                    Message <span className="text-[#F54927]">*</span>
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none text-sm sm:text-base bg-gray-50 hover:bg-white ${
                      errors.message 
                            ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                            : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                    }`}
                        placeholder="Tell us about your project..."
                  ></textarea>
                  {errors.message && (
                        <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                    <div className="pt-2 sm:pt-3 mt-auto">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                        className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#F54927] via-[#ff6b4a] to-[#F54927] text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-black inline-flex items-center justify-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                  >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#042970] to-[#0a3a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {isLoading ? (
                      <>
                            <span className="animate-spin inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white border-t-transparent rounded-full relative z-10"></span>
                            <span className="relative z-10">Sending...</span>
                      </>
                    ) : (
                      <>
                            <span className="relative z-10">Send Message</span>
                            <HiOutlinePaperAirplane className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                      </>
                    )}
                  </button>
                </div>
              </form>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Quick Actions and Direct Contact - Takes 1 column */}
          <Reveal variant="right" delay={200}>
            <div className="space-y-4 sm:space-y-5 flex flex-col h-full">
              {/* Quick Actions */}
              <div className="relative group flex-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#042970] to-[#0a3a8a] rounded-2xl sm:rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#042970] via-[#0a3a8a] to-[#1252a4] text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F54927]/20 rounded-full -mr-16 -mt-16 animate-float"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F54927]/10 rounded-full -ml-12 -mb-12 animate-float-reverse" style={{ animationDelay: '1.5s' }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-1.5 h-6 sm:h-8 bg-[#F54927] rounded-full"></div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black">Quick Actions</h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { href: '/projects', text: 'View Our Projects', icon: HiOutlineArrowRight },
                        { href: '/services', text: 'Our Services', icon: HiOutlineArrowRight },
                        { href: '/vacancy', text: 'Career Opportunities', icon: HiOutlineArrowRight }
                      ].map((action, idx) => (
                  <Link 
                          key={idx}
                          href={action.href}
                          className="flex items-center justify-between p-3 sm:p-4 bg-white/10 hover:bg-gradient-to-r hover:from-[#F54927] hover:to-[#ff6b4a] rounded-lg sm:rounded-xl transition-all duration-300 group/action border border-white/20 hover:border-transparent hover:shadow-lg hover:shadow-[#F54927]/50 transform hover:scale-105"
                  >
                          <span className="font-bold text-sm sm:text-base">{action.text}</span>
                          <action.icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover/action:translate-x-2 transition-transform duration-300" />
                  </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact Card */}
              <div className="relative group flex-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#F54927] to-[#ff6b4a] rounded-2xl sm:rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#F54927] via-[#ff6b4a] to-[#ff8c6b] text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12 animate-float-reverse" style={{ animationDelay: '2s' }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-1.5 h-6 sm:h-8 bg-white rounded-full"></div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black">Direct Contact</h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <a 
                        href="tel:+2516677479"
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 group/contact border border-white/20 hover:border-white/40 hover:shadow-lg transform hover:scale-105"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover/contact:bg-white/30 group-hover/contact:scale-110 transition-all duration-300 flex-shrink-0">
                          <HiOutlinePhone className="w-5 h-5 sm:w-6 sm:h-7 group-hover/contact:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs mb-0.5 sm:mb-1 font-semibold">Call Us</p>
                          <p className="font-black text-sm sm:text-base leading-tight">+251-6-677479</p>
                          <p className="font-black text-sm sm:text-base leading-tight">+251-9-11240283</p>
                        </div>
                      </a>
                      <a 
                        href="mailto:info@efengineering-architect.com"
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 group/contact border border-white/20 hover:border-white/40 hover:shadow-lg transform hover:scale-105"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover/contact:bg-white/30 group-hover/contact:scale-110 transition-all duration-300 flex-shrink-0">
                          <HiOutlineEnvelope className="w-5 h-5 sm:w-6 sm:h-7 group-hover/contact:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs mb-0.5 sm:mb-1 font-semibold">Email Us</p>
                          <p className="font-black text-xs sm:text-sm break-all leading-tight">info@efengineering-architect.com</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Full Width Map Section */}
        <Reveal variant="up" delay={300}>
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#042970]/10 to-[#F54927]/10 rounded-full mb-6 border border-[#042970]/20">
              <HiOutlineMapPin className="w-6 h-6 text-[#F54927] animate-pulse" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
                Find Us on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54927] to-[#042970]">Map</span>
              </h2>
            </div>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Visit our office or get directions to our location in Addis Ababa
            </p>
          </div>

          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            {/* Full screen map container */}
            <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden group shadow-2xl">
              {/* Animated background overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/10 via-[#F54927]/5 to-[#042970]/10 z-10 pointer-events-none"></div>
              
              {/* Top gradient fade */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent z-10 pointer-events-none"></div>
              
              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#042970]/30 to-transparent z-10 pointer-events-none"></div>
              
              {/* Map iframe */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d126094.870277726!2d38.735707282355904!3d9.02130352370343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x2a471bed5060371d%3A0x8fec37f5569829ee!2sAddis%20Ababa%201000!3m2!1d9.0213127!2d38.818109199999995!5e0!3m2!1sen!2set!4v1763573550216!5m2!1sen!2set" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="group-hover:scale-105 transition-transform duration-700"
              ></iframe>
              
              {/* Overlay info card - Centered and prominent */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl px-4 sm:px-6 md:px-8">
                <div className="bg-gradient-to-r from-[#042970] via-[#0a3a8a] to-[#042970] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-white/20 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#F54927] to-[#ff6b4a] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <HiOutlineMapPin className="text-white w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-white font-black text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">Our Location</h4>
                      <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                        <span className="block sm:inline">Bole Sub-City, Woreda 06</span>
                        <span className="hidden sm:inline"> • </span>
                        <span className="block sm:inline">Megenagna to Lamberet Road</span>
                        <br className="hidden sm:block" />
                        <span className="block sm:inline">Shola Building 1st Floor, Room No. 106</span>
                        <span className="hidden sm:inline"> • </span>
                        <span className="block sm:inline">Addis Ababa, Ethiopia</span>
                      </p>
                    </div>
                    <div className="w-full sm:w-auto">
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#F54927] to-[#ff6b4a] text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:scale-105 hover:shadow-xl transition-all duration-300"
                      >
                        <span>View on Maps</span>
                        <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-8 left-8 w-24 h-24 border-4 border-[#F54927]/20 rounded-full animate-float hidden lg:block"></div>
              <div className="absolute top-8 right-8 w-20 h-20 border-4 border-[#042970]/20 rounded-full animate-float-reverse hidden lg:block" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-32 left-12 w-16 h-16 border-4 border-[#F54927]/20 rounded-lg rotate-45 animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-32 right-12 w-16 h-16 border-4 border-[#042970]/20 rounded-lg rotate-45 animate-float-reverse hidden lg:block" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
