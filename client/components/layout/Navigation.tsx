import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { GlobalSearch } from '@/components/shared/GlobalSearch';

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Apply', href: '/apply' },
  { name: 'Team', href: '/team' },
  { name: 'Projects', href: '/projects' },
  { name: 'Partners', href: '/partners' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group h-16 flex-shrink-0">
            {/* University Logo */}
            <img
              src="/logo.png" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
              alt="Al Akhawayn University"
              className="h-12 sm:h-14 w-auto object-contain"
              width={200}
              height={200}
              loading="eager"
              decoding="async"
            />

            {/* Vertical Separator Line - hidden on mobile */}
            <div className="hidden sm:block h-10 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50"></div>

            {/* Text Brand */}
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-primary font-bold text-xs sm:text-sm leading-tight">Digital Innovation</span>
              <span className="text-primary font-bold text-xs sm:text-sm leading-tight">Laboratory</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <button onClick={() => setSearchOpen(true)} className="ml-1 rounded-lg p-2.5 text-gray-700 hover:bg-primary/10 hover:text-primary" aria-label="Search website"><Search size={20} /></button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-primary hover:bg-primary/10"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          variants={menuVariants}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => { setIsOpen(false); setSearchOpen(true); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-primary/5 hover:text-primary"><Search size={18} />Search</button>
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};
