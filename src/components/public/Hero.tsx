import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  BurgundyFloralCorner,
  BurgundyFloralSideSpray,
  BotanicalMonogramWreath,
} from '../decorative/BotanicalDecorations';
import { ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, openInvitation } = useWedding();

  const handleOpenInvitation = () => {
    openInvitation();
    setTimeout(() => {
      const target = document.querySelector('#couple');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-3 sm:px-6 pt-24 pb-16 overflow-hidden bg-[var(--wedding-bg)]"
    >
      {/* 
        Luxury Wedding Invitation Suite (Matching User Reference Exactly):
        Layer 1 (Outer): Deeper muted dusty burgundy / wine stationery paper (#703637 - #622D2E)
        Layer 2 (Inner): Warm ivory / cream arched invitation card (#F5EDE1, not white)
        Typography: Rich deep wine burgundy (#4A0812)
        Accents: Antique champagne gold (#C5A059 / #B89352)
      */}
      <div
        className="relative max-w-3xl w-full mx-auto p-3.5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#541E22]/70 ring-1 ring-[#C5A059]/45"
        style={{
          backgroundColor: '#6E3535',
          backgroundImage: `
            radial-gradient(ellipse at 15% 15%, rgba(125, 62, 64, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse at 85% 85%, rgba(85, 28, 30, 0.5) 0%, transparent 60%),
            linear-gradient(155deg, #743837 0%, #6E3535 50%, #5F292B 100%)
          `,
        }}
      >
        {/* Outer Stationery Delicate Antique Champagne Gold Hairline Inset */}
        <div className="relative p-2 sm:p-4 md:p-5 border border-[#C5A059]/40 rounded-xl sm:rounded-2xl">
          {/* Floral Arrangement 1: Top-Left Corner (Emerging from outer edge into ivory arch) */}
          {data.appearance.showFloralDecorations && (
            <>
              <BurgundyFloralCorner
                position="top-left"
                size={155}
                withWash={true}
                className="-top-4 -left-4 sm:-top-6 sm:-left-6"
              />
              <BurgundyFloralSideSpray
                position="bottom-right"
                width={140}
                height={215}
                withWash={true}
                className="-bottom-4 -right-4 sm:-bottom-6 sm:-right-6"
              />
            </>
          )}

          {/* 
            Layer 2: Inner Arched Invitation Card
            Warm ivory / cream paper (#F5EDE1, not pure white) with double gold & burgundy hairlines
          */}
          <div
            className="relative z-10 border-[1.5px] border-[#5E121E]/55 rounded-t-[135px] sm:rounded-t-[210px] rounded-b-xl px-4 sm:px-10 pt-9 sm:pt-14 pb-8 sm:pb-12 text-center shadow-[0_12px_36px_rgba(45,15,18,0.22)]"
            style={{
              backgroundColor: '#F5EDE1',
              backgroundImage:
                'radial-gradient(ellipse at 50% 30%, #F8F3EA 0%, #F5EDE1 65%, #EEE3D3 100%)',
            }}
          >
            {/* Subtle inner champagne gold arch hairline */}
            <div className="absolute inset-1 sm:inset-2 pointer-events-none rounded-t-[131px] sm:rounded-t-[204px] rounded-b-lg border border-[#C5A059]/35" />

            {/* Top Center: Circular Laurel Wreath Monogram */}
            <div className="mb-4 relative z-10">
              <BotanicalMonogramWreath
                initials={`${(data.hero.groomName || 'Siddhartha')
                  .replace(/^Dr\.\s*/i, '')
                  .trim()
                  .charAt(0)
                  .toUpperCase() || 'S'} ${(data.hero.brideName || 'Prashamsa')
                  .replace(/^Dr\.\s*/i, '')
                  .trim()
                  .charAt(0)
                  .toUpperCase() || 'P'}`}
                size={72}
              />
            </div>

            {/* Sacred Inscription & Intro */}
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#520C17] font-semibold mb-1">
              Together with joyful hearts and the blessings of god
            </p>
            <p className="font-serif-cormorant text-sm sm:text-base text-[#632029] italic mb-5">
              we invite you to share in the celebration of love as
            </p>

            {/* Couple Names - High Contrast Rich Deep Burgundy Serif */}
            <div className="my-3 sm:my-5 space-y-1">
              <h1 className="font-serif-cormorant font-bold text-3xl sm:text-5xl lg:text-6xl text-[#4A0812] tracking-wide uppercase leading-tight">
                {data.hero.groomName}
              </h1>

              <div className="flex items-center justify-center gap-3 my-1">
                <span className="h-[0.5px] w-12 sm:w-16 bg-[#B89352]" />
                <span className="font-calligraphy text-2xl sm:text-3xl text-[#B89352] px-2 italic">
                  and
                </span>
                <span className="h-[0.5px] w-12 sm:w-16 bg-[#B89352]" />
              </div>

              <h1 className="font-serif-cormorant font-bold text-3xl sm:text-5xl lg:text-6xl text-[#4A0812] tracking-wide uppercase leading-tight">
                {data.hero.brideName}
              </h1>
            </div>

            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#520C17] font-medium my-4">
              Join together in holy matrimony • {data.hero.devanagariGreeting || 'शुभ विवाह'}
            </p>

            {/* Couple Portrait Ring Medallion */}
            <div className="my-4 flex justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 border-2 border-[#B89352] shadow-sm bg-[#F5EDE1]">
                <img
                  src={data.appearance.heroIllustrationUrl || '/images/hero-couple.jpg'}
                  alt="Couple Portrait"
                  className="w-full h-full object-cover object-top rounded-full filter contrast-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-couple.jpg';
                  }}
                />
              </div>
            </div>

            <div className="w-16 h-[0.5px] bg-[#B89352] mx-auto my-5" />

            {/* 3-Column Metadata Details Grid (Exact Reference Image Style) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto py-3 my-3 text-center">
              {/* Date */}
              <div className="flex flex-col items-center justify-center">
                <Calendar className="w-4 h-4 text-[#520C17] mb-1.5" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#520C17] font-bold block">
                  Date
                </span>
                <span className="font-serif-cormorant font-semibold text-xs sm:text-sm text-[#381A20] mt-0.5">
                  {data.events.wedding.date || 'Dec 5, 2026'}
                </span>
                <span className="text-[9px] font-devanagari text-[#632029]">
                  {data.events.wedding.nepaliDate || 'मंसिर २०, २०८३'}
                </span>
              </div>

              {/* Time (Separated by vertical hairlines) */}
              <div className="flex flex-col items-center justify-center border-x border-[#B89352]/40 px-2">
                <Clock className="w-4 h-4 text-[#520C17] mb-1.5" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#520C17] font-bold block">
                  Time
                </span>
                <span className="font-serif-cormorant font-semibold text-xs sm:text-sm text-[#381A20] mt-0.5">
                  {data.events.wedding.time || '10:00 AM'}
                </span>
                <span className="text-[9px] text-[#58333B]">
                  {data.events.wedding.muhurat || 'Auspicious Lagna'}
                </span>
              </div>

              {/* Venue */}
              <div className="flex flex-col items-center justify-center">
                <MapPin className="w-4 h-4 text-[#5E121E] mb-1.5" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold block">
                  Venue
                </span>
                <span className="font-serif-cormorant font-semibold text-xs sm:text-sm text-[#381A20] mt-0.5 truncate max-w-[105px]">
                  {data.events.wedding.venue.split(',')[0] || 'Kathmandu'}
                </span>
                <span className="text-[9px] text-[#58333B] truncate max-w-[90px]">
                  {data.events.wedding.address || 'Kathmandu, NP'}
                </span>
              </div>
            </div>

            {/* Subtle Gold Divider */}
            <div className="w-12 h-[0.5px] bg-[#B89352]/60 mx-auto my-4" />

            {/* CTA Button */}
            <div className="mt-5">
              <button
                onClick={handleOpenInvitation}
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#5E121E] hover:bg-[#4E0B14] text-white border border-[#B89352]/60 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-98"
              >
                <span>{data.hero.openInvitationButtonText}</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-amber-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
