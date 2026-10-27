'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, Phone, Mail, Clock, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Bespoke & Custom Tailoring',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you! Your message has been sent. Our style consultant will reach out to you shortly.', {
        duration: 5000,
        icon: '✨',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Bespoke & Custom Tailoring',
        message: '',
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-16 bg-white relative border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-3" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', color: '#a18143', background: 'rgba(212, 175, 55, 0.05)' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
            Connect With Us
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-4">
            Let&apos;s Create Your <span className="italic font-light" style={{ color: '#D4AF37' }}>Next Look</span>
          </h2>
          <p className="text-zinc-500 font-inter text-base">
            Have questions about custom sizing, bridal fittings, or an existing order? Send us a message or chat with our styling team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Channels & WhatsApp */}
          <div className="lg:col-span-5 bg-zinc-900 text-white rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
            {/* Background luxury gradient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" style={{ background: 'rgba(212, 175, 55, 0.12)' }} />
            
            <h3 className="text-2xl font-serif mb-2 text-white">Direct Inquiries</h3>
            <p className="text-zinc-400 text-sm mb-8">
              Speak directly with our dedicated fashion consultants in Lagos.
            </p>

            {/* WhatsApp Quick Action Button */}
            <a
              href="https://wa.me/2348105535967?text=Hello%20T%26D%20Fashion%20Trend,%20I%20would%20like%20to%20inquire%20about..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide text-zinc-900 transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-8"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: '#ffffff' }}
            >
              <MessageSquare className="w-5 h-5" />
              Chat on WhatsApp
            </a>

            {/* Quick Contact Details List */}
            <div className="space-y-6 pt-6 border-t border-zinc-800">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-gold-400 flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Call / WhatsApp</h4>
                  <a href="tel:+2348105535967" className="text-sm font-medium text-zinc-200 mt-0.5 block hover:text-gold-400 transition-colors">
                    +234 810 553 5967
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-gold-400 flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Support</h4>
                  <p className="text-sm font-medium text-zinc-200 mt-0.5">contact@tdfashiontrend.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-gold-400 flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Consultation Hours</h4>
                  <p className="text-sm font-medium text-zinc-200 mt-0.5">Mon – Sat: 9:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-8 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Amaka Okafor"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="amaka@example.com"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                  >
                    <option value="Bespoke & Custom Tailoring">Bespoke & Custom Tailoring</option>
                    <option value="Bridal & Occasion Wear">Bridal & Occasion Wear</option>
                    <option value="General Product Inquiry">General Product Inquiry</option>
                    <option value="Order Status & Delivery">Order Status & Delivery</option>
                    <option value="Wholesale & Bulk Orders">Wholesale & Bulk Orders</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Your Message / Fitting Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the gown style, shoe size, or specific requirements you have in mind..."
                  className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 text-zinc-900"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
