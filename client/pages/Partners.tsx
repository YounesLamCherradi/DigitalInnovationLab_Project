import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Zap, Globe, Users, Award, DollarSign } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Link } from 'react-router-dom';

interface Partner {
  id: number;
  name: string;
  logo: string;
  category: string;
  description: string;
}

const Partners = () => {
  const strategicPartners: Partner[] = [
    {
      id: 1,
      name: 'Carnegie Mellon University Africa',
      logo: '/images/partner-cmu.svg',
      category: 'Academic Institution',
      description: 'Leading provider of world-class education and research collaboration in Africa.',
    },
    {
      id: 2,
      name: 'Upanzi Network',
      logo: '/images/partner-upanzi.png',
      category: 'Innovation Network',
      description: 'Pan-African network of digital innovation labs connecting researchers and innovators.',
    },
    {
      id: 3,
      name: 'Women in AI Morocco',
      logo: '/images/partner-wai.webp',
      category: 'Community & Empowerment',
      description: 'A dynamic community dedicated to empowering women in artificial intelligence and technology, fostering innovation and leadership across Morocco.',
    },
    {
      id: 4,
      name: 'IEEE Women in Engineering Affinity Group Morocco',
      logo: '/images/partner-ieee.png',
      category: 'Professional Organization',
      description: 'Supporting and promoting women engineers in Morocco through mentorship, professional development, and inclusive innovation initiatives.',
    },
  ];

  const partnershipTypes = [
    {
      icon: Building2,
      title: 'Academic Partnerships',
      description: 'Collaborate with universities and research institutions to advance digital innovation and research across Africa.',
      color: 'from-primary to-primary-dark',
    },
    {
      icon: Zap,
      title: 'Industry Partnerships',
      description: 'Partner with technology companies, startups, and corporations to bridge the gap between academic research and industry.',
      color: 'from-secondary to-secondary-dark',
    },
    {
      icon: Globe,
      title: 'Government & NGO Partnerships',
      description: 'Work with government agencies and NGOs to address societal challenges through digital solutions and innovation.',
      color: 'from-primary-light to-primary',
    },
    {
      icon: Award,
      title: 'Funding & Investment Partners',
      description: 'Collaborate with funding organizations, venture capital firms, and development partners to support innovative projects.',
      color: 'from-secondary-light to-secondary',
    },
  ];

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

  return (
    <div className="w-full">
      {/* Hero Section - Compact */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-dark/20 via-white to-primary/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2"></div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Our Partners
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Building together with world-class institutions and organizations to drive innovation and digital transformation across Africa
          </motion.p>
        </motion.div>
      </section>

      {/* Strategic Partners Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Our Strategic Partners"
            subtitle="Collaborating with world-class institutions and organizations to drive innovation and digital transformation across Africa"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {strategicPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                whileHover={{ y: -16, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="group"
              >
                <div className="relative h-full">
                  {/* Glow effect on hover - enhanced */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
                    initial={{ opacity: 0 }}
                  ></motion.div>

                  <AnimatedCard
                    variant="default"
                    className="relative h-full p-8 flex flex-col items-center text-center shadow-lg group-hover:shadow-3xl transition-all duration-300 bg-white/90 group-hover:bg-white border-2 border-transparent group-hover:border-primary/30"
                  >
                    {/* Logo Container with animation */}
                    <motion.div
                      className={`mb-6 p-4 rounded-2xl h-32 flex items-center justify-center transition-colors duration-300 ${partner.id === 1 ? 'w-48' : 'w-32'} ${partner.id === 3 ? 'bg-[#152247]' : 'bg-white group-hover:bg-primary/5'}`}
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <motion.img
                        src={partner.logo}
                        alt={partner.name}
                        className={`${partner.id === 1 ? 'max-w-44' : 'max-w-28'} max-h-28 object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      />
                    </motion.div>

                    {/* Info */}
                    <motion.h3
                      className="text-xl font-bold text-primary mb-2 group-hover:text-primary-dark transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.08 }}
                    >
                      {partner.name}
                    </motion.h3>

                    <motion.p
                      className="text-sm text-secondary font-semibold mb-4 group-hover:text-secondary-dark transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.15, duration: 0.6 }}
                    >
                      {partner.category}
                    </motion.p>

                    {/* Description */}
                    <motion.p
                      className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-900 transition-colors duration-300 font-medium"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    >
                      {partner.description}
                    </motion.p>
                  </AnimatedCard>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partnership Opportunities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/3 via-secondary/3 to-primary/3">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Partnership Opportunities"
            subtitle="Discover how your organization can collaborate with our Digital Innovation Lab"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {partnershipTypes.map((type, idx) => {
              const Icon = type.icon;
              const isGreen = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -16, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="group"
                >
                  <div className="relative h-full">
                    {/* Animated gradient background on hover - enhanced */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-25 transition-opacity duration-300 blur-2xl`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0 }}
                    ></motion.div>

                    {/* Card - enhanced */}
                    <motion.div
                      className={`relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 h-full border-2 transition-all duration-300 hover:shadow-3xl shadow-lg flex flex-col ${isGreen ? 'border-primary/30 group-hover:border-primary/60' : 'border-secondary/30 group-hover:border-secondary/60'}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                    >
                      {/* Top accent line - animated */}
                      <motion.div
                        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${type.color}`}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.2, duration: 0.6 }}
                      ></motion.div>

                      {/* Icon with pulse effect - enhanced */}
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 shadow-lg relative group-hover:shadow-2xl transition-shadow duration-300`}
                        whileHover={{ scale: 1.3, rotate: 20 }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.1, duration: 0.6, type: 'spring', stiffness: 400 }}
                      >
                        <Icon size={24} className="text-white relative z-10" />
                        {/* Pulse ring effect - enhanced */}
                        <motion.div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${type.color} opacity-30`}
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.div>
                      </motion.div>

                      {/* Title - enhanced */}
                      <motion.h3
                        className={`text-lg font-bold mb-3 transition-colors duration-300 ${isGreen ? 'text-primary group-hover:text-primary-dark' : 'text-secondary group-hover:text-secondary-dark'}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.15, duration: 0.6 }}
                        whileHover={{ scale: 1.08, y: -2 }}
                      >
                        {type.title}
                      </motion.h3>

                      {/* Description - enhanced */}
                      <motion.p
                        className="text-gray-700 text-sm leading-relaxed flex-grow group-hover:text-gray-900 transition-colors duration-300 font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.2, duration: 0.6 }}
                      >
                        {type.description}
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.p
              className="text-gray-700 mb-6 text-lg font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Ready to become a partner?
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                Get In Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
