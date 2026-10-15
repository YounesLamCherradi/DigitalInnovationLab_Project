import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Lock, Brain, Sparkles, Smartphone, ArrowRight, CheckCircle2, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { api } from '@/lib/api';
import { resolveAssetUrl } from '@/lib/assets';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planning';
  website_link?: string;
  github_link?: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await api
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planning':
        return 'Planning';
      default:
        return status;
    }
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
            Our Projects
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Innovative solutions we've built to solve real-world problems
          </motion.p>
        </motion.div>
      </section>

      {/* Research & Focus Areas Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/3 via-secondary/3 to-primary/3">
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>

        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 border border-primary/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              Our Research Focus
            </motion.span>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Research & Innovation Areas
            </h2>
            <p className="text-gray-700 text-xl max-w-2xl mx-auto">
              Cutting-edge solutions in cybersecurity, artificial intelligence, machine learning, and LLM automation
            </p>
          </motion.div>

          {/* Research Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Digital Identity & Security',
                description: 'Secure digital identity systems and authentication solutions for African enterprises',
                icon: Lock,
                bgGradient: 'from-primary to-primary-dark',
                borderColor: 'border-primary/40',
              },
              {
                title: 'Artificial Intelligence',
                description: 'AI-powered solutions tailored for real-world African challenges and opportunities',
                icon: Brain,
                bgGradient: 'from-secondary to-secondary-dark',
                borderColor: 'border-secondary/40',
              },
              {
                title: 'Blockchain Technology',
                description: 'Transparent and secure blockchain applications for digital transformation',
                icon: Sparkles,
                bgGradient: 'from-secondary-light to-secondary',
                borderColor: 'border-secondary/40',
              },
              {
                title: 'Mobile Development',
                description: 'Innovative mobile solutions optimized for African connectivity and contexts',
                icon: Smartphone,
                bgGradient: 'from-primary to-primary-light',
                borderColor: 'border-primary/40',
              },
              {
                title: 'Data Science & Analytics',
                description: 'Data-driven insights and analytics for better decision-making',
                icon: Sparkles,
                bgGradient: 'from-secondary to-secondary-light',
                borderColor: 'border-secondary/40',
              },
            ].map((area, index) => {
              const IconComponent = area.icon;
              const isGreen = index % 2 === 0;
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group"
              >
                <div className="relative h-full">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${area.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>

                  {/* Card */}
                  <div className={`relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 h-full border ${area.borderColor} group-hover:border-opacity-100 transition-all duration-500 hover:shadow-2xl shadow-lg flex flex-col`}>
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${area.bgGradient}`}></div>

                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.bgGradient} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <IconComponent size={24} className="text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-3 transition-colors ${isGreen ? 'text-primary group-hover:text-primary-dark' : 'text-secondary group-hover:text-secondary-dark'}`}>
                      {area.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed flex-grow group-hover:text-gray-900 transition-colors">
                      {area.description}
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-gray-700 mb-6 text-lg">Interested in collaborating with us?</p>
            <Link to="/contact">
              <motion.button
                className="px-10 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Collaboration
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Featured Projects"
            subtitle="A selection of our most impactful work across various domains"
          />

          {loading ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {[...Array(6)].map((_, idx) => (
                <motion.div key={`skeleton-${idx}`} variants={itemVariants}>
                  <div className="rounded-xl overflow-hidden shadow-lg bg-white h-full flex flex-col">
                    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 flex-grow flex flex-col space-y-4">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                      <div className="h-12 bg-gray-200 rounded animate-pulse flex-grow"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full animate-pulse flex-1"></div>
                        <div className="h-6 bg-gray-200 rounded-full animate-pulse flex-1"></div>
                      </div>
                      <div className="pt-4 border-t border-gray-200 flex gap-3">
                        <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="visible"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
            >
              {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <AnimatedCard variant="default" className="h-full overflow-hidden flex flex-col group">
                  {/* Image Container */}
                  <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 relative">
                    <motion.img
                      src={resolveAssetUrl(project.image)}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-primary mb-1 leading-tight">{project.title}</h3>
                        <p className="text-xs text-gray-500 font-medium">{project.category}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{project.description}</p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Tech Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    {(project.website_link || project.github_link) && (
                      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                        {project.website_link && project.website_link !== '#' && (
                          <motion.a
                            href={project.website_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 text-primary hover:text-white hover:bg-primary py-2.5 rounded-lg transition-all duration-300 font-semibold text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            title="Visit Website"
                          >
                            <ExternalLink size={16} />
                            <span>Visit</span>
                          </motion.a>
                        )}
                        {project.github_link && project.github_link !== '#' && (
                          <motion.a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 text-primary hover:text-white hover:bg-primary py-2.5 rounded-lg transition-all duration-300 font-semibold text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            title="View on GitHub"
                          >
                            <Github size={16} />
                            <span>GitHub</span>
                          </motion.a>
                        )}
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Stats */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary/90 to-primary-dark/95"></div>
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-white/80 text-lg">Real-world results that demonstrate our commitment to innovation</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                number: '2+',
                label: 'Completed Projects',
                description: 'Successfully delivered projects across multiple domains',
                icon: CheckCircle2,
                gradient: 'from-primary/20 to-primary-light/20',
                borderColor: 'border-primary/40 group-hover:border-primary-light/60',
                accentColor: 'bg-primary'
              },
              {
                number: '2',
                label: 'Active Projects',
                description: 'Currently in development and actively growing',
                icon: Zap,
                gradient: 'from-secondary/20 to-secondary-light/20',
                borderColor: 'border-secondary/40 group-hover:border-secondary-light/60',
                accentColor: 'bg-secondary'
              },
              {
                number: '10k+',
                label: 'Students',
                description: 'Lives touched by our innovative solutions',
                icon: Users,
                gradient: 'from-primary-light/20 to-primary/20',
                borderColor: 'border-primary-light/40 group-hover:border-primary/60',
                accentColor: 'bg-primary-dark'
              },
            ].map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className={`relative h-full bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-2xl border-2 ${stat.borderColor} p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl`}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" style={{ transition: '0.6s' }}></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className={`w-16 h-16 rounded-2xl ${stat.accentColor} flex items-center justify-center border border-white/30 group-hover:border-white/50 transition-all duration-300`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                    </motion.div>

                    {/* Number */}
                    <motion.div
                      className="text-5xl sm:text-6xl font-bold text-white mb-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + 0.2, duration: 0.6 }}
                    >
                      {stat.number}
                    </motion.div>

                    {/* Label */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{stat.label}</h3>

                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                      {stat.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.4, duration: 0.8 }}
                  ></motion.div>
                </div>
              </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom text */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-white/80 text-lg">And we're just getting started...</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
