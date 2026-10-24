'use client'
import Header from '../../components/Header'
import Reveal from '../../components/Reveal'
import { useState } from 'react'
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2'

const faqs = [
  {
    question: 'What services does EF Engineering provide?',
    answer: 'We provide comprehensive architectural and engineering consulting services including architectural design, structural engineering, project management, construction supervision, and sustainability consulting. Our services cater to residential, commercial, industrial, and infrastructure projects.'
  },
  {
    question: 'How long does a typical project take to complete?',
    answer: 'Project duration varies depending on complexity, scope, and size. Small residential projects may take 3-6 months, while large commercial or industrial projects can take 1-3 years. We provide detailed project timelines during the initial consultation phase.'
  },
  {
    question: 'What is your design process?',
    answer: 'Our design process includes initial consultation, concept development, schematic design, design development, construction documentation, and construction administration. We involve clients at every stage to ensure their vision is realized.'
  },
  {
    question: 'Do you provide services outside Addis Ababa?',
    answer: 'Yes, we provide our services throughout Ethiopia and have experience working on projects in various regions including Dire Dawa, Bahir Dar, Hawassa, and Mekelle. We also have the capability to work on international projects through our network of partners.'
  },
  {
    question: 'How can I request a project quote?',
    answer: 'You can request a project quote by contacting us through our website contact form, calling our office directly, or sending an email to info@efengineering.com. Please provide project details, requirements, and any relevant documentation to help us prepare an accurate quote.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="responsive-container py-10 sm:py-12 md:py-16">
        <Reveal variant="up" delay={0}>
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#042970] mb-3 sm:mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-2xl">
              Find answers to common questions about our services, processes, and company policies.
            </p>
          </div>
        </Reveal>
        
        <div className="space-y-4 sm:space-y-5">
          {faqs.map((faq, index) => (
            <Reveal key={index} variant="up" delay={index * 100}>
              <div className="standard-card interactive-card-3d p-0 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-300"
                >
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#042970] pr-4">
                    {faq.question}
                  </h2>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <HiOutlineChevronUp className="w-5 h-5 text-[#F54927] transition-transform duration-300" />
                    ) : (
                      <HiOutlineChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  )
}