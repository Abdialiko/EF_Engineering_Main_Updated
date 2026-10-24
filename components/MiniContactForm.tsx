"use client";
import React, { useState } from 'react';
import { HiOutlinePaperAirplane, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import apiCall from '../lib/apiCall';
import validate from '../lib/contactValidation';

interface MiniContactFormProps {
  formType?: 'client' | 'partner';
  title?: string;
  subtitle?: string;
}

const MiniContactForm: React.FC<MiniContactFormProps> = ({ 
  formType = 'client',
  title = 'Get in Touch',
  subtitle = 'Send us a quick message'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);

    const validationErrors = validate({
      ...formData,
      address: '',
      service_id: ''
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        message: formData.message || `${formType === 'partner' ? 'Partnership' : 'Client'} inquiry from ${formData.name}`,
        address: '',
        service_id: ''
      };

      const response = await apiCall.post('contacts', submitData);

      if (response.status === 201 || response.status === 200) {
        setFormData({ name: '', email: '', phone_no: '', message: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F54927]/5 to-[#042970]/5 rounded-full -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name *"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#F54927]'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email *"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#F54927]'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              placeholder="Phone Number *"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 ${
                errors.phone_no ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#F54927]'
              }`}
            />
            {errors.phone_no && (
              <p className="text-red-500 text-xs mt-1">{errors.phone_no}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={`Your ${formType === 'partner' ? 'partnership' : 'inquiry'} message...`}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 resize-none ${
                errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#F54927]'
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#F54927] to-[#042970] text-white py-3 px-6 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <HiOutlinePaperAirplane className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {showSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg animate-fade-in">
              <HiOutlineCheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
            </div>
          )}

          {showError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg animate-fade-in">
              <HiOutlineXCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Failed to send message. Please try again.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MiniContactForm;

