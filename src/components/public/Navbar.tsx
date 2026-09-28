import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingAudio } from '../decorative/WeddingAudio';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data } = useWedding();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Couple', href: '#couple' },
    { label: 'Ceremony', href: '#ceremony' },
    { label: 'Events', href: '#events' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Countdown', href: '#countdown' },
    { label: 'Calendar', href: '#calendar' },
    { label: 'Invitation', href: '#invitation' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#4E0B14] border-b border-[#B89352]/40 shadow-md ${
        isScrolled ? 'py-2.5 bg-[#420810]/95 backdrop-blur-md' : 'py-3.5 sm:py-4.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-2">
        {/* Monogram Brand in Gold on Burgundy */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          {(() => {
            const groomPart = (data.hero.groomName || 'Siddhartha').replace(/^Dr\.\s*/i, '').trim();
            const bridePart = (data.hero.brideName || 'Prashamsa').replace(/^Dr\.\s*/i, '').trim();
            const gInitial = groomPart.charAt(0).toUpperCase() || 'S';
            const bInitial = bridePart.charAt(0).toUpperCase() || 'P';
            const gFirst = groomPart.split(' ')[0] || 'Siddhartha';
            const bFirst = bridePart.split(' ')[0] || 'Prashamsa';
            return (
              <>
                <div className="w-8 h-8 rounded-full border border-[#D4AF37]/80 flex items-center justify-center bg-[#5E121E] shadow-2xs group-hover:border-white transition-colors">
                  <span className="font-serif-cormorant font-bold text-sm text-[#FAF6F0]">
                    {gInitial}<span className="text-[#D4AF37] font-sans text-[10px] mx-0.5">&amp;</span>{bInitial}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block font-serif-cormorant font-semibold text-sm tracking-[0.2em] text-[#FAF6F0] uppercase">
                    {gFirst} &amp; {bFirst}
                  </span>
                </div>
              </>
            );
          })()}
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#FAF6F0]/90 hover:text-[#D4AF37] transition-colors relative py-1 group cursor-pointer"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Action Icons: Audio & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <WeddingAudio />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-[#D4AF37]/60 text-[#FAF6F0] hover:bg-[#5E121E] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#4E0B14] border-t border-[#B89352]/30 px-6 py-5 space-y-3.5 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-xs uppercase tracking-[0.25em] text-[#FAF6F0]/90 hover:text-[#D4AF37] py-1 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
