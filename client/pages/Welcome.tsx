import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, Share2, Building2, Globe, GraduationCap, Lock, Link as LinkIcon, Smartphone, Brain, Handshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { AutoplayVideo } from '@/components/shared/AutoplayVideo';

const galleryItems = [
  { image: '/images/journey-hackathon-2025.webp', alt: 'Digital ID Hackathon participants at Al Akhawayn University' },
  { image: '/images/journey-id4africa-2025.jpeg', alt: 'Al Akhawayn University team at ID4Africa 2025' },
  { image: '/images/journey-launch-2026.jpeg', alt: 'Digital Innovation Lab inauguration' },
  { image: '/images/recovered/9ed8e847e096454fbfbccd34dee348eb.webp', alt: 'AUI students participating in regional Digital ID Hackathons' },
  { image: '/images/recovered/adfce07023cc4a938acd6b5d960cc96a.webp', alt: 'NOURID+ award at the IEEE CiSt conference' },
  { image: '/images/recovered/0fa57adbeb674548b30f7d3f655e5372.webp', alt: 'AUI team at the ID4Africa Hackathon finals' },
  { image: '/images/recovered/77d6df00c25940f08e10ebe96126a0f7.webp', alt: 'Africa Digital ID Hackathon' },
  { image: '/images/recovered/0d7eafb0feb747198e2d7c601898f2d3.webp', alt: 'IEEE CiSt digital transformation conference' },
];

const Welcome = () => {
  const journeyItems = [
    {
      year: '2025',
      title: 'Digital ID Hackathon Competition Initiative',
      description:
        'Launch of the Digital ID Hackathon Competition, a flagship initiative bringing together innovative minds from across Africa to develop cutting-edge digital identity solutions.',
      image: '/images/journey-hackathon-2025.webp',
      color: 'from-sky-500 to-blue-600',
      link: 'https://www.africa.engineering.cmu.edu/research/upanzi/id-hackathon.html',
    },
    {
      year: '2025',
      title: 'ID4AFRICA 2025 Ethiopia - Finalist Achievement',
      description:
        'Our team became finalist in the Digital ID Hackathon competition at the ID4AFRICA 2025 conference in Ethiopia, showcasing Morocco\'s innovation prowess on the continental stage.',
      image: '/images/journey-id4africa-2025.jpeg',
      color: 'from-primary to-primary-dark',
      link: 'https://id4africa.com/',
    },
    {
      year: '2026',
      title: 'Birth of Digital Innovation Lab',
      description:
        'The establishment of the Digital Innovation Lab marks a new era, transforming our hackathon success into a comprehensive innovation ecosystem fostering digital solutions across Africa.',
      image: '/images/journey-launch-2026.jpeg',
      color: 'from-cyan-500 to-teal-600',
      link: 'https://www.infomediaire.net/le-digital-innovation-lab-dal-akhawayn-university-une-plateforme-strategique-au-service-de-la-transformation-numerique-publique-en-afrique/',
    },
  ];

  const partners = [
    {
      name: 'CMU Africa',
      description:
        'Carnegie Mellon University Africa brings world-class technological expertise and research collaboration.',
      logo: '/images/partner-cmu.svg',
      url: 'https://www.africa.engineering.cmu.edu/index.html',
    },
    {
      name: 'Upanzi Network',
      description:
        'A network of digital innovation labs across Africa, connecting us to a continent-wide ecosystem of knowledge sharing.',
      logo: '/images/partner-upanzi.png',
      url: 'https://www.africa.engineering.cmu.edu/research/upanzi/index.html',
    },
    {
      name: 'Women in AI Morocco',
      description:
        'A dynamic community dedicated to empowering women in artificial intelligence and technology, fostering innovation and leadership across Morocco.',
      logo: '/images/partner-wai.webp',
      url: 'https://www.womeninai.co/',
    },
    {
      name: 'IEEE Women in Engineering Affinity Group Morocco',
      description:
        'Supporting and promoting women engineers in Morocco through mentorship, professional development, and inclusive innovation initiatives.',
      logo: '/images/partner-ieee.png',
      url: 'https://wie.ieee.org/',
    },
  ];

  const focusAreas = [
    {
      title: 'Digital Identity Solutions',
      description:
        'Developing secure, scalable digital identity systems that protect privacy while enabling seamless digital interactions across Africa.',
      icon: Lock,
    },
    {
      title: 'Blockchain & Security',
      description:
        'Researching cutting-edge blockchain technologies and cybersecurity solutions tailored for African digital infrastructure needs.',
      icon: LinkIcon,
    },
    {
      title: 'Mobile-First Applications',
      description:
        'Creating innovative mobile solutions that work seamlessly across different network conditions and device capabilities.',
      icon: Smartphone,
    },
    {
      title: 'AI & Machine Learning',
      description:
        'Applying artificial intelligence to solve unique African challenges in healthcare, education, agriculture, and financial inclusion.',
      icon: Brain,
    },
    {
      title: 'Pan-African Collaboration',
      description:
        'Building bridges between African universities and innovation hubs to share resources, knowledge, and digital transformation.',
      icon: Handshake,
    },
    {
      title: 'Student Innovation',
      description:
        'Empowering the next generation of African technologists through hackathons, research, real-world projects, and mentorship.',
      icon: Sparkles,
    },
  ];

  const services = [
    {
      icon: MapPin,
      title: 'Lab Location',
      details: [
        'Digital Innovation Lab',
        'Academic Area, Building 5',
        'Al Akhawayn University',
        'Ifrane, Morocco',
      ],
    },
    {
      icon: Users,
      title: 'Laboratory Lead',
      details: [
        'Professor Dr. Houda Chakiri',
        'Lab Director & Principal Investigator',
        'Al Akhawayn University',
        'Research Excellence Lead',
      ],
    },
    {
      icon: Share2,
      title: 'Global Collaborations',
      details: [
        'Upanzi Network Partnership',
        'CMU Africa Collaboration',
        'ID4AFRICA Community Member',
        'Pan-African Innovation Hub',
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
      {/* Hero Section with Green Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* A local image keeps the hero crisp and removes YouTube UI, tracking, and loading flashes. */}
        <img
          src="/images/journey-launch-2026.jpeg"
          alt="Digital Innovation Lab inauguration at Al Akhawayn University"
          className="absolute inset-0 h-full w-full object-cover object-center scale-125 md:scale-100"
          width={1280}
          height={1024}
          fetchPriority="high"
          decoding="async"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-[5]"></div>

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Digital Innovation Lab
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-white/95 mb-8 drop-shadow-md max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Transforming ideas into innovative digital solutions across Africa
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('journey-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(27, 138, 82, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-white to-gray-50 hover:from-primary hover:to-primary-dark text-primary hover:text-white px-12 py-4 rounded-full font-bold transition-all duration-500 shadow-2xl hover:shadow-3xl text-lg border-2 border-white/80 hover:border-transparent group"
            >
              <span className="relative">
                Explore Our Journey
              </span>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <ArrowRight size={24} className="group-hover:rotate-45 transition-transform" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>


      {/* Journey Timeline Section - Horizontal */}
      <section id="journey-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="From Hackathon to Innovation Universe"
            subtitle="Our evolution from a single innovation challenge to a continental ecosystem"
          />

          {/* Desktop Timeline - Horizontal with Images */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Timeline Header with numbers and connecting line */}
              <div className="flex justify-between items-start mb-16 relative">
                {/* Background connecting line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-secondary/80 z-0"></div>

                {/* Timeline dots */}
                <motion.div
                  className="flex justify-between w-full relative z-10"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {journeyItems.map((item, index) => (
                    <motion.div key={index} variants={itemVariants} className="flex flex-col items-center">
                      {/* Number badge */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-4 border-white relative z-20 bg-gradient-to-br ${item.color}`}>
                        <span className="text-xl">{index + 1}</span>
                      </div>
                      <span className="mt-3 text-primary font-semibold text-sm">{item.year}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Image Cards Section */}
              <motion.div
                className="grid grid-cols-3 gap-8 mt-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {journeyItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <div className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                        <motion.img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6 }}
                          width={800}
                          height={600}
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Overlay gradient - animates on hover */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        ></motion.div>

                        {/* Badge */}
                        <div className="absolute top-4 right-4">
                          <motion.div
                            className={`px-4 py-2 bg-gradient-to-r ${item.color} text-white rounded-full font-bold text-sm shadow-lg`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                          >
                            {item.year}
                          </motion.div>
                        </div>
                      </div>

                      {/* Content */}
                      <motion.div
                        className="bg-white p-6 flex-grow flex flex-col"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
                      >
                        <h3 className="text-primary font-bold text-lg mb-3 leading-tight">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed flex-grow">{item.description}</p>

                        {/* Learn More Link */}
                        {item.link && (
                          <motion.a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 pt-4 border-t border-gray-200 block"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-primary font-semibold text-sm flex items-center gap-2 cursor-pointer hover:gap-3 transition-all">
                              Learn More <ArrowRight size={16} />
                            </span>
                          </motion.a>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Mobile Timeline - Vertical with Images */}
          <div className="lg:hidden">
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {journeyItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex gap-4">
                    {/* Left side - Number badge and connecting line */}
                    <div className="flex flex-col items-center flex-shrink-0 pt-2">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-4 border-white bg-gradient-to-br ${item.color}`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                      >
                        {index + 1}
                      </motion.div>
                      {index < journeyItems.length - 1 && (
                        <div className="w-1 h-28 bg-gradient-to-b from-primary to-primary/30 mt-2"></div>
                      )}
                    </div>

                    {/* Right side - Image and content */}
                    <div className="flex-grow">
                      <motion.div
                        className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                        whileHover={{ y: -4 }}
                      >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gray-200">
                          <motion.img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.6 }}
                            width={600}
                            height={400}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <div className="absolute top-2 right-2">
                            <span className={`px-3 py-1 bg-gradient-to-r ${item.color} text-white rounded-full font-bold text-xs shadow-lg`}>
                              {item.year}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white p-4">
                          <h3 className="text-primary font-bold text-sm mb-2 leading-tight">{item.title}</h3>
                          <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                          {item.link && (
                            <motion.a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 pt-3 border-t border-gray-200 block"
                            >
                              <span className="text-primary font-semibold text-xs flex items-center gap-1">
                                Learn More <ArrowRight size={12} />
                              </span>
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video stories */}
      <section id="video-stories" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Inside the Digital Innovation Lab"
            subtitle="Meet the leadership, researchers, partners, and students shaping Africa's digital future."
          />

          <div className="grid gap-8 lg:grid-cols-3">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
            >
              <div className="aspect-video overflow-hidden bg-black">
                <AutoplayVideo
                  className="h-full w-full object-cover"
                  src="/videos/lab-birth.mp4"
                  poster="/images/video-lab-birth.webp"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-primary">The Birth of the Digital Innovation Lab</h3>
                <p className="leading-relaxed text-gray-600">
                  Discover how the lab began and the vision behind its Africa-focused mission.
                </p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                <img
                  src="/images/journey-id4africa-2025.jpeg"
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-xl"
                  aria-hidden="true"
                />
                <AutoplayVideo
                  className="relative z-10 h-full w-full object-contain"
                  src="/videos/lab-community-voices.mp4"
                  poster="/images/video-community-voices.webp"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-primary">Voices of Our Innovation Community</h3>
                <p className="leading-relaxed text-gray-600">
                  Hear from university leadership, the laboratory team, and African students building solutions together.
                </p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                <img
                  src="/images/aui-campus-login.jpeg"
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-xl"
                  aria-hidden="true"
                />
                <AutoplayVideo
                  className="relative z-10 h-full w-full object-contain"
                  src="/videos/british-ambassador-visit.mp4"
                  poster="/images/video-british-ambassador.webp"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-primary">Visit of the British Ambassador to Morocco</h3>
                <p className="leading-relaxed text-gray-600">
                  Highlights from the British Ambassador’s visit and engagement with Al Akhawayn University’s innovation community.
                </p>
              </div>
            </motion.article>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Videos start automatically without sound. Use the player controls to enable audio.
          </p>
        </div>
      </section>

      {/* Strategic Partners Section - Enhanced Creative Design */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-green-600 to-primary-dark opacity-95"></div>

        {/* Animated gradient shapes */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>

        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>

        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern id="hex-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#hex-pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-4 border border-white/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              Global Partnership Ecosystem
            </motion.span>
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
              Our Strategic Partners
            </h2>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Collaborating with continental leaders to drive digital innovation and create impact across Africa
            </p>
          </motion.div>

          {/* Partners Grid with Creative Layout */}
          <motion.div
            className="flex md:grid gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:grid-cols-2 lg:grid-cols-4 mb-12"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex-shrink-0 w-80 md:w-auto group"
              >
                <div className="relative h-full">
                  {/* Gradient background cards with different colors */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
                      index === 0
                        ? 'from-blue-400 to-blue-600'
                        : index === 1
                        ? 'from-accent to-blue-500'
                        : index === 2
                        ? 'from-green-400 to-primary'
                        : 'from-purple-400 to-pink-500'
                    }`}
                  ></div>

                  {/* Main card */}
                  <motion.div
                    className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 h-full shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-white/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Top accent line */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${
                        index === 0
                          ? 'from-blue-400 to-blue-600'
                          : index === 1
                          ? 'from-accent to-blue-500'
                          : index === 2
                          ? 'from-green-400 to-primary'
                          : 'from-purple-400 to-pink-500'
                      }`}
                    ></div>

                    {/* Logo with animated background */}
                    <motion.div
                      className={`w-20 h-20 rounded-xl mb-6 flex items-center justify-center shadow-lg p-2 border border-gray-200 ${index === 2 ? 'bg-[#152247]' : 'bg-white'}`}
                      whileHover={{ rotate: 6, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                        width={100}
                        height={100}
                        loading="lazy"
                        decoding="async"
                      />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-primary-dark transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-5">
                      {partner.description}
                    </p>

                    {/* Interactive link */}
                    <motion.a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pt-4 border-t border-gray-200 block"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-primary font-semibold text-sm flex items-center gap-2 cursor-pointer group/link hover:text-primary-dark transition-colors">
                        Learn More
                        <motion.span
                          animate={{ x: [0, 6, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ArrowRight size={16} />
                        </motion.span>
                      </span>
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Connection statement */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Together, we're building a stronger innovation ecosystem that empowers communities and drives economic growth across Africa
            </p>
            <Link to="/contact">
              <motion.button
                className="mt-8 px-8 py-3 bg-white text-primary rounded-full font-bold hover:bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Become a Partner
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Innovation Focus Areas Section - Professional Design */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-primary/3 to-secondary/5">
        {/* Subtle animated background shapes - Green */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        ></motion.div>

        {/* Blue accent shape */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-72 h-72 bg-secondary/8 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 1 }}
        ></motion.div>

        <motion.div
          className="absolute -bottom-32 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
        ></motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider border border-primary/30">
                Core Competencies
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Our Innovation Focus Areas
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              Driving digital transformation across six strategic pillars that empower Africa's innovation ecosystem and create sustainable impact
            </p>
          </motion.div>

          {/* Focus Areas Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {focusAreas.map((area, index) => {
              const isBlueCard = index % 2 === 0;
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group"
              >
                <div className="relative h-full">
                  {/* Card background */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl border transition-all duration-500 shadow-lg group-hover:shadow-xl ${
                    isBlueCard
                      ? 'border-secondary/20 group-hover:border-secondary/50'
                      : 'border-primary/20 group-hover:border-primary/50'
                  }`}></div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${
                    isBlueCard
                      ? 'bg-gradient-to-br from-secondary/5 to-transparent'
                      : 'bg-gradient-to-br from-primary/5 to-transparent'
                  }`}></div>

                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon container */}
                    <motion.div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 border transition-all duration-300 ${
                        isBlueCard
                          ? 'bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/25 group-hover:border-secondary/50 group-hover:from-secondary/25 group-hover:to-secondary/15'
                          : 'bg-gradient-to-br from-primary/15 to-primary/5 border-primary/25 group-hover:border-primary/50 group-hover:from-primary/25 group-hover:to-primary/15'
                      }`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                    >
                      {area.icon && React.createElement(area.icon, {
                        size: 24,
                        className: isBlueCard
                          ? "text-secondary group-hover:text-secondary-dark transition-colors"
                          : "text-primary group-hover:text-primary-dark transition-colors"
                      })}
                    </motion.div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                      isBlueCard
                        ? 'text-secondary group-hover:text-secondary-dark'
                        : 'text-primary group-hover:text-primary-dark'
                    }`}>
                      {area.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed flex-grow group-hover:text-gray-800 transition-colors duration-300">
                      {area.description}
                    </p>


                    {/* Number badge */}
                    <div className={`absolute top-6 right-6 w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isBlueCard
                        ? 'bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/40 text-secondary group-hover:from-secondary/30 group-hover:to-secondary/20'
                        : 'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/40 text-primary group-hover:from-primary/30 group-hover:to-primary/20'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom section */}
          <motion.div
            className="mt-20 pt-16 border-t border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-primary mb-2">6</div>
                <p className="text-gray-700 font-medium">Strategic Focus Areas</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-secondary mb-2">3+</div>
                <p className="text-gray-700 font-medium">Active Innovations</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-primary mb-2">Africa</div>
                <p className="text-gray-700 font-medium">Wide Impact</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past Events & Global Participation Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-primary-dark/20 to-gray-900 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        ></motion.div>

        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 1 }}
        ></motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6">
              <span className="inline-block px-4 py-2 bg-primary/25 text-primary rounded-lg text-xs font-bold uppercase tracking-wider border border-primary/40">
                Global Recognition
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Past Events & World-Class Participation
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Our team represents Africa on the global stage, collaborating at premier international conferences and showcasing groundbreaking digital innovation
            </p>
          </motion.div>

          {/* Events Photo Gallery */}
          <motion.div
            className="flex md:grid gap-4 mb-12 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {galleryItems.map((event, idx) => {
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group flex-shrink-0 md:flex-shrink w-64 md:w-auto"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 h-80 md:h-72">
                    {/* Image */}
                    <motion.img
                      src={event.image}
                      alt={event.alt}
                      className="w-full h-full object-cover"
                      transition={{ duration: 0.3 }}
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/8 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: "Global Conferences", value: "4" },
              { label: "Countries Represented", value: "3" },
              { label: "International Partnerships", value: "3" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Connect With Our Services Section - Enhanced */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/8 via-white to-secondary/5">
        {/* Animated background elements - Green */}
        <motion.div
          className="absolute top-1/4 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
          }}
          transition={{ duration: 16, repeat: Infinity }}
        ></motion.div>

        {/* Blue accent shape */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-72 h-72 bg-secondary/6 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 1 }}
        ></motion.div>

        <motion.div
          className="absolute -bottom-20 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider border border-primary/30">
                Get Connected
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Connect With Our Services
            </h2>
            <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
              Find the right contact point and resources for your innovation needs. We're here to support your journey
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const isBlueCard = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative"
                >
                  <div className="relative h-full">
                    {/* Gradient border effect on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
                      isBlueCard
                        ? 'bg-gradient-to-br from-secondary/20 to-secondary/5'
                        : 'bg-gradient-to-br from-primary/20 to-primary/5'
                    }`}></div>

                    {/* Card */}
                    <div className={`relative bg-white rounded-2xl border transition-all duration-500 shadow-lg group-hover:shadow-2xl p-8 h-full flex flex-col ${
                      isBlueCard
                        ? 'border-secondary/20 group-hover:border-secondary/50'
                        : 'border-primary/20 group-hover:border-primary/50'
                    }`}>
                      {/* Top accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${
                        isBlueCard
                          ? 'from-secondary via-secondary/70 to-transparent'
                          : 'from-primary via-primary-light to-transparent'
                      }`}></div>

                      {/* Icon with background */}
                      <motion.div
                        className={`w-20 h-20 rounded-xl flex items-center justify-center mb-6 border transition-all duration-300 ${
                          isBlueCard
                            ? 'bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/25 group-hover:border-secondary/50 group-hover:from-secondary/25 group-hover:to-secondary/15'
                            : 'bg-gradient-to-br from-primary/15 to-primary/5 border-primary/25 group-hover:border-primary/50 group-hover:from-primary/25 group-hover:to-primary/15'
                        }`}
                        whileHover={{
                          scale: 1.12,
                          rotate: 5,
                        }}
                      >
                        <Icon className={`w-10 h-10 ${isBlueCard ? 'text-secondary' : 'text-primary'}`} />
                      </motion.div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                        isBlueCard
                          ? 'text-secondary group-hover:text-secondary-dark'
                          : 'text-primary group-hover:text-primary-dark'
                      }`}>
                        {service.title}
                      </h3>

                      {/* Details list */}
                      <ul className="space-y-3 flex-grow">
                        {service.details.map((detail, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-start gap-3 text-gray-700 group-hover:text-gray-800 transition-colors duration-300"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <span className="text-primary font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
                            <span className="text-sm leading-relaxed">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Link to="/contact">
                        <motion.button
                          className="mt-6 pt-4 border-t border-primary/20 text-primary font-semibold text-sm flex items-center gap-2 group-hover:text-primary-dark transition-colors duration-300 w-full"
                          whileHover={{ x: 4 }}
                        >
                          <span>Connect now</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom info section */}
          <motion.div
            className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-primary mb-3">Need More Information?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Our team is ready to help you with any questions or to discuss how we can support your innovation initiatives
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary/5 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Request More Info
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Welcome;
