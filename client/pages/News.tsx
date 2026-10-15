import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { HeroSection } from '@/components/shared/HeroSection';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { api } from '@/lib/api';
import { resolveAssetUrl } from '@/lib/assets';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  readTime: number;
  date: string;
  image?: string;
  category?: string;
  author?: string;
  featured?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  link?: string;
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await api
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;

        // Transform data to include excerpt, readTime, and date
        const transformedData: Article[] = (data || []).map((item) => ({
          ...item,
          date: item.published_at,
          excerpt: item.content.substring(0, 150) + '...',
          readTime: Math.ceil(item.content.split(' ').length / 200),
        }));

        setArticles(transformedData);
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to empty array if fetch fails
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const fallbackArticles: Article[] = [
    {
      id: '1',
      title: 'New AI Initiative Launches in Partnership with Tech Leaders',
      excerpt:
        'The Digital Innovation Lab announces a groundbreaking AI research initiative in collaboration with leading technology companies.',
      content: 'The Digital Innovation Lab is proud to announce a groundbreaking AI research initiative developed in collaboration with some of the world\'s leading technology companies. This partnership marks a significant milestone in our commitment to advancing artificial intelligence research and its applications across Africa.\n\nThe initiative will focus on several key areas including machine learning optimization, natural language processing for African languages, and AI ethics. Over the next three years, we expect to conduct over 50 research projects and publish groundbreaking findings that will shape the future of AI in our continent.\n\nKey partners in this initiative include leading tech firms, academic institutions, and government agencies. Together, we aim to create AI solutions that address unique African challenges while maintaining the highest standards of research integrity and ethical considerations.\n\nThis announcement comes as part of our broader strategy to position Africa as a leader in cutting-edge AI research and development.',
      category: 'Technology',
      author: 'Sarah Johnson',
      published_at: '2024-01-15T00:00:00Z',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
      featured: false,
      date: '2024-01-15',
      image: '🤖',
      readTime: 5,
    },
    {
      id: '2',
      title: 'Student Success Stories: Meet Our Scholarship Recipients',
      excerpt:
        'Celebrating the achievements of our talented students who received scholarships to support their innovation projects.',
      content: 'This year, we are proud to highlight the exceptional achievements of our scholarship recipients who have demonstrated remarkable innovation and dedication to advancing technology across Africa.\n\nOur scholarship program provides financial support, mentorship, and resources to talented students pursuing groundbreaking projects in digital innovation. This year\'s cohort includes 25 exceptional students from 12 different African countries.\n\nAmong this year\'s recipients is Zainab Ahmed from Morocco, who is developing an AI-powered health diagnostic system tailored for rural African communities. Her project aims to make quality healthcare more accessible by leveraging machine learning to provide accurate health assessments.\n\nAnother recipient, David Owusu from Ghana, is working on blockchain solutions for supply chain transparency in agricultural exports, addressing a critical need in the African agricultural sector.\n\nThese inspiring stories demonstrate the incredible potential of African talent and innovation. We are committed to supporting the next generation of innovators who will drive digital transformation across our continent.',
      category: 'Education',
      author: 'Ahmed Hassan',
      date: '2024-01-12',
      image: '🎓',
      readTime: 4,
    },
    {
      id: '3',
      title: 'Smart Campus Platform Wins Innovation Award',
      excerpt:
        'Our flagship Smart Campus Platform has been recognized with a prestigious international innovation award.',
      content: 'The Digital Innovation Lab is delighted to announce that our flagship Smart Campus Platform has won the prestigious International Innovation Award in the Smart Cities category. This recognition validates our commitment to creating innovative solutions that enhance campus life and operational efficiency.\n\nThe Smart Campus Platform is a comprehensive ecosystem that integrates IoT sensors, AI analytics, and user-friendly interfaces to optimize campus operations. From energy management to student engagement, the platform provides real-time insights and automated solutions.\n\nKey features of the platform include:\n- Real-time environmental monitoring and optimization\n- Intelligent resource allocation and scheduling\n- Enhanced security and emergency response systems\n- Student engagement and community building tools\n- Data-driven decision-making for campus administrators\n\nThis award recognizes the hard work of our dedicated team of researchers, engineers, and designers who collaborated to bring this vision to life. The platform is currently being deployed at Al Akhawayn University and will serve as a model for smart campus solutions across Africa.\n\nWe are grateful for the recognition and remain committed to advancing innovative technologies that benefit our communities.',
      category: 'Awards',
      author: 'Amina Elkhomsi',
      date: '2024-01-10',
      image: '🏆',
      readTime: 3,
    },
    {
      id: '4',
      title: 'Blockchain Research Reaches Critical Milestone',
      excerpt:
        'Our blockchain research team announces successful completion of Phase 2 of the distributed ledger project.',
      content: 'Our blockchain research team has successfully completed Phase 2 of our distributed ledger research project, marking a significant milestone in our exploration of blockchain technology applications for African enterprises.\n\nThis phase focused on developing scalable consensus mechanisms suitable for high-latency environments and testing our platform with over 1,000 concurrent transactions. The results exceed our expectations and demonstrate the viability of our approach for real-world applications.\n\nKey achievements in Phase 2 include:\n- Development of a novel consensus algorithm optimized for African network conditions\n- Successful stress testing with 10,000+ transactions per second\n- Integration with existing enterprise systems\n- Security audits and penetration testing with zero critical vulnerabilities found\n\nPhase 3 will focus on pilot deployments in financial services, supply chain management, and government services. We expect these pilots to demonstrate tangible value and pave the way for broader adoption of blockchain technologies across various sectors.\n\nThis research exemplifies our commitment to developing technology solutions that address the unique needs and challenges of African economies.',
      category: 'Technology',
      author: 'Mohammed Bennani',
      date: '2024-01-08',
      image: '🔗',
      readTime: 6,
    },
    {
      id: '5',
      title: 'Women in Tech Conference Hosted at DIL',
      excerpt:
        'Celebrating diversity and inclusion with our annual Women in Tech conference featuring industry leaders.',
      content: 'The Digital Innovation Lab hosted its second annual Women in Tech conference, bringing together over 500 attendees from across Africa to celebrate the achievements of women in technology and discuss strategies for increasing representation and support.\n\nThe conference featured keynote addresses from leading female tech entrepreneurs, researchers, and innovators from across the continent. Attendees participated in workshops, panel discussions, and networking sessions focused on topics ranging from technical skill development to entrepreneurship and leadership.\n\nHighlights of the conference included:\n- Keynote speeches from 5 renowned African women technologists\n- 20+ interactive workshops covering technical and professional topics\n- Networking sessions connecting mentors with aspiring tech professionals\n- Announcements of new mentorship programs and scholarship opportunities\n- Discussions on creating inclusive workplaces and addressing gender disparities\n\nAs part of the conference, we launched a new mentorship program specifically designed to support women pursuing careers in technology. The program will connect 100 mentors with mentees over the next year, providing guidance, support, and opportunities.\n\nWe were thrilled by the energy and enthusiasm demonstrated throughout the conference and remain committed to fostering diversity and inclusion in technology.',
      category: 'Events',
      author: 'Leila Boutaleb',
      date: '2024-01-05',
      image: '👩‍💻',
      readTime: 4,
    },
    {
      id: '6',
      title: 'New Partnerships Expand Global Reach',
      excerpt:
        'The lab announces new strategic partnerships with organizations in Europe, Asia, and North America.',
      content: 'The Digital Innovation Lab is excited to announce a series of new strategic partnerships with leading organizations across Europe, Asia, and North America. These partnerships will expand our global reach and create new opportunities for collaboration, knowledge exchange, and innovation.\n\nOur new partners include:\n- A leading European research institute focusing on sustainable technologies\n- A major Asian technology company specializing in IoT and smart infrastructure\n- North American universities advancing AI and machine learning research\n\nThese partnerships will enable us to:\n- Access global expertise and research resources\n- Facilitate technology transfer and knowledge sharing\n- Create opportunities for student and researcher exchanges\n- Collaborate on funded research projects of mutual interest\n- Expand the reach of our innovations to global markets\n\nThis expansion reinforces our position as a leader in digital innovation in Africa and demonstrates the global recognition of the high-quality research and innovation being conducted at the Digital Innovation Lab.\n\nWe look forward to collaborating with our new partners and creating synergies that benefit all stakeholders, particularly the communities we serve.',
      category: 'Partnership',
      author: 'Hassan Rachid',
      date: '2024-01-01',
      image: '🌍',
      readTime: 5,
    },
    {
      id: '7',
      title: 'Internship Program Expands to 100 Positions',
      excerpt:
        'Due to overwhelming success, the DIL internship program is expanding with 100 new positions across all departments.',
      content: 'Due to the overwhelming success and positive feedback from previous years, the Digital Innovation Lab is thrilled to announce a major expansion of our internship program. This year, we will offer 100 internship positions across all departments, double our capacity from the previous year.\n\nThe expanded program will provide opportunities in:\n- Software Development and Engineering\n- Data Science and Machine Learning\n- UX/UI Design\n- Project Management\n- Research and Innovation\n- Business Development\n\nInterns will gain hands-on experience working on cutting-edge projects, receive mentorship from experienced professionals, and develop skills highly sought after in the tech industry. Many of our past interns have gone on to join our team as full-time employees or have found opportunities with top companies globally.\n\nThe internship program is open to students at all levels and from all backgrounds. We are committed to supporting diverse talent and creating an inclusive environment where everyone can thrive.\n\nApplications for the internship program are now open. Interested candidates can find more information and apply through our website.',
      category: 'Education',
      author: 'Noor Eldin',
      date: '2023-12-28',
      image: '📈',
      readTime: 3,
    },
    {
      id: '8',
      title: 'Annual Report Highlights 2023 Achievements',
      excerpt:
        'Comprehensive overview of the lab\'s accomplishments, growth, and plans for the upcoming year.',
      content: 'The Digital Innovation Lab is pleased to release our 2023 Annual Report, which highlights the significant achievements, growth, and impact of our organization throughout the year.\n\nKey achievements in 2023 include:\n- 45 completed research projects across various technology domains\n- Publication of 120 peer-reviewed research papers\n- 3 patents filed for novel technologies developed at the lab\n- 500+ students trained through our educational programs\n- 20 new partnerships established with organizations globally\n- $5M in research funding secured\n- 50% growth in staff and research team\n\nOur research areas of focus:\n- Artificial Intelligence and Machine Learning\n- Blockchain and Distributed Systems\n- IoT and Smart Infrastructure\n- Cybersecurity and Digital Identity\n- Digital Finance and Fintech\n\nLooking forward to 2024, we are excited about new initiatives including the expansion of our AI research, launch of new educational programs, and increased focus on applied research with direct industry applications.\n\nWe are grateful to all our partners, supporters, team members, and the broader community for contributing to our success. Together, we continue to advance digital innovation across Africa.',
      category: 'News',
      author: 'Sarah Johnson',
      date: '2023-12-20',
      image: '📊',
      readTime: 7,
    },
  ];

  // Use fetched articles if available, otherwise fall back to default articles
  const displayArticles = articles.length > 0 ? articles : fallbackArticles;
  const categories = ['All', ...new Set(displayArticles.map((a) => a.category || 'Uncategorized'))];

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') {
      return displayArticles;
    }
    return displayArticles.filter((article) => (article.category || 'Uncategorized') === selectedCategory);
  }, [selectedCategory, displayArticles]);

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
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection
        title="News & Updates"
        subtitle="Stay informed about the latest from the Digital Innovation Lab"
        backgroundParticles
        compact
      />

      {/* News Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Latest Stories"
            subtitle="Read about our latest achievements, projects, and initiatives"
          />

          {/* Category Filter */}
          <motion.div className="mb-9 flex flex-wrap justify-center gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Articles Grid/Scroll */}
          <AnimatePresence>
            <motion.div
              className="flex md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 snap-x md:snap-none scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group cursor-pointer flex-shrink-0 w-[calc(100vw-2rem)] md:w-auto md:flex-shrink snap-center"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative h-full">
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    ></motion.div>

                    <AnimatedCard
                      variant="default"
                      className="relative h-full overflow-hidden flex flex-col shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-white group-hover:bg-white/95"
                    >
                      {/* Image */}
                      <motion.div
                        className="w-full h-48 bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mb-0 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                      >
                        {article.image && article.image.startsWith('http') ? (
                          <img
                            src={resolveAssetUrl(article.image)}
                            alt={article.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">{article.image || '📰'}</span>
                        )}
                      </motion.div>

                      {/* Content */}
                      <div className="p-6 flex-grow flex flex-col">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="mb-3">
                          <motion.span
                            className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary px-3 py-1 rounded-full group-hover:bg-primary/30 transition-colors"
                            whileHover={{ scale: 1.08 }}
                          >
                            <Tag size={12} />
                            {article.category}
                          </motion.span>
                        </div>

                        {/* Title */}
                        <motion.h3
                          className="text-lg font-bold text-primary mb-3 line-clamp-2 group-hover:text-primary-dark transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          {article.title}
                        </motion.h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3 group-hover:text-gray-800 transition-colors">
                          {article.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-200 group-hover:border-primary/30 transition-colors flex items-center justify-between">
                          <span className="text-xs text-gray-500">{article.readTime} min read</span>
                          <motion.button
                            className="text-primary font-semibold text-sm group-hover:text-primary-dark transition-colors flex items-center gap-2"
                            whileHover={{ gap: '12px' }}
                          >
                            Read More <span>→</span>
                          </motion.button>
                        </div>
                      </div>
                    </AnimatedCard>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Articles Found */}
          {filteredArticles.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-600 text-lg">
                No articles found in this category. Please try another.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-gray-500 hover:text-gray-700 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Article Header Image */}
              <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                {selectedArticle.image && selectedArticle.image.startsWith('http') ? (
                  <img
                    src={resolveAssetUrl(selectedArticle.image)}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-7xl">{selectedArticle.image || '📰'}</span>
                )}
              </div>

              {/* Article Content */}
              <div className="p-8 sm:p-12">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{selectedArticle.readTime} min read</span>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 text-sm bg-primary/15 text-primary px-4 py-2 rounded-full font-semibold">
                    <Tag size={14} />
                    {selectedArticle.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8 leading-tight">
                  {selectedArticle.title}
                </h1>

                {/* Divider */}
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full mb-8"></div>

                {/* Content */}
                <motion.div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <span className="text-sm text-gray-500 text-center sm:text-left">© 2024 Digital Innovation Lab</span>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {selectedArticle.link && (
                        <motion.a
                          href={selectedArticle.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Learn More <span>→</span>
                        </motion.a>
                      )}
                      <motion.button
                        onClick={() => setSelectedArticle(null)}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex-1 sm:flex-initial"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-white/80 mb-8">
              Subscribe to our newsletter to receive the latest news and updates from the Digital Innovation Lab.
            </p>

            <form className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-white/60 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default News;
