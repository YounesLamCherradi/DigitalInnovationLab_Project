import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter, ArrowRight, ChevronLeft, ChevronRight, Zap, Users, Award, Lightbulb } from 'lucide-react';
import { HeroSection } from '@/components/shared/HeroSection';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { api } from '@/lib/api';
import { resolveAssetUrl } from '@/lib/assets';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  keywords: string[];
  section: 'board' | 'research' | 'lab-staff';
  linkedin_url?: string;
  twitter_url?: string;
}

const Team = () => {
  const boardScrollRef = useRef<HTMLDivElement>(null);
  const researchScrollRef = useRef<HTMLDivElement>(null);
  const labScrollRef = useRef<HTMLDivElement>(null);

  const [boardCanScrollLeft, setBoardCanScrollLeft] = useState(false);
  const [boardCanScrollRight, setBoardCanScrollRight] = useState(true);
  const [researchCanScrollLeft, setResearchCanScrollLeft] = useState(false);
  const [researchCanScrollRight, setResearchCanScrollRight] = useState(true);
  const [labCanScrollLeft, setLabCanScrollLeft] = useState(false);
  const [labCanScrollRight, setLabCanScrollRight] = useState(true);

  const [boardTeam, setBoardTeam] = useState<TeamMember[]>([]);
  const [researchTeam, setResearchTeam] = useState<TeamMember[]>([]);
  const [labTeam, setLabTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await api
          .from('team_members')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        const board = data?.filter(m => m.section === 'board') || [];
        let research = data?.filter(m => m.section === 'research') || [];
        const lab = data?.filter(m => m.section === 'lab-staff') || [];

        // Sort research team so Dr. Houda Chakiri appears first
        research = research.sort((a, b) => {
          if (a.name === 'Dr. Houda Chakiri') return -1;
          if (b.name === 'Dr. Houda Chakiri') return 1;
          return a.name.localeCompare(b.name);
        });

        setBoardTeam(board);
        setResearchTeam(research);
        setLabTeam(lab);

        // Preload only the first 3 images (board members) for better performance
        // Remaining images will load lazily using the loading="lazy" attribute in img tags
        const boardImages = board.slice(0, 3);
        boardImages.forEach(member => {
          const img = new Image();
          img.src = member.image;
        });
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    checkBoardScroll();
    checkResearchScroll();
    checkLabScroll();
  }, [boardTeam, researchTeam, labTeam]);

  const checkBoardScroll = () => {
    if (boardScrollRef.current) {
      setBoardCanScrollLeft(boardScrollRef.current.scrollLeft > 0);
      setBoardCanScrollRight(
        boardScrollRef.current.scrollLeft <
        boardScrollRef.current.scrollWidth - boardScrollRef.current.clientWidth - 10
      );
    }
  };

  const checkResearchScroll = () => {
    if (researchScrollRef.current) {
      setResearchCanScrollLeft(researchScrollRef.current.scrollLeft > 0);
      setResearchCanScrollRight(
        researchScrollRef.current.scrollLeft <
        researchScrollRef.current.scrollWidth - researchScrollRef.current.clientWidth - 10
      );
    }
  };

  const checkLabScroll = () => {
    if (labScrollRef.current) {
      setLabCanScrollLeft(labScrollRef.current.scrollLeft > 0);
      setLabCanScrollRight(
        labScrollRef.current.scrollLeft <
        labScrollRef.current.scrollWidth - labScrollRef.current.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(() => {
        if (ref === boardScrollRef) checkBoardScroll();
        if (ref === researchScrollRef) checkResearchScroll();
        if (ref === labScrollRef) checkLabScroll();
      }, 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const renderTeamCard = (member: TeamMember, compact = false) => (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group h-full"
    >
      <div className="relative h-full rounded-3xl overflow-hidden transition-all duration-500 bg-white shadow-xl group-hover:shadow-2xl flex flex-col border border-gray-100 group-hover:border-primary/30">
        {/* Laboratory Lead Badge */}
        {member.name === 'Dr. Houda Chakiri' && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold rounded-full shadow-lg">
            Laboratory Lead
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15 flex items-center justify-center">
          <img
            src={resolveAssetUrl(member.image)}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></motion.div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {member.name}
            </h3>

            <p className="text-[10px] text-primary font-bold uppercase tracking-tight mb-2 pb-1 border-b border-primary/20">
              {member.role}
            </p>

            {member.section !== 'lab-staff' && (
              <p className="text-[10px] text-gray-700 leading-tight">
                {member.bio}
              </p>
            )}
          </div>

          {/* Keywords & LinkedIn */}
          <div className="mt-auto pt-2 space-y-2">
            <div className="flex flex-wrap gap-1">
              {member.keywords.slice(0, 3).map((keyword, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-0.5 bg-primary/12 text-primary text-xs font-semibold rounded border border-primary/25 hover:border-primary/50 hover:bg-primary/20 transition-all"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* LinkedIn Link */}
            {member.linkedin_url && (
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary hover:scale-110 transition-transform"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection
        title="Meet Our Team"
        subtitle="Meet the leadership, researchers, staff, and students shaping Africa's digital future."
        backgroundParticles
        compact
      />

      {/* Board Team Section */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 bg-gradient-to-br from-primary/8 via-white to-secondary/5 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-5 py-2 bg-primary/15 text-primary rounded-full text-sm font-bold uppercase tracking-widest border border-primary/30">
                Leadership Circle
              </span>
            </motion.div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Distinguished Board Members
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              Visionary leaders with track records from the world's top institutions, shaping the future of digital innovation
            </p>
          </motion.div>

          {/* Board Team Horizontal Scroll */}
          <div className="relative">
            {/* Scroll Buttons */}
            {boardCanScrollLeft && (
              <motion.button
                onClick={() => scroll('left', boardScrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}
            {boardCanScrollRight && (
              <motion.button
                onClick={() => scroll('right', boardScrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            )}

            {/* Scrollable Container */}
            <div
              ref={boardScrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
              onScroll={checkBoardScroll}
            >
              {boardTeam.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-72"
                >
                  {renderTeamCard(member)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Team Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          className="absolute -bottom-32 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-5 py-2 bg-primary/15 text-primary rounded-full text-sm font-bold uppercase tracking-widest border border-primary/30">
                Core Researchers
              </span>
            </motion.div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Research & Development Team
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              Specialists from Google, IBM, and top universities bringing cutting-edge expertise in AI, blockchain, cloud, and design innovation
            </p>
          </motion.div>

          {/* Team Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="relative">
            {/* Scroll Buttons - Mobile Only */}
            {researchCanScrollLeft && (
              <motion.button
                onClick={() => scroll('left', researchScrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}
            {researchCanScrollRight && (
              <motion.button
                onClick={() => scroll('right', researchScrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            )}

            {/* Team Grid */}
            <div
              ref={researchScrollRef}
              className="flex lg:grid gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 lg:grid-cols-2 lg:grid-cols-3 scroll-smooth"
              onScroll={checkResearchScroll}
            >
              {researchTeam.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-80 lg:w-auto"
                >
                  {renderTeamCard(member)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lab Staff Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/3 via-white to-secondary/3 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-5 py-2 bg-secondary/15 text-secondary rounded-full text-sm font-bold uppercase tracking-widest border border-secondary/30">
                Operations Team
              </span>
            </motion.div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Lab Staff & Operations
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              Dedicated professionals ensuring seamless operations and supporting research excellence every day
            </p>
          </motion.div>

          {/* Team Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="relative">
            {/* Scroll Buttons - Mobile Only */}
            {labCanScrollLeft && (
              <motion.button
                onClick={() => scroll('left', labScrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}
            {labCanScrollRight && (
              <motion.button
                onClick={() => scroll('right', labScrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            )}

            {/* Team Grid */}
            <div
              ref={labScrollRef}
              className="flex lg:grid gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 lg:grid-cols-2 lg:grid-cols-3 scroll-smooth"
              onScroll={checkLabScroll}
            >
              {labTeam.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-80 lg:w-auto"
                >
                  {renderTeamCard(member)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute -bottom-32 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 1 }}
        ></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
              Our Core Values
            </h2>
            <p className="text-gray-700 text-xl max-w-3xl mx-auto">
              The principles that guide our research, innovation, and commitment to digital excellence
            </p>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Innovation',
                description: 'Pushing boundaries and challenging the status quo to create breakthrough solutions for tomorrow\'s challenges',
                icon: Lightbulb,
              },
              {
                title: 'Excellence',
                description: 'Pursuing the highest standards in research, education, and technological advancement across all endeavors',
                icon: Award,
              },
              {
                title: 'Collaboration',
                description: 'Building bridges between institutions, industries, and global leaders to amplify our collective impact',
                icon: Users,
              },
              {
                title: 'Impact',
                description: 'Creating meaningful change that transforms communities and advances digital innovation across Africa and beyond',
                icon: Zap,
              },
            ].map((value, idx) => {
              const isGreen = idx % 2 === 0;
              const Icon = value.icon;
              const bgColor = isGreen ? 'from-primary/15 to-primary/5' : 'from-secondary/15 to-secondary/5';
              const borderColor = isGreen ? 'border-primary/30 group-hover:border-primary/60' : 'border-secondary/30 group-hover:border-secondary/60';
              const iconBg = isGreen ? 'from-primary/20 to-primary/10' : 'from-secondary/20 to-secondary/10';
              const textColor = isGreen ? 'text-primary group-hover:text-primary-dark' : 'text-secondary group-hover:text-secondary-dark';

              return (
                <motion.div key={idx} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                  <div className="relative h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} rounded-3xl border ${borderColor} transition-all duration-500 group-hover:shadow-xl`}></div>

                    <div className="relative p-8 h-full flex flex-col">
                      {/* Icon */}
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon size={32} className={textColor} />
                      </motion.div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold mb-4 transition-colors ${textColor}`}>
                        {value.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
