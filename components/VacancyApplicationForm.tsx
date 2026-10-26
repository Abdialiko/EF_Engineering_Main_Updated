'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendar,
  HiOutlineXMark,
  HiOutlineSparkles,
  HiOutlineLightBulb
} from 'react-icons/hi2'

interface PersonalData {
  f_name: string
  m_name: string
  l_name: string
  birth_date: string
  email: string
  phone_no: string
  city: string
  sub_city: string
  woreda: string
  cv: File | null
  supporting_doc: File | null
  job_id: string | number | null
}

interface EducationalData {
  study_field: string
  company: string
  degree_type: string
  start_date: string
  end_date: string
}

interface ExperienceData {
  title: string
  company: string
  start_date: string
  end_date: string | null
  summary: string
  is_current: boolean
}

interface CertificateData {
  title: string
  issuer: string
  date: string
  summary: string
}

interface VacancyApplicationFormProps {
  jobId: string | number | string[] | undefined
  jobTitle?: string
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

export default function VacancyApplicationForm({ jobId, jobTitle }: VacancyApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [personalData, setPersonalData] = useState<PersonalData>({
    f_name: '',
    m_name: '',
    l_name: '',
    birth_date: '',
    email: '',
    phone_no: '',
    city: '',
    sub_city: '',
    woreda: '',
    cv: null,
    supporting_doc: null,
    job_id: null
  })
  const [educationalData, setEducationalData] = useState<EducationalData[]>([])
  const [experiences, setExperiences] = useState<ExperienceData[]>([])
  const [certificates, setCertificates] = useState<CertificateData[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (jobId) {
      setPersonalData(prev => ({ ...prev, job_id: Array.isArray(jobId) ? jobId[0] : jobId }))
    }
  }, [jobId])

  // AI Auto-fill suggestions (simulated)
  const generateAiSuggestion = (field: string, value: string) => {
    if (!value || value.length < 2) return null
    
    const suggestions: { [key: string]: string[] } = {
      city: ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Mekelle', 'Gondar', 'Bahir Dar'],
      sub_city: ['Bole', 'Kirkos', 'Arada', 'Lideta', 'Nifas Silk-Lafto', 'Kolfe Keranio'],
      email: value.includes('@') ? [] : [`${value}@gmail.com`, `${value}@yahoo.com`, `${value}@outlook.com`],
      phone_no: value.length === 0 ? ['+251 9XX XXX XXX'] : []
    }
    
    return suggestions[field]?.[0] || null
  }

  const validatePersonalInfo = (data: PersonalData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {}
    const phoneno = /^\d{10}$/
    // Improved email regex - more permissive for common email formats
    const mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!data.f_name?.trim()) {
      errors.f_name = 'First name is required'
    } else if (data.f_name.trim().length > 20) {
      errors.f_name = 'Please use less than or equal to 20 letters for first name'
    }
    
    if (!data.m_name?.trim()) {
      errors.m_name = 'Middle name (Father name) is required'
    } else if (data.m_name.trim().length > 20) {
      errors.m_name = 'Please use less than or equal to 20 letters for middle name'
    }
    
    if (!data.l_name?.trim()) {
      errors.l_name = 'Last name (Grandfather name) is required'
    } else if (data.l_name.trim().length > 20) {
      errors.l_name = 'Please use less than or equal to 20 letters for last name'
    }
    
    if (!data.birth_date) {
      errors.birth_date = 'Date of birth is required'
    } else {
      // Validate birth date is not in the future
      const birthDate = new Date(data.birth_date)
      const today = new Date()
      if (birthDate > today) {
        errors.birth_date = 'Birth date cannot be in the future'
      }
    }
    
    if (!data.email?.trim()) {
      errors.email = 'Email address is required'
    } else if (!mailformat.test(data.email.trim())) {
      errors.email = 'Invalid email address format'
    }
    
    if (!data.phone_no?.trim()) {
      errors.phone_no = 'Phone number is required'
    } else if (!phoneno.test(data.phone_no.trim())) {
      errors.phone_no = 'Invalid phone number (must be exactly 10 digits)'
    }
    
    return errors
  }

  const validateEducationalInfo = (data: EducationalData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {}
    
    if (!data.study_field?.trim()) {
      errors.study_field = 'Field of study is required'
    } else if (data.study_field.trim().length > 70) {
      errors.study_field = 'Please enter shorter title'
    }
    
    if (!data.company?.trim()) {
      errors.company = 'Institution name is required'
    } else if (data.company.trim().length > 70) {
      errors.company = 'Please enter shorter institution name'
    }
    
    if (!data.degree_type?.trim()) {
      errors.degree_type = 'Qualification name is required'
    } else if (data.degree_type.trim().length > 70) {
      errors.degree_type = 'Please enter shorter qualification name'
    }
    
    if (!data.start_date) {
      errors.start_date = 'Start date is required'
    }
    
    if (!data.end_date) {
      errors.end_date = 'End date is required'
    } else if (data.start_date && data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
      errors.end_date = 'End date must be after start date'
    }
    
    return errors
  }

  const validateExperienceInfo = (data: ExperienceData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {}
    
    if (!data.title?.trim()) {
      errors.title = 'Position is required'
    } else if (data.title.trim().length > 70) {
      errors.title = 'Please enter shorter position name'
    }
    
    if (!data.company?.trim()) {
      errors.company = 'Organization name is required'
    } else if (data.company.trim().length > 70) {
      errors.company = 'Please enter shorter organization name'
    }
    
    if (!data.start_date) {
      errors.start_date = 'Start date is required'
    }
    
    if (!data.end_date && !data.is_current) {
      errors.end_date = 'End date is required'
    } else if (data.start_date && data.end_date && !data.is_current && new Date(data.end_date) < new Date(data.start_date)) {
      errors.end_date = 'End date must be after start date'
    }
    
    return errors
  }

  const validateCertificateInfo = (data: CertificateData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {}
    
    if (!data.title?.trim()) {
      errors.title = 'Title of certificate is required'
    } else if (data.title.trim().length > 70) {
      errors.title = 'Please enter shorter title'
    }
    
    if (!data.issuer?.trim()) {
      errors.issuer = 'Certificate issuer is required'
    } else if (data.issuer.trim().length > 70) {
      errors.issuer = 'Please enter shorter issuer name'
    }
    
    if (!data.date) {
      errors.date = 'Issued date is required'
    }
    
    return errors
  }

  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let processedValue = value
    
    // Sanitize phone number - remove non-numeric characters
    if (name === 'phone_no') {
      processedValue = value.replace(/\D/g, '').slice(0, 10) // Only digits, max 10
    }
    
    setPersonalData(prev => ({ ...prev, [name]: processedValue }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Generate AI suggestion
    const suggestion = generateAiSuggestion(name, processedValue)
    if (suggestion) {
      setAiSuggestions(prev => ({ ...prev, [name]: suggestion }))
    } else {
      setAiSuggestions(prev => {
        const newSuggestions = { ...prev }
        delete newSuggestions[name]
        return newSuggestions
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        // Also check file extension as fallback
        const fileName = file.name.toLowerCase()
        if (!fileName.endsWith('.pdf')) {
          setErrors(prev => ({ ...prev, [name]: 'Only PDF files are allowed' }))
          // Reset the input
          e.target.value = ''
          return
        }
      }
      
      // Validate file size
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [name]: 'File size must be less than 10MB' }))
        // Reset the input
        e.target.value = ''
        return
      }
      
      // Validate file is not empty
      if (file.size === 0) {
        setErrors(prev => ({ ...prev, [name]: 'File is empty. Please select a valid file.' }))
        // Reset the input
        e.target.value = ''
        return
      }
      
      // Store the file
      setPersonalData(prev => ({ ...prev, [name]: file }))
      setErrors(prev => ({ ...prev, [name]: '', notify: '' }))
      
      console.log(`File selected for ${name}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })
    } else {
      // No file selected, clear it
      setPersonalData(prev => ({ ...prev, [name]: null }))
      if (name === 'cv') {
        setErrors(prev => ({ ...prev, [name]: 'CV is required' }))
      } else if (name === 'supporting_doc') {
        setErrors(prev => ({ ...prev, [name]: 'Certificate and Supporting Documents are required' }))
      }
    }
  }

  const [currentEducation, setCurrentEducation] = useState<EducationalData>({
    study_field: '',
    company: '',
    degree_type: '',
    start_date: '',
    end_date: ''
  })
  const [educationErrors, setEducationErrors] = useState<{ [key: string]: string }>({})
  const [showEducationToast, setShowEducationToast] = useState(false)

  const addEducation = () => {
    const hasValue = [
      currentEducation.study_field,
      currentEducation.company,
      currentEducation.degree_type,
      currentEducation.start_date,
      currentEducation.end_date
    ].some((value) => value.trim())
    if (!hasValue) return

    setEducationalData(prev => [...prev, currentEducation])
    setCurrentEducation({
      study_field: '',
      company: '',
      degree_type: '',
      start_date: '',
      end_date: ''
    })
    setEducationErrors({})
    setShowEducationToast(true)
    setTimeout(() => setShowEducationToast(false), 3000)
  }

  const removeEducation = (index: number) => {
    setEducationalData(prev => prev.filter((_, i) => i !== index))
  }

  const [currentExperience, setCurrentExperience] = useState<ExperienceData>({
    title: '',
    company: '',
    start_date: '',
    end_date: '',
    summary: '',
    is_current: false
  })
  const [experienceErrors, setExperienceErrors] = useState<{ [key: string]: string }>({})
  const [showExperienceToast, setShowExperienceToast] = useState(false)

  const addExperience = () => {
    const hasValue = [
      currentExperience.title,
      currentExperience.company,
      currentExperience.start_date,
      currentExperience.end_date,
      currentExperience.summary
    ].some((value) => value?.trim())
    if (!hasValue) return

    
    setExperiences(prev => [...prev, currentExperience])
    setCurrentExperience({
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      summary: '',
      is_current: false
    })
    setExperienceErrors({})
    setShowExperienceToast(true)
    setTimeout(() => setShowExperienceToast(false), 3000)
  }

  const removeExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index))
  }

  const [currentCertificate, setCurrentCertificate] = useState<CertificateData>({
    title: '',
    issuer: '',
    date: '',
    summary: ''
  })
  const [certificateErrors, setCertificateErrors] = useState<{ [key: string]: string }>({})
  const [showCertificateToast, setShowCertificateToast] = useState(false)

  const addCertificate = () => {
    const hasValue = [currentCertificate.title, currentCertificate.issuer, currentCertificate.date, currentCertificate.summary]
      .some((value) => value.trim())
    if (!hasValue) return

    
    setCertificates(prev => [...prev, currentCertificate])
    setCurrentCertificate({
      title: '',
      issuer: '',
      date: '',
      summary: ''
    })
    setCertificateErrors({})
    setShowCertificateToast(true)
    setTimeout(() => setShowCertificateToast(false), 3000)
  }

  const removeCertificate = (index: number) => {
    setCertificates(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep === 1) {
      const errorValues = validatePersonalInfo(personalData)
      if (Object.keys(errorValues).length > 0) {
        setErrors(errorValues)
        return
      }
    }
    
    if (currentStep < 5) {
      setCurrentStep(prev => (prev + 1) as Step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as Step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submitApplication = async () => {
    if (!personalData.job_id) {
      setErrors(prev => ({
        ...prev,
        notify: 'This application is missing its vacancy reference. Open the vacancy and choose Apply Now again.'
      }))
      return
    }

    const personalErrors = validatePersonalInfo(personalData)
    if (Object.keys(personalErrors).length > 0) {
      setErrors(personalErrors)
      setCurrentStep(1)
      return
    }

    // Validate CV file before submission
    if (!personalData.cv) {
      setErrors(prev => ({ ...prev, cv: 'CV is required' }))
      return
    }
    
    if (!(personalData.cv instanceof File)) {
      setErrors(prev => ({ ...prev, cv: 'Please upload a valid CV file' }))
      return
    }
    
    if (personalData.cv.size === 0) {
      setErrors(prev => ({ ...prev, cv: 'CV file is empty. Please upload a valid file.' }))
      return
    }
    
    // Validate supporting document file before submission
    if (!personalData.supporting_doc) {
      setErrors(prev => ({ ...prev, supporting_doc: 'Certificate and Supporting Documents are required' }))
      return
    }
    
    if (!(personalData.supporting_doc instanceof File)) {
      setErrors(prev => ({ ...prev, supporting_doc: 'Please upload a valid certificate/supporting document file' }))
      return
    }
    
    if (personalData.supporting_doc.size === 0) {
      setErrors(prev => ({ ...prev, supporting_doc: 'Certificate file is empty. Please upload a valid file.' }))
      return
    }
    
    setIsLoading(true)
    setErrors(prev => ({ ...prev, notify: '' })) // Clear any previous errors
    
    try {
      const formData = new FormData()
      
      // Append personal information fields
      formData.append('f_name', personalData.f_name)
      formData.append('m_name', personalData.m_name)
      formData.append('l_name', personalData.l_name)
      formData.append('birth_date', personalData.birth_date)
      formData.append('email', personalData.email)
      formData.append('phone_no', personalData.phone_no)
      formData.append('city', personalData.city || '')
      formData.append('sub_city', personalData.sub_city || '')
      formData.append('woreda', personalData.woreda || '')
      formData.append('job_id', String(personalData.job_id || ''))
      
      // Append CV file (required) - match original format exactly
      // Original: applicant.append("cv",personalData.cv)
      formData.append('cv', personalData.cv)
      
      // Append supporting document (required)
      // Original code: applicant.append("supporting_doc",personalData.supporting_doc)
      formData.append('supporting_doc', personalData.supporting_doc)
      
      // Add education data. This step is optional.
      if (educationalData.length > 0) {
        educationalData.forEach((data, i) => {
          formData.append(`education[${i}],`, JSON.stringify(data))
        })
      }
      
      // Add experience data - handle is_current and end_date properly
      if (experiences.length > 0) {
        experiences.forEach((data, i) => {
          // Sanitize experience data - if is_current is true, end_date should be null, not empty string
          // Also convert empty strings to null for end_date
          const sanitizedData = {
            ...data,
            end_date: data.is_current || !data.end_date || data.end_date.trim() === '' ? null : data.end_date
          }
          formData.append(`experience[${i}],`, JSON.stringify(sanitizedData))
        })
      }
      
      // Add certificate data
      if (certificates.length > 0) {
        certificates.forEach((data, i) => {
          formData.append(`certificate[${i}],`, JSON.stringify(data))
        })
      }
      
      // Optimized debug logging (only essential info)
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting application:', {
          jobId: personalData.job_id,
          cvSize: personalData.cv?.size,
          educationCount: educationalData.length,
          experienceCount: experiences.length,
          certificateCount: certificates.length
        })
      }
      
      // Use axios instead of fetch to match original implementation
      // Axios handles FormData correctly and sets Content-Type automatically
      // Optimize: Show success immediately for better UX (optimistic update)
      const response = await fetch('https://api.efengineering-architect.com/api/applicants', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(120000)
      })

      if (response.status === 201 || response.status === 200) {
        setCurrentStep(6)
        setSubmitted(true)
        setIsLoading(false)
        return
      }

      let responseData: any = null
      const responseText = await response.text()
      try {
        responseData = responseText ? JSON.parse(responseText) : null
      } catch {
        responseData = responseText
      }

      const serverMessage = typeof responseData === 'object' && responseData
        ? String(responseData.message || responseData.error || '')
        : typeof responseData === 'string'
          ? responseData
          : ''

      let errorMessage = 'Unable to submit your application. Please try again later or contact us directly.'
      if (/mail server|could not deliver mail|TransportException|\b550\b/i.test(serverMessage)) {
        errorMessage = 'The application reached the server, but the confirmation email could not be delivered to that address. Use an email address that can receive mail and submit again. If you already sent this application, contact info@efengineering-architect.com before sending another copy.'
      } else if (response.status === 422 && responseData?.errors) {
        const validationErrors = Object.values(responseData.errors).flat()
        errorMessage = validationErrors.length > 0 ? String(validationErrors.join(', ')) : 'Validation error. Please check all fields and try again.'
      } else if (response.status === 413) {
        errorMessage = 'File too large. Please ensure your files are under 10MB and try again.'
      } else if (serverMessage.includes('extension() on null')) {
        errorMessage = 'File upload error. Please upload the CV and supporting document as PDF files and try again.'
      } else if (serverMessage) {
        errorMessage = serverMessage.length > 240 ? 'The application server could not finish saving your application. Please try again or contact info@efengineering-architect.com.' : serverMessage
      } else {
        errorMessage = `Server error (${response.status}). Please try again.`
      }

      setErrors(prev => ({ ...prev, notify: errorMessage }))
      setIsLoading(false)
    } catch (error: any) {
      const message = error?.message || ''
      const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError' || message.toLowerCase().includes('timeout')
      const errorMessage = timedOut
        ? 'The upload took too long. Please try again with a smaller PDF.'
        : 'Unable to reach the application server. Please try again in a moment.'

      setErrors(prev => ({
        ...prev,
        notify: errorMessage
      }))
      setIsLoading(false)
    }
  }

  // Calculate completion percentage based on actual field completion
  const calculateProgress = (): number => {
    let completedFields = 0
    let totalFields = 0

    const personalFields = ['f_name', 'm_name', 'l_name', 'birth_date', 'email', 'phone_no']
    personalFields.forEach(field => {
      totalFields++
      if (personalData[field as keyof PersonalData]) completedFields++
    })

    totalFields += 2
    if (personalData.cv) completedFields++
    if (personalData.supporting_doc) completedFields++

    return Math.min(Math.round((completedFields / totalFields) * 100), 100)
  }

  const progress = calculateProgress()

  // Store submission data for confirmation page
  const [submissionData, setSubmissionData] = useState<{
    jobTitle?: string
    applicantName?: string
    email?: string
    submittedAt?: Date
    files?: { name: string; size: number }[]
  } | null>(null)

  if (submitted || currentStep === 6) {
    return (
      <div 
        ref={(el) => el?.scrollIntoView({ behavior: 'smooth', block: 'start' })} 
        className="print-confirmation-only bg-white border border-[#10B981] rounded-lg p-4"
      >
          <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#10B981]/20 rounded-full mb-3">
              <HiOutlineCheckCircle className="w-6 h-6 text-[#10B981]" />
        </div>
            <h2 className="text-base font-bold text-gray-900 mb-2">
          Application Submitted Successfully!
        </h2>
            <p className="text-gray-600 text-sm">
          Thank you for your interest in joining EF Engineering. We've received your application and will review it shortly. 
            </p>
          </div>

          {/* Submission Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <HiOutlineClipboardDocumentCheck className="w-4 h-4 text-[#042970]" />
              Application Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Position Applied For</h4>
                <p className="text-sm font-bold text-gray-900">{jobTitle || 'Position'}</p>
                {personalData.job_id && (
                  <p className="text-xs text-gray-600 mt-0.5">Job ID: {personalData.job_id}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Applicant Information</h4>
                <p className="text-sm font-bold text-gray-900">
                  {personalData.f_name} {personalData.m_name} {personalData.l_name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{personalData.email}</p>
              </div>
              
              <div>
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Submission Date & Time</h4>
                <p className="text-sm font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Uploaded Documents</h4>
                <div className="space-y-1.5">
                  {personalData.cv && (
                    <div className="flex items-center gap-2 text-xs">
                      <HiOutlineDocumentText className="w-3.5 h-3.5 text-[#042970]" />
                      <span className="font-semibold text-gray-900">{personalData.cv.name}</span>
                      <span className="text-gray-500">
                        ({(personalData.cv.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                  {personalData.supporting_doc && (
                    <div className="flex items-center gap-2 text-xs">
                      <HiOutlineDocumentText className="w-3.5 h-3.5 text-[#042970]" />
                      <span className="font-semibold text-gray-900">{personalData.supporting_doc.name}</span>
                      <span className="text-gray-500">
                        ({(personalData.supporting_doc.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-br from-[#042970]/5 to-[#F54927]/5 border border-[#042970]/10 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <HiOutlineLightBulb className="w-4 h-4 text-[#F54927]" />
              What Happens Next?
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-[#042970] text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Application Review</h4>
                  <p className="text-gray-700 text-xs">
                    Our HR team will review your application within <strong>5-7 working days</strong>. We'll carefully assess your qualifications and experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-[#042970] text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Initial Screening</h4>
                  <p className="text-gray-700 text-xs">
                    If your profile matches our requirements, we'll contact you via email or phone for an initial screening interview.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-[#042970] text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Interview Process</h4>
                  <p className="text-gray-700 text-xs">
                    Selected candidates will be invited for technical and HR interviews. The process typically takes 1-2 weeks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Final Decision</h4>
                  <p className="text-gray-700 text-xs">
                    We'll notify you of the final decision via email. If selected, you'll receive an offer letter with details about your role and compensation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Have Questions?</h3>
            <p className="text-gray-700 text-xs mb-3">
              If you have any questions about your application or the recruitment process, please don't hesitate to contact us:
            </p>
            <div className="space-y-1.5">
              <p className="text-gray-700 text-xs">
                <strong>Email:</strong>{' '}
                <a href="mailto:info@efengineering.com" className="text-[#042970] font-semibold underline">
                  info@efengineering.com
                </a>
              </p>
              <p className="text-gray-700 text-xs">
                <strong>Expected Response Time:</strong> Within 5-7 working days
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 no-print">
          <Link
            href="/vacancy"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#042970] text-white font-semibold text-sm rounded-lg"
          >
            View Other Positions
              <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg"
            >
              <HiOutlineDocumentText className="w-5 h-5" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {(jobTitle || personalData.job_id) && (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <p className="text-sm font-semibold text-gray-900">Applying for {jobTitle || 'this vacancy'}</p>
          {personalData.job_id && (
            <p className="text-xs text-gray-600">Vacancy reference: {personalData.job_id}</p>
          )}
        </div>
      )}
      {/* Progress Indicator - Dynamic Based on Field Completion */}
      <div className="bg-white border border-[#042970] rounded-lg p-3 shadow-sm lg:sticky lg:top-24 z-20">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">Application Progress</h3>
            <div className="text-right">
              <div className="text-lg font-bold text-[#042970]">{progress}%</div>
              <p className="text-[10px] text-gray-600">Complete</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#F54927] via-[#F54927] to-[#d63e1f]"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Application form ${progress}% complete`}
            />
          </div>
          <p className="text-[10px] text-gray-500 text-right">
            {progress < 50 ? 'Keep going! Fill in more fields to complete your application.' : 
             progress < 80 ? 'Great progress! Almost there.' : 
             progress < 100 ? 'Almost complete! Review and submit.' : 
             'Ready to submit!'}
          </p>
          
          {/* Step Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((step) => {
              const isActive = currentStep === step
              const isCompleted = currentStep > step
              const stepLabels = ['Personal', 'Education', 'Experience', 'Certificates', 'Documents']
              
              // Check if step has data
              let stepHasData = false
              if (step === 1) {
                stepHasData = !!(personalData.f_name && personalData.email && personalData.phone_no)
              } else if (step === 2) {
                stepHasData = educationalData.length > 0
              } else if (step === 3) {
                stepHasData = experiences.length > 0
              } else if (step === 4) {
                stepHasData = certificates.length > 0
              } else if (step === 5) {
                stepHasData = !!personalData.cv
              }
              
              return (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step as Step)}
                  className={`p-2 rounded-lg border text-left ${
                    isActive
                      ? 'bg-[#042970] border-[#042970] text-white shadow-sm'
                      : stepHasData
                      ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                  aria-label={`Go to ${stepLabels[step - 1]} section`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? 'bg-white/20'
                        : stepHasData
                        ? 'bg-[#10B981]'
                        : 'bg-gray-200'
                    }`}>
                      {stepHasData && !isActive ? (
                        <HiOutlineCheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <span className={`text-xs font-bold ${isActive ? 'text-white' : ''}`}>{step}</span>
                      )}
                    </div>
                    <p className={`text-[10px] font-semibold ${
                      isActive ? 'text-white' : stepHasData ? 'text-[#10B981]' : 'text-gray-500'
                    }`}>
                      {stepLabels[step - 1]}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {errors.notify && (
        <div className="p-3 bg-[#F54927]/10 border border-[#F54927] rounded-lg" role="alert" aria-live="polite">
          <p className="text-[#F54927] font-semibold text-sm">{errors.notify}</p>
        </div>
      )}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="standard-card p-4 bg-gradient-to-br from-white via-[#042970]/5 to-white border border-gray-200">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Personal <span className="text-[#F54927]">Information</span>
            </h2>
            <p className="text-gray-600 text-xs">Please provide your personal details</p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  First Name <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="f_name"
                    value={personalData.f_name}
                    onChange={handlePersonalDataChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.f_name
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="Your First Name"
                    aria-label="First name"
                    aria-required="true"
                    aria-invalid={!!errors.f_name}
                    aria-describedby={errors.f_name ? 'f_name-error' : undefined}
                  />
                </div>
                {errors.f_name && (
                  <p id="f_name-error" className="mt-1 text-xs text-[#F54927] font-semibold" role="alert">
                    {errors.f_name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Middle Name (Father Name) <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="m_name"
                    value={personalData.m_name}
                    onChange={handlePersonalDataChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.m_name
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="Your Middle Name"
                  />
                </div>
                {errors.m_name && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{errors.m_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Last Name (Grandfather Name) <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="l_name"
                    value={personalData.l_name}
                    onChange={handlePersonalDataChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.l_name
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="Your Last Name"
                  />
                </div>
                {errors.l_name && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{errors.l_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Birth Date <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="birth_date"
                    value={personalData.birth_date}
                    onChange={handlePersonalDataChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.birth_date
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                  />
                </div>
                {errors.birth_date && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{errors.birth_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Email Address <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={personalData.email}
                    onChange={handlePersonalDataChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.email
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="your.email@example.com"
                    aria-label="Email address"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-[#F54927] font-semibold" role="alert">
                    {errors.email}
                  </p>
                )}
                {aiSuggestions.email && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#042970] bg-[#042970]/10 px-2 py-1.5 rounded-lg">
                    <HiOutlineSparkles className="w-3 h-3" />
                    <span className="text-xs">Suggestion: {aiSuggestions.email}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPersonalData(prev => ({ ...prev, email: aiSuggestions.email! }))
                        setAiSuggestions(prev => {
                          const newSuggestions = { ...prev }
                          delete newSuggestions.email
                          return newSuggestions
                        })
                      }}
                      className="ml-auto text-[#042970] font-semibold text-xs"
                    >
                      Use
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Phone Number <span className="text-[#F54927]">*</span>
                </label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone_no"
                    value={personalData.phone_no}
                    onChange={handlePersonalDataChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.phone_no
                        ? 'border-[#F54927] focus:ring-[#F54927]'
                        : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                    }`}
                    placeholder="0912345678"
                  />
                </div>
                {errors.phone_no && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{errors.phone_no}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  City
                </label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={personalData.city}
                    onChange={handlePersonalDataChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] text-sm"
                    placeholder="Your City"
                  />
                </div>
                {aiSuggestions.city && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#042970] bg-[#042970]/10 px-2 py-1.5 rounded-lg">
                    <HiOutlineLightBulb className="w-3 h-3" />
                    <span className="text-xs">Did you mean: {aiSuggestions.city}?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPersonalData(prev => ({ ...prev, city: aiSuggestions.city! }))
                        setAiSuggestions(prev => {
                          const newSuggestions = { ...prev }
                          delete newSuggestions.city
                          return newSuggestions
                        })
                      }}
                      className="ml-auto text-[#042970] font-semibold text-xs"
                    >
                      Use
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Sub City
                </label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="sub_city"
                    value={personalData.sub_city}
                    onChange={handlePersonalDataChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] text-sm"
                    placeholder="Your Sub City"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Woreda
                </label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="woreda"
                    value={personalData.woreda}
                    onChange={handlePersonalDataChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] text-sm"
                    placeholder="Your Woreda"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Educational Information */}
      {currentStep === 2 && (
        <div className="standard-card p-4 bg-gradient-to-br from-white via-[#042970]/5 to-white border border-gray-200">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Educational <span className="text-[#F54927]">Information</span>
            </h2>
            <p className="text-gray-600 text-xs mb-2">
              Optional. Add education entries if you want, or continue to the next step without them.
            </p>
          </div>
          
          {/* Success Toast */}
          {showEducationToast && (
            <div className="mb-3 p-2.5 bg-[#10B981]/10 border border-[#10B981] rounded-lg">
              <p className="text-[#10B981] font-semibold text-xs flex items-center gap-1.5">
                <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                Successfully added! You can add more qualifications.
              </p>
            </div>
          )}
          
          {/* Add Education Form */}
          <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Field of Study
                </label>
                <input
                  type="text"
                  name="study_field"
                  value={currentEducation.study_field}
                  onChange={(e) => {
                    setCurrentEducation(prev => ({ ...prev, study_field: e.target.value }))
                    if (educationErrors.study_field) {
                      setEducationErrors(prev => ({ ...prev, study_field: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    educationErrors.study_field
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="e.g., Computer Science"
                />
                {educationErrors.study_field && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{educationErrors.study_field}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Institution Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={currentEducation.company}
                  onChange={(e) => {
                    setCurrentEducation(prev => ({ ...prev, company: e.target.value }))
                    if (educationErrors.company) {
                      setEducationErrors(prev => ({ ...prev, company: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    educationErrors.company
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="University/College Name"
                />
                {educationErrors.company && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{educationErrors.company}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Qualification
                </label>
                <input
                  type="text"
                  name="degree_type"
                  value={currentEducation.degree_type}
                  onChange={(e) => {
                    setCurrentEducation(prev => ({ ...prev, degree_type: e.target.value }))
                    if (educationErrors.degree_type) {
                      setEducationErrors(prev => ({ ...prev, degree_type: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    educationErrors.degree_type
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="e.g., Bachelor's Degree"
                />
                {educationErrors.degree_type && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{educationErrors.degree_type}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={currentEducation.start_date}
                  onChange={(e) => {
                    setCurrentEducation(prev => ({ ...prev, start_date: e.target.value }))
                    if (educationErrors.start_date) {
                      setEducationErrors(prev => ({ ...prev, start_date: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    educationErrors.start_date
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                />
                {educationErrors.start_date && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{educationErrors.start_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={currentEducation.end_date}
                  onChange={(e) => {
                    setCurrentEducation(prev => ({ ...prev, end_date: e.target.value }))
                    if (educationErrors.end_date) {
                      setEducationErrors(prev => ({ ...prev, end_date: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    educationErrors.end_date
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                />
                {educationErrors.end_date && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{educationErrors.end_date}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white font-semibold text-sm rounded-lg"
              >
                <HiOutlineAcademicCap className="w-5 h-5" />
                Add Education
              </button>
            </div>
          </div>
          
          {/* Added Educations List */}
          {educationalData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Added Qualifications:</h3>
              {educationalData.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{edu.study_field} - {edu.degree_type}</p>
                    <p className="text-sm text-gray-600">{edu.company}</p>
                    <p className="text-xs text-gray-500">{edu.start_date} to {edu.end_date}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="ml-4 p-2 text-[#F54927] rounded-lg"
                  >
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Experience */}
      {currentStep === 3 && (
        <div className="standard-card p-4 bg-gradient-to-br from-white via-[#042970]/5 to-white border border-gray-200">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Work <span className="text-[#F54927]">Experience</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Optional. Add work experience if you want, or continue without it.
            </p>
          </div>
          
          {/* Success Toast */}
          {showExperienceToast && (
            <div className="mb-6 p-4 bg-[#10B981]/10 border-2 border-[#10B981] rounded-xl">
              <p className="text-[#10B981] font-bold text-sm sm:text-base flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5" />
                Successfully added! You can add more experiences.
              </p>
            </div>
          )}
          
          {/* Add Experience Form */}
          <div className="border-2 border-gray-200 rounded-xl p-5 sm:p-6 mb-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Position
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentExperience.title}
                  onChange={(e) => {
                    setCurrentExperience(prev => ({ ...prev, title: e.target.value }))
                    if (experienceErrors.title) {
                      setExperienceErrors(prev => ({ ...prev, title: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    experienceErrors.title
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="e.g., Software Engineer"
                />
                {experienceErrors.title && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{experienceErrors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={currentExperience.company}
                  onChange={(e) => {
                    setCurrentExperience(prev => ({ ...prev, company: e.target.value }))
                    if (experienceErrors.company) {
                      setExperienceErrors(prev => ({ ...prev, company: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    experienceErrors.company
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="Company Name"
                />
                {experienceErrors.company && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{experienceErrors.company}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={currentExperience.start_date}
                  onChange={(e) => {
                    setCurrentExperience(prev => ({ ...prev, start_date: e.target.value }))
                    if (experienceErrors.start_date) {
                      setExperienceErrors(prev => ({ ...prev, start_date: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    experienceErrors.start_date
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                />
                {experienceErrors.start_date && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{experienceErrors.start_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={currentExperience.end_date}
                  onChange={(e) => {
                    setCurrentExperience(prev => ({ ...prev, end_date: e.target.value }))
                    if (experienceErrors.end_date) {
                      setExperienceErrors(prev => ({ ...prev, end_date: '' }))
                    }
                  }}
                  disabled={currentExperience.is_current}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    currentExperience.is_current ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${
                    experienceErrors.end_date
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                />
                {experienceErrors.end_date && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{experienceErrors.end_date}</p>
                )}
                <label className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentExperience.is_current}
                    onChange={(e) => {
                      setCurrentExperience(prev => ({ ...prev, is_current: e.target.checked, end_date: e.target.checked ? '' : prev.end_date }))
                      if (experienceErrors.end_date) {
                        setExperienceErrors(prev => ({ ...prev, end_date: '' }))
                      }
                    }}
                    className="w-4 h-4 text-[#F54927] border-gray-300 rounded focus:ring-[#F54927]"
                  />
                  <span className="text-sm text-gray-700">Current Position</span>
                </label>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Summary (Optional)
                </label>
                <textarea
                  name="summary"
                  value={currentExperience.summary}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:border-[#F54927] text-sm sm:text-base resize-none"
                  placeholder="Brief description of your responsibilities and achievements..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white font-semibold text-sm rounded-lg"
              >
                <HiOutlineBriefcase className="w-5 h-5" />
                Add Experience
              </button>
            </div>
          </div>
          
          {/* Added Experiences List */}
          {experiences.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Added Experiences:</h3>
              {experiences.map((exp, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{exp.title}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-xs text-gray-500">
                      {exp.start_date} to {exp.is_current ? 'Present' : exp.end_date}
                    </p>
                    {exp.summary && (
                      <p className="text-sm text-gray-700 mt-2">{exp.summary}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="ml-4 p-2 text-[#F54927] rounded-lg"
                  >
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Certificates */}
      {currentStep === 4 && (
        <div className="standard-card p-4 bg-gradient-to-br from-white via-[#042970]/5 to-white border border-gray-200">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Professional <span className="text-[#F54927]">Certificates</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Optional. Add certificates if you want, or continue to documents without them.
            </p>
          </div>
          
          {/* Success Toast */}
          {showCertificateToast && (
            <div className="mb-6 p-4 bg-[#10B981]/10 border-2 border-[#10B981] rounded-xl">
              <p className="text-[#10B981] font-bold text-sm sm:text-base flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5" />
                Successfully added! You can add more certificates.
              </p>
            </div>
          )}
          
          {/* Add Certificate Form */}
          <div className="border-2 border-gray-200 rounded-xl p-5 sm:p-6 mb-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Certificate Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentCertificate.title}
                  onChange={(e) => {
                    setCurrentCertificate(prev => ({ ...prev, title: e.target.value }))
                    if (certificateErrors.title) {
                      setCertificateErrors(prev => ({ ...prev, title: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    certificateErrors.title
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
                {certificateErrors.title && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{certificateErrors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Issued By
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={currentCertificate.issuer}
                  onChange={(e) => {
                    setCurrentCertificate(prev => ({ ...prev, issuer: e.target.value }))
                    if (certificateErrors.issuer) {
                      setCertificateErrors(prev => ({ ...prev, issuer: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    certificateErrors.issuer
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  placeholder="Issuing Organization"
                />
                {certificateErrors.issuer && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{certificateErrors.issuer}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Issued Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={currentCertificate.date}
                  onChange={(e) => {
                    setCurrentCertificate(prev => ({ ...prev, date: e.target.value }))
                    if (certificateErrors.date) {
                      setCertificateErrors(prev => ({ ...prev, date: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    certificateErrors.date
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                />
                {certificateErrors.date && (
                  <p className="mt-1 text-xs text-[#F54927] font-semibold">{certificateErrors.date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Summary (Optional)
                </label>
                <input
                  type="text"
                  name="summary"
                  value={currentCertificate.summary}
                  onChange={(e) => setCurrentCertificate(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:border-[#F54927] text-sm sm:text-base"
                  placeholder="Brief description"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={addCertificate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white font-semibold text-sm rounded-lg"
              >
                <HiOutlineClipboardDocumentCheck className="w-5 h-5" />
                Add Certificate
              </button>
            </div>
          </div>
          
          {/* Added Certificates List */}
          {certificates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Added Certificates:</h3>
              {certificates.map((cert, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{cert.title}</p>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">Issued: {cert.date}</p>
                    {cert.summary && (
                      <p className="text-sm text-gray-700 mt-2">{cert.summary}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    className="ml-4 p-2 text-[#F54927] rounded-lg"
                  >
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Documents */}
      {currentStep === 5 && (
        <div className="standard-card p-4 bg-gradient-to-br from-white via-[#042970]/5 to-white border border-gray-200">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Upload <span className="text-[#F54927]">Documents</span>
            </h2>
            <p className="text-gray-600 text-xs">
              Upload your CV and supporting documents here in PDF format. Click Submit button to finish your application.
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Upload your CV (PDF format) <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineDocumentText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F54927]/10 file:text-[#F54927] ${
                    errors.cv
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  required
                  aria-label="Upload CV (PDF format)"
                  aria-required="true"
                  aria-invalid={!!errors.cv}
                  aria-describedby={errors.cv ? 'cv-error' : undefined}
                />
              </div>
              {errors.cv && (
                <p id="cv-error" className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold" role="alert">
                  {errors.cv}
                </p>
              )}
              {personalData.cv && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#10B981]">
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  <span className="font-semibold">{personalData.cv.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(personalData.cv.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                Upload Certificate and Supporting Documents (PDF format) <span className="text-[#F54927]">*</span>
              </label>
              <div className="relative">
                <HiOutlineDocumentText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  name="supporting_doc"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F54927]/10 file:text-[#F54927] ${
                    errors.supporting_doc
                      ? 'border-[#F54927] focus:ring-[#F54927]'
                      : 'border-gray-300 focus:ring-[#F54927] focus:border-[#F54927]'
                  }`}
                  required
                  aria-label="Upload Certificate and Supporting Documents (PDF format)"
                  aria-required="true"
                  aria-invalid={!!errors.supporting_doc}
                  aria-describedby={errors.supporting_doc ? 'supporting_doc-error' : undefined}
                />
              </div>
              {errors.supporting_doc && (
                <p id="supporting_doc-error" className="mt-1.5 text-xs sm:text-sm text-[#F54927] font-semibold" role="alert">
                  {errors.supporting_doc}
                </p>
              )}
              {personalData.supporting_doc && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#10B981]">
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  <span className="font-semibold">{personalData.supporting_doc.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(personalData.supporting_doc.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm"
          >
            <HiOutlineArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Previous
          </button>
        )}
        
        {currentStep < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg text-sm ${
              currentStep === 1 ? 'ml-auto' : ''
            } bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white`}
          >
            Next Step
            <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submitApplication}
            disabled={isLoading || !personalData.cv || !personalData.supporting_doc}
            className={`inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 font-bold rounded-lg sm:rounded-xl text-sm sm:text-base ml-auto ${
              personalData.cv && personalData.supporting_doc && !isLoading
                ? 'bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <span>⏳</span>
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <HiOutlinePaperAirplane className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

