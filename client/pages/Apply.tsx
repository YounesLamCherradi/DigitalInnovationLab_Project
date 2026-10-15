import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Award, Trophy, Users, Microscope, FileText, Network } from 'lucide-react';
import { HeroSection } from '@/components/shared/HeroSection';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, submitApplication, type Opportunity } from '@/lib/api';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  resume: File | null;
}


// Moved outside component — stable references prevent re-creation on every render
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Input length limits
const FORM_LIMITS = {
  fullName: 100,
  email: 254,
  phone: 30,
  coverLetter: 5000,
};

const Apply = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Opportunity | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    resume: null,
  });

  const OPPORTUNITIES_PER_PAGE = 9;

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const { data, error } = await api
          .from('opportunities')
          .select('*')
          .order('deadline', { ascending: true });

        if (error) throw error;
        setOpportunities(data || []);
        setCurrentPage(1);
        setSearchQuery('');
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filter opportunities based on search query
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      opportunity.title.toLowerCase().includes(searchLower) ||
      opportunity.description.toLowerCase().includes(searchLower) ||
      opportunity.department.toLowerCase().includes(searchLower) ||
      opportunity.type.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOpportunities.length / OPPORTUNITIES_PER_PAGE);
  const startIndex = (currentPage - 1) * OPPORTUNITIES_PER_PAGE;
  const endIndex = startIndex + OPPORTUNITIES_PER_PAGE;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of opportunities section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleOpenModal = (opportunity: Opportunity) => {
    setSelectedPosition(opportunity);
    setFormData((prev) => ({ ...prev, position: opportunity.title }));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      coverLetter: '',
      resume: null,
    });
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be smaller than 5 MB.');
      return;
    }
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Only PDF files are accepted.'); e.target.value = ''; return; }
    if (file.size > 5 * 1024 * 1024) { alert('File must be smaller than 5 MB.'); e.target.value = ''; return; }
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      if (!formData.resume) throw new Error('Please attach your résumé as a PDF.');
      const { error } = await submitApplication({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        opportunity_id: selectedPosition?.id,
        cover_letter: formData.coverLetter,
        resume: formData.resume,
      });

      if (error) {
        throw error;
      }

      setSubmitMessage({
        type: 'success',
        text: 'Application submitted successfully! We will review your application and get back to you soon.',
      });

      // Reset form
      setTimeout(() => {
        handleCloseModal();
        setSubmitMessage(null);
      }, 2000);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Compact Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-secondary to-secondary-dark overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        ></motion.div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Join Our Team
          </motion.h1>
          <motion.p
            className="text-lg text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Help us shape the future of digital innovation
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-white to-secondary/5 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 1 }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              What We Offer
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              Exceptional benefits and opportunities to grow your career while making a global impact
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            {[
              {
                icon: Award,
                title: 'Professional Certificates',
                description: 'Earn recognized professional certifications and credentials that advance your career and expertise in the field.',
              },
              {
                icon: Trophy,
                title: 'Recognition & Awards',
                description: 'Receive recognition for outstanding contributions, achievements, and excellence in research and innovation.',
              },
              {
                icon: Users,
                title: 'Work With Experts',
                description: 'Collaborate directly with world-class researchers and industry experts from leading institutions globally.',
              },
              {
                icon: Microscope,
                title: 'Top-Level Research',
                description: 'Engage in cutting-edge research projects that push boundaries and make meaningful impact on innovation.',
              },
              {
                icon: FileText,
                title: 'Paper Submission Support',
                description: 'Access to publishing support, conference submissions, and opportunities to share research with the world.',
              },
              {
                icon: Network,
                title: 'Compensation & Network',
                description: 'Competitive compensation packages and access to continental networks of innovators and researchers.',
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              const isBlueCard = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                  whileHover={{ y: -12 }}
                  className="group"
                >
                  <div className="relative h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl border transition-all duration-500 shadow-lg group-hover:shadow-xl ${
                      isBlueCard
                        ? 'border-secondary/20 group-hover:border-secondary/50'
                        : 'border-primary/20 group-hover:border-primary/50'
                    }`}></div>

                    <div className="relative z-10 p-8 h-full flex flex-col">
                      <motion.div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                          isBlueCard
                            ? 'bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/20'
                            : 'bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon size={28} className={isBlueCard ? 'text-secondary' : 'text-primary'} />
                      </motion.div>

                      <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                        isBlueCard
                          ? 'text-secondary group-hover:text-secondary-dark'
                          : 'text-primary group-hover:text-primary-dark'
                      }`}>
                        {benefit.title}
                      </h3>

                      <p className="text-gray-700 leading-relaxed flex-grow group-hover:text-gray-800 transition-colors">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Open Positions"
            subtitle="Explore exciting opportunities to grow your career with us"
          />

          {/* Search Filter */}
          <motion.div
            className="mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search positions by title, department, or keywords..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-5 py-3 pl-12 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors placeholder-gray-500 text-gray-700"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <motion.button
                  onClick={handleClearSearch}
                  className="px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear
                </motion.button>
              )}
            </div>
            <motion.p
              className="text-sm text-gray-600 mt-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {filteredOpportunities.length} position{filteredOpportunities.length !== 1 ? 's' : ''} found
            </motion.p>
          </motion.div>

          {loading ? (
            <motion.div
              className="flex md:grid gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {[...Array(6)].map((_, idx) => (
                <motion.div
                  key={`skeleton-${idx}`}
                  className="flex-shrink-0 md:flex-shrink w-80 md:w-auto"
                  variants={itemVariants}
                >
                  <div className="rounded-2xl border-2 border-primary/20 bg-white shadow-lg overflow-hidden p-6 h-full">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="space-y-2 pt-4">
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex md:grid gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:grid-cols-2 lg:grid-cols-3"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paginatedOpportunities.map((opportunity, idx) => (
              <motion.div
                key={opportunity.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => handleOpenModal(opportunity)}
                className="flex-shrink-0 md:flex-shrink w-80 md:w-auto"
              >
                <div className="group relative h-full cursor-pointer">
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4 + idx * 0.5,
                      repeat: Infinity,
                      repeatType: 'mirror'
                    }}
                  ></motion.div>

                  {/* Card container with border animation */}
                  <motion.div
                    className="relative h-full rounded-2xl border-2 border-primary/20 bg-white shadow-lg group-hover:shadow-2xl group-hover:border-primary/50 transition-all duration-500 overflow-hidden"
                    whileHover={{
                      borderColor: 'var(--primary-color)',
                      boxShadow: '0 20px 40px rgba(27, 138, 82, 0.2)'
                    }}
                  >
                    {/* Animated top border accent */}
                    <motion.div
                      className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      whileHover={{ scaleX: 1.2 }}
                      transition={{
                        delay: idx * 0.1,
                        duration: 0.8,
                        type: 'spring'
                      }}
                      style={{ originX: 0 }}
                    ></motion.div>

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      {/* Header with animated title */}
                      <motion.div
                        className="flex justify-between items-start mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 + 0.1, duration: 0.5 }}
                      >
                        <div className="flex-1">
                          <motion.h3
                            className="text-xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300"
                            whileHover={{ x: 4 }}
                          >
                            {opportunity.title}
                          </motion.h3>
                          <motion.p
                            className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 + 0.15, duration: 0.5 }}
                          >
                            {opportunity.department}
                          </motion.p>
                          <motion.div
                            className="flex gap-2 mt-2 flex-wrap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                          >
                            {opportunity.school && (
                              <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                                School: <span className="text-primary font-bold">{opportunity.school}</span>
                              </span>
                            )}
                            {opportunity.term && (
                              <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                                Term: <span className="text-secondary font-bold">{opportunity.term}</span>
                              </span>
                            )}
                            {opportunity.education_level && (
                              <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                                Level: <span className="text-blue-600 font-bold">
                                  {opportunity.education_level === 'both'
                                    ? 'Underg/Grad'
                                    : opportunity.education_level}
                                </span>
                              </span>
                            )}
                          </motion.div>
                        </div>
                        <motion.span
                          className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold border border-primary/30 group-hover:bg-primary/30 group-hover:border-primary/60 transition-all"
                          whileHover={{ scale: 1.1 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.05 + 0.2, duration: 0.4, type: 'spring' }}
                        >
                          {opportunity.level}
                        </motion.span>
                      </motion.div>

                      {/* Description with stagger */}
                      <motion.p
                        className="text-gray-600 text-sm mb-4 leading-relaxed group-hover:text-gray-800 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 + 0.25, duration: 0.5 }}
                      >
                        {opportunity.description}
                      </motion.p>

                      {/* Requirements with animated badges */}
                      <motion.div
                        className="mb-4 flex-grow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 + 0.3, duration: 0.5 }}
                      >
                        <p className="text-xs font-semibold text-gray-700 mb-2">Requirements:</p>
                        <motion.div
                          className="flex flex-wrap gap-2"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.05,
                                delayChildren: idx * 0.05 + 0.35,
                              },
                            },
                          }}
                          initial="hidden"
                          animate="visible"
                        >
                          {opportunity.requirements.map((req, reqIdx) => (
                            <motion.span
                              key={reqIdx}
                              className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all"
                              variants={{
                                hidden: { opacity: 0, scale: 0.8 },
                                visible: { opacity: 1, scale: 1 },
                              }}
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: 'rgba(27, 138, 82, 0.1)',
                              }}
                            >
                              {req}
                            </motion.span>
                          ))}
                        </motion.div>
                      </motion.div>

                      {/* Footer with animated divider */}
                      <motion.div
                        className="border-t border-gray-200 group-hover:border-primary/30 transition-colors pt-4"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: idx * 0.05 + 0.4, duration: 0.6 }}
                        style={{ originX: 0 }}
                      >
                        <motion.div
                          className="flex justify-between items-center text-sm"
                          whileHover={{ gap: 8 }}
                        >
                          <motion.span
                            className="text-gray-500 group-hover:text-gray-700 transition-colors text-xs"
                            whileHover={{ x: -2 }}
                          >
                            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                          </motion.span>
                          <motion.span
                            className="text-primary font-semibold group-hover:text-primary-dark transition-colors text-xs px-3 py-1 rounded-lg bg-primary/10 group-hover:bg-primary/20"
                            whileHover={{ scale: 1.08 }}
                            animate={{
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: idx * 0.2,
                            }}
                          >
                            {opportunity.type}
                          </motion.span>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 pointer-events-none rounded-2xl"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    ></motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          )}

          {/* Empty State */}
          {filteredOpportunities.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No positions found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any positions matching "{searchQuery}". Try adjusting your search.</p>
              <motion.button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Search
              </motion.button>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="mt-16 flex justify-center items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-primary text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors font-semibold"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <motion.button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-primary text-white shadow-lg'
                        : 'border border-primary/30 text-primary hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-primary text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors font-semibold"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Results info */}
          <motion.div
            className="mt-6 text-center text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Showing {startIndex + 1} - {Math.min(endIndex, opportunities.length)} of {opportunities.length} opportunities
          </motion.div>
        </div>
      </section>

      {/* Application Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedPosition?.title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                maxLength={FORM_LIMITS.fullName}
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                className="mt-2"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
                className="mt-2"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                maxLength={FORM_LIMITS.phone}
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+212 6 XX XX XX XX"
                className="mt-2"
              />
            </div>

            {/* Cover Letter */}
            <div>
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                maxLength={FORM_LIMITS.coverLetter}
                value={formData.coverLetter}
                onChange={handleInputChange}
                required
                placeholder="Tell us why you're interested in this position..."
                className="mt-2 h-32"
              />
            </div>

            {/* Resume Upload with Drag & Drop */}
            <div>
              <Label>Resume (PDF) *</Label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  {formData.resume ? (
                    <span className="text-primary font-semibold">{formData.resume.name}</span>
                  ) : (
                    <>
                      Drag and drop your resume here, or{' '}
                      <label className="text-primary cursor-pointer hover:underline">
                        click to browse
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required={!formData.resume}
                        />
                      </label>
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF files only, max 5MB</p>
                {formData.resume && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, resume: null }))}
                    className="mt-2 text-xs text-primary hover:text-primary-dark font-semibold flex items-center justify-center gap-1 mx-auto"
                  >
                    <X size={14} /> Remove File
                  </button>
                )}
              </div>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-4 rounded-lg text-sm font-medium ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary hover:bg-primary-dark text-white disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Apply;
