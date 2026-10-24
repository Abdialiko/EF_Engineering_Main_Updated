'use client'
import { useState, useEffect } from 'react'
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendar,
  HiOutlineMapPin
} from 'react-icons/hi2'

interface MultiStepApplicationFormProps {
  jobId: string | number | string[] | undefined
  jobTitle?: string
}

type FormData = {
  // Step 1: Personal Info
  name: string
  email: string
  phone: string
  address: string
  
  // Step 2: Experience
  experience: string
  education: string
  skills: string
  previousCompany: string
  
  // Step 3: Upload CV
  resume: File | null
  coverLetter: string
  
  // Step 4: Confirm & Submit
  agreeToTerms: boolean
}

type Step = 1 | 2 | 3 | 4

export default function MultiStepApplicationForm({ jobId, jobTitle }: MultiStepApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    education: '',
    skills: '',
    previousCompany: '',
    resume: null,
    coverLetter: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const steps = [
    { number: 1, title: 'Personal Info', icon: HiOutlineUser },
    { number: 2, title: 'Experience', icon: HiOutlineBriefcase },
    { number: 3, title: 'Upload CV', icon: HiOutlineDocumentText },
    { number: 4, title: 'Confirm & Submit', icon: HiOutlineCheckCircle }
  ]

  // Pure validation function (doesn't set state) - used for checking validity
  const isStepValid = (step: Step): boolean => {
    if (step === 1) {
      return !!(
        formData.name.trim() &&
        formData.email.trim() &&
        /\S+@\S+\.\S+/.test(formData.email) &&
        formData.phone.trim() &&
        formData.address.trim()
      )
    } else if (step === 2) {
      return !!(
        formData.experience.trim() &&
        formData.education.trim() &&
        formData.skills.trim()
      )
    } else if (step === 3) {
      return !!(
        formData.resume &&
        formData.coverLetter.trim() &&
        formData.coverLetter.trim().length >= 50
      )
    } else if (step === 4) {
      return formData.agreeToTerms
    }
    return false
  }

  // Validation function that sets errors (only called when needed)
  const validateStep = (step: Step): boolean => {
    const newErrors: { [key: string]: string } = {}
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
    } else if (step === 2) {
      if (!formData.experience.trim()) newErrors.experience = 'Experience is required'
      if (!formData.education.trim()) newErrors.education = 'Education is required'
      if (!formData.skills.trim()) newErrors.skills = 'Skills are required'
    } else if (step === 3) {
      if (!formData.resume) newErrors.resume = 'Resume is required'
      if (!formData.coverLetter.trim()) {
        newErrors.coverLetter = 'Cover letter is required'
      } else if (formData.coverLetter.trim().length < 50) {
        newErrors.coverLetter = 'Cover letter must be at least 50 characters'
      }
    } else if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          resume: 'File size must be less than 5MB'
        }))
        return
      }
      
      setFormData(prev => ({
        ...prev,
        resume: file
      }))
      
      if (errors.resume) {
        setErrors(prev => ({
          ...prev,
          resume: ''
        }))
      }
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as Step)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // Mark all fields in current step as touched
      const stepFields: { [key: string]: boolean } = {}
      if (currentStep === 1) {
        ['name', 'email', 'phone', 'address'].forEach(field => {
          stepFields[field] = true
        })
      } else if (currentStep === 2) {
        ['experience', 'education', 'skills', 'previousCompany'].forEach(field => {
          stepFields[field] = true
        })
      } else if (currentStep === 3) {
        ['resume', 'coverLetter'].forEach(field => {
          stepFields[field] = true
        })
      } else if (currentStep === 4) {
        stepFields['agreeToTerms'] = true
      }
      setTouched(prev => ({ ...prev, ...stepFields }))
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(4)) {
      setTouched(prev => ({ ...prev, agreeToTerms: true }))
      return
    }
    
    setSubmitting(true)
    
    try {
      // Prepare FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('job_id', String(jobId || ''))
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('experience', formData.experience)
      formDataToSend.append('education', formData.education)
      formDataToSend.append('skills', formData.skills)
      formDataToSend.append('previous_company', formData.previousCompany)
      formDataToSend.append('cover_letter', formData.coverLetter)
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume)
      }
      
      // Submit to API - try multiple possible endpoints
      const endpoints = [
        'https://api.efengineering-architect.com/api/applications',
        'https://api.efengineering-architect.com/api/job-applications',
        'https://api.efengineering-architect.com/api/jobs/apply'
      ]
      
      let response: Response | null = null
      let lastError: Error | null = null
      
      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            body: formDataToSend,
            cache: 'no-store'
          })
          
          // Check if response is JSON
          const contentType = response.headers.get('content-type') || ''
          
          if (contentType.includes('application/json')) {
            const result = await response.json()
            
            if (response.ok) {
              // Success
              setSubmitting(false)
              setSubmitted(true)
              return
            } else {
              throw new Error(result.message || result.error || 'Failed to submit application')
            }
          } else {
            // If not JSON, read as text to see what we got
            const text = await response.text()
            console.error(`Non-JSON response from ${endpoint}:`, text.substring(0, 200))
            
            // If it's an HTML error page, try next endpoint
            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
              // Don't show this error to user, just try next endpoint silently
              lastError = new Error('Endpoint not available')
              continue
            }
            
            throw new Error('Server returned an invalid response format.')
          }
        } catch (err: any) {
          // If it's a network error or JSON parse error, try next endpoint
          if (err.message && (err.message.includes('JSON') || err.message.includes('fetch'))) {
            lastError = err
            continue
          }
          // Otherwise, re-throw the error
          throw err
        }
      }
      
      // If we get here, all endpoints failed
      // Show a user-friendly message without technical details
      throw new Error('Unable to connect to the server. Please try again later or contact support.')
      
    } catch (error: any) {
      console.error('Application submission error:', error)
      setSubmitting(false)
      
      // Provide user-friendly error message (hide technical details)
      let errorMessage = 'Unable to submit your application at this time. Please try again later or contact us directly.'
      
      if (error.message) {
        // Only show user-friendly messages, hide technical errors
        if (error.message.includes('JSON') || error.message.includes('Endpoint')) {
          errorMessage = 'The application service is temporarily unavailable. Please try again later or contact us at info@efengineering.com'
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.'
        } else if (error.message.includes('connect')) {
          errorMessage = 'Unable to connect to the server. Please try again later or contact us at info@efengineering.com'
        } else if (!error.message.includes('Endpoint not available')) {
          // Only show non-technical error messages
          errorMessage = error.message
        }
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }))
      
      // Show error message to user
      alert(errorMessage)
    }
  }

  const calculateProgress = (): number => {
    let completed = 0
    const total = 11
    
    if (formData.name.trim()) completed++
    if (formData.email.trim() && formData.email.includes('@')) completed++
    if (formData.phone.trim()) completed++
    if (formData.address.trim()) completed++
    if (formData.experience.trim()) completed++
    if (formData.education.trim()) completed++
    if (formData.skills.trim()) completed++
    if (formData.previousCompany.trim()) completed++
    if (formData.resume) completed++
    if (formData.coverLetter.trim() && formData.coverLetter.trim().length >= 50) completed++
    if (formData.agreeToTerms) completed++
    
    return Math.round((completed / total) * 100)
  }

  const progress = calculateProgress()

  if (submitted) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#10B981]/20 rounded-full mb-6 sm:mb-8 animate-scale-in">
          <HiOutlineCheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#10B981]" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
          Thank you for your interest. We've received your application and will review it shortly. We'll contact you soon if you're selected for the next stage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setSubmitted(false)
              setCurrentStep(1)
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                experience: '',
                education: '',
                skills: '',
                previousCompany: '',
                resume: null,
                coverLetter: '',
                agreeToTerms: false
              })
              setErrors({})
              setTouched({})
            }}
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#042970] hover:bg-[#F54927] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
          >
            Apply for Another Position
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Progress Indicator */}
      <div className="standard-card interactive-card-3d p-5 sm:p-6 md:p-8 bg-gradient-to-br from-white via-[#042970]/5 to-white border-2 border-[#042970]/20">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Application Progress</h3>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#042970]">{progress}%</div>
              <p className="text-xs sm:text-sm text-gray-600">Complete</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-6 sm:mb-8">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                progress === 100 ? 'bg-[#10B981]' : 'bg-gradient-to-r from-[#F54927] to-[#d63e1f]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {steps.map((step) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div
                  key={step.number}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#042970] border-[#042970] text-white scale-105 shadow-lg'
                      : isCompleted
                      ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20'
                        : isCompleted
                        ? 'bg-[#10B981]'
                        : 'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <HiOutlineCheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          isCompleted ? 'text-white' : ''
                        }`} />
                      ) : (
                        <StepIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          isActive ? 'text-white' : ''
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${
                        isActive ? 'text-white' : isCompleted ? 'text-[#10B981]' : 'text-gray-500'
                      }`}>
                        Step {step.number}
                      </p>
                      <p className={`text-[10px] sm:text-xs font-semibold mt-1 ${
                        isActive ? 'text-white/90' : isCompleted ? 'text-[#10B981]' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="standard-card interactive-card-3d p-6 sm:p-8 md:p-10 bg-gradient-to-br from-white via-[#042970]/5 to-white border-2 border-gray-200">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
                Personal <span className="text-[#F54927]">Information</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Please provide your personal details</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                  Full Name <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      touched.name && errors.name
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="Your Full Name"
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                  Email Address <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      touched.email && errors.email
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                  Phone Number <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      touched.phone && errors.phone
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="+251 XXX XXX XXX"
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                  Address <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={() => handleBlur('address')}
                    className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      touched.address && errors.address
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="Your Address"
                  />
                </div>
                {touched.address && errors.address && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
                Experience & <span className="text-[#F54927]">Education</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Tell us about your professional background</p>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Years of Experience <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  onBlur={() => handleBlur('experience')}
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                    touched.experience && errors.experience
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="e.g., 5 years"
                />
              </div>
              {touched.experience && errors.experience && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.experience}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Education <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineAcademicCap className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  onBlur={() => handleBlur('education')}
                  rows={4}
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base resize-none ${
                    touched.education && errors.education
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="Your educational background"
                />
              </div>
              {touched.education && errors.education && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.education}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Skills <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineClipboardDocumentCheck className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  onBlur={() => handleBlur('skills')}
                  rows={4}
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base resize-none ${
                    touched.skills && errors.skills
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="List your key skills"
                />
              </div>
              {touched.skills && errors.skills && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.skills}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Previous Company (Optional)
              </label>
              <div className="relative">
                <HiOutlineBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="previousCompany"
                  value={formData.previousCompany}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:border-[#F54927] transition-all duration-300 text-sm sm:text-base"
                  placeholder="Previous employer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload CV */}
        {currentStep === 3 && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
                Upload <span className="text-[#F54927]">Documents</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Upload your resume and cover letter</p>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Resume/CV <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineDocumentText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  onBlur={() => handleBlur('resume')}
                  accept=".pdf,.doc,.docx"
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F54927]/10 file:text-[#F54927] hover:file:bg-[#F54927]/20 ${
                    touched.resume && errors.resume
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                />
              </div>
              {touched.resume && errors.resume && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.resume}</p>
              )}
              {formData.resume && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#10B981]">
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  <span className="font-semibold">{formData.resume.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Cover Letter <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineClipboardDocumentCheck className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  onBlur={() => handleBlur('coverLetter')}
                  rows={8}
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base resize-none ${
                    touched.coverLetter && errors.coverLetter
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              {touched.coverLetter && errors.coverLetter && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.coverLetter}</p>
              )}
              {formData.coverLetter && (
                <p className={`mt-1.5 text-xs sm:text-sm font-semibold ${
                  formData.coverLetter.trim().length >= 50 ? 'text-[#10B981]' : 'text-[#F54927]'
                }`}>
                  {formData.coverLetter.trim().length} / 50 characters minimum
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Confirm & Submit */}
        {currentStep === 4 && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
                Review & <span className="text-[#F54927]">Confirm</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Please review your information before submitting</p>
            </div>
            
            {/* Submission Error Display */}
            {errors.submit && (
              <div className="p-4 sm:p-5 bg-[#F54927]/10 border-2 border-[#F54927] rounded-xl mb-4 sm:mb-6 animate-shake">
                <p className="text-[#F54927] font-bold text-sm sm:text-base">{errors.submit}</p>
              </div>
            )}
            
            <div className="space-y-4 sm:space-y-5">
              <div className="p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                  <div>
                    <span className="text-gray-600 font-semibold">Name:</span>
                    <p className="text-gray-900 font-bold">{formData.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Email:</span>
                    <p className="text-gray-900 font-bold">{formData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Phone:</span>
                    <p className="text-gray-900 font-bold">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Address:</span>
                    <p className="text-gray-900 font-bold">{formData.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Experience & Education</h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div>
                    <span className="text-gray-600 font-semibold">Experience:</span>
                    <p className="text-gray-900 font-bold">{formData.experience || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Education:</span>
                    <p className="text-gray-900">{formData.education || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Skills:</span>
                    <p className="text-gray-900">{formData.skills || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Documents</h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div>
                    <span className="text-gray-600 font-semibold">Resume:</span>
                    <p className="text-gray-900 font-bold">{formData.resume?.name || 'Not uploaded'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Cover Letter:</span>
                    <p className="text-gray-900">{formData.coverLetter ? `${formData.coverLetter.substring(0, 100)}...` : 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
                touched.agreeToTerms && errors.agreeToTerms
                  ? 'bg-[#F54927]/5 border-[#F54927] animate-shake'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    onBlur={() => handleBlur('agreeToTerms')}
                    className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-[#F54927] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#F54927] transition-all duration-300 group-hover:border-[#F54927]"
                  />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    I confirm that all information provided is accurate and complete. I agree to the{' '}
                    <a href="/terms" className="text-[#F54927] font-bold hover:underline">terms and conditions</a>.
                  </span>
                </label>
                {touched.agreeToTerms && errors.agreeToTerms && (
                  <p className="mt-2 text-xs sm:text-sm text-[#F54927] font-semibold animate-fade-in">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base group"
            >
              <HiOutlineArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className={`inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base group ${
                currentStep === 1 ? 'ml-auto' : ''
              } ${
                isStepValid(currentStep)
                  ? 'bg-gradient-to-r from-[#F54927] to-[#d63e1f] hover:from-[#042970] hover:to-[#042970] text-white animated-gradient'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              disabled={!isStepValid(currentStep)}
            >
              Next Step
              <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !formData.agreeToTerms}
              className={`inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base group ml-auto ${
                formData.agreeToTerms && !submitting
                  ? 'bg-gradient-to-r from-[#F54927] to-[#d63e1f] hover:from-[#042970] hover:to-[#042970] text-white animated-gradient'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <HiOutlinePaperAirplane className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

