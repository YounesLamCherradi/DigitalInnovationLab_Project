import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import { HeroSection } from '@/components/shared/HeroSection';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Moved outside component — stable references, no re-creation on render
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Input length limits
const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  subject: 200,
  message: 5000,
};

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: ['Al Akhawayn University', 'Ifrane, Morocco'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+212 5 35 86 40 40'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['dil@aui.ma'],
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const limit = LIMITS[name as keyof typeof LIMITS];
    setFormData((prev) => ({ ...prev, [name]: limit ? value.slice(0, limit) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await api
        .from('contact_submissions')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }]);

      if (dbError) throw new Error(dbError.message);

      // Formspree — endpoint from env var
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
      if (formspreeId) {
        try {
          const emailResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              subject: formData.subject,
              message: formData.message,
            }),
          });
          if (!emailResponse.ok) {
            console.warn('Email notification failed, but form was saved.');
          }
        } catch (emailErr) {
          console.warn('Email service error, form saved:', emailErr);
        }
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border-b-2 border-primary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-primary mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Get In Touch
            </motion.h1>
            <motion.p
              className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ready to collaborate? We're here to help and answer any question you might have.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {[
                { icon: Mail, text: 'Email us', color: 'text-primary' },
                { icon: Phone, text: 'Call us', color: 'text-secondary' },
                { icon: MapPin, text: 'Visit us', color: 'text-primary' },
              ].map((option, idx) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${idx % 2 === 0 ? 'border-primary/30 hover:border-primary/60 hover:bg-primary/5' : 'border-secondary/30 hover:border-secondary/60 hover:bg-secondary/5'} transition-all duration-300`}
                  >
                    <Icon size={18} className={option.color} />
                    <span className="font-semibold text-gray-800 text-sm">{option.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              className="lg:col-span-1"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="space-y-6">
                {contactInfo.map((info, idx) => {
                  const Icon = info.icon;
                  const isGreen = idx % 2 === 0;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="group"
                    >
                      <div className="relative h-full">
                        <motion.div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${isGreen ? 'from-primary/20 to-primary-dark/20' : 'from-secondary/20 to-secondary-dark/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
                        />
                        <AnimatedCard
                          variant="default"
                          className={`relative p-8 text-center shadow-lg group-hover:shadow-2xl transition-all duration-300 ${isGreen ? 'border-primary/20 group-hover:border-primary/50' : 'border-secondary/20 group-hover:border-secondary/50'} border-2`}
                        >
                          <motion.div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isGreen ? 'from-primary/20 to-primary/10' : 'from-secondary/20 to-secondary/10'} flex items-center justify-center mx-auto mb-4`}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <Icon className={`w-8 h-8 ${isGreen ? 'text-primary' : 'text-secondary'}`} />
                          </motion.div>
                          <h3 className={`text-xl font-bold mb-3 ${isGreen ? 'text-primary group-hover:text-primary-dark' : 'text-secondary group-hover:text-secondary-dark'} transition-colors`}>
                            {info.title}
                          </h3>
                          <div className="space-y-2">
                            {info.details.map((detail, i) => (
                              <p key={i} className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </AnimatedCard>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 sm:p-10 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold text-primary mb-2">Send us a Message</h2>
                <p className="text-gray-600 text-sm mb-8">
                  We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        maxLength={LIMITS.name}
                        className="bg-white/80 border-primary/20 hover:border-primary/50 focus:border-primary focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        maxLength={LIMITS.email}
                        className="bg-white/80 border-primary/20 hover:border-primary/50 focus:border-primary focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212 6 XX XX XX XX"
                        maxLength={LIMITS.phone}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Subject *</label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                        required
                        maxLength={LIMITS.subject}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Message * <span className="text-xs font-normal text-gray-400">({formData.message.length}/{LIMITS.message})</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please tell us more about your inquiry..."
                      required
                      maxLength={LIMITS.message}
                      className="bg-white/80 border-primary/20 hover:border-primary/50 focus:border-primary focus:ring-primary/50 transition-all h-32 rounded-lg"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Success message */}
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="p-4 bg-green-100 border-2 border-green-500 text-green-800 rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                    >
                      <span>✓</span>
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-4 font-bold flex items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                  >
                    <Send size={20} />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          <SectionHeader title="Locations" subtitle="Visit us or connect with our offices" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { office: 'Main Campus', address: 'Al Akhawayn University, Ifrane', phone: '+212 5 35 86 40 40', hours: 'Mon - Fri: 9:00 AM - 5:00 PM', isGreen: true },
              { office: 'SSE School Lab', address: 'Al Akhawayn University, Building 5, SSE School', phone: '+212 5 35 86 40 40', hours: 'Mon - Fri: 9:00 AM - 5:00 PM', isGreen: false },
            ].map((location, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="group">
                <div className="relative h-full">
                  <motion.div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${location.isGreen ? 'from-primary/25 to-primary-dark/25' : 'from-secondary/25 to-secondary-dark/25'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                  <AnimatedCard variant="default" className={`relative p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 ${location.isGreen ? 'border-primary/30 group-hover:border-primary/60' : 'border-secondary/30 group-hover:border-secondary/60'}`}>
                    <h3 className={`text-2xl font-bold mb-6 ${location.isGreen ? 'text-primary group-hover:text-primary-dark' : 'text-secondary group-hover:text-secondary-dark'} transition-colors`}>{location.office}</h3>
                    <div className="space-y-4 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      <p className="flex items-start gap-3"><MapPin size={18} className={`${location.isGreen ? 'text-primary' : 'text-secondary'} mt-0.5 flex-shrink-0`} /><span className="font-medium">{location.address}</span></p>
                      <p className="flex items-center gap-3"><Phone size={18} className={`${location.isGreen ? 'text-primary' : 'text-secondary'} flex-shrink-0`} /><a href={`tel:${location.phone}`} className={`font-semibold ${location.isGreen ? 'hover:text-primary' : 'hover:text-secondary'} transition-colors`}>{location.phone}</a></p>
                      <p className="flex items-center gap-3"><Mail size={18} className={`${location.isGreen ? 'text-primary' : 'text-secondary'} flex-shrink-0`} /><span className="font-medium">{location.hours}</span></p>
                    </div>
                  </AnimatedCard>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
