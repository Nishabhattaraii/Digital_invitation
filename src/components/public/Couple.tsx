import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { BurgundyFloralCorner } from '../decorative/BotanicalDecorations';

export const Couple: React.FC = () => {
  const { data } = useWedding();
  const { groom, bride } = data.couple;

  return (
    <section id="couple" className="py-16 sm:py-24 px-4 max-w-5xl mx-auto relative scroll-mt-16 sm:scroll-mt-20">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E121E] font-semibold block mb-2">
          Two Souls • One Sacred Bond
        </span>
        <h2 className="font-serif-cormorant font-bold text-3xl sm:text-4xl lg:text-5xl text-[#5E121E]">
          The Bride &amp; The Groom
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B89352] to-transparent mx-auto mt-3" />
      </div>

      {/* Couple Cards Grid with Burgundy Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-4xl mx-auto">
        {/* Groom Card */}
        <div className="stationery-card stationery-card-inset rounded-2xl p-7 sm:p-10 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-xl border-[1.5px] border-[#5E121E] bg-white">
          {/* Restrained Burgundy Floral Corner (Decreased size) */}
          {data.appearance.showFloralDecorations && (
            <BurgundyFloralCorner position="top-left" size={110} withWash={false} />
          )}

          {/* Groom Image with gold and burgundy ring */}
          <div className="relative mb-5 group mt-2 z-10">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 border-2 border-[#B89352] bg-[#FAF6F0] shadow-sm">
              <img
                src={groom.image || '/images/groom.jpg'}
                alt={groom.name}
                className="w-full h-full object-cover object-top rounded-full filter contrast-[1.03]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/groom.jpg';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#5E121E] text-amber-100 text-[10px] font-medium uppercase tracking-[0.2em] px-4 py-0.5 rounded-full border border-amber-300/40 shadow-xs whitespace-nowrap">
              {groom.role}
            </div>
          </div>

          <h3 className="font-serif-cormorant font-bold text-2xl sm:text-3xl text-[#5E121E] mb-1 z-10">
            {groom.name}
          </h3>

          {groom.attire && (
            <p className="text-xs sm:text-sm text-[#B89352] font-medium tracking-wide mb-3 italic font-serif-cormorant z-10">
              {groom.attire}
            </p>
          )}

          <div className="w-12 h-[1px] bg-[#B89352]/60 my-2 z-10" />

          <p className="font-serif-cormorant text-base sm:text-lg text-[#58333B] leading-relaxed italic max-w-xs mt-2 flex-1 flex items-center z-10">
            "{groom.description}"
          </p>
        </div>

        {/* Bride Card */}
        <div className="stationery-card stationery-card-inset rounded-2xl p-7 sm:p-10 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-xl border-[1.5px] border-[#5E121E] bg-white">
          {/* Restrained Burgundy Floral Corner (Decreased size) */}
          {data.appearance.showFloralDecorations && (
            <BurgundyFloralCorner position="top-right" size={110} withWash={false} />
          )}

          {/* Bride Image with gold and burgundy ring */}
          <div className="relative mb-5 group mt-2 z-10">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 border-2 border-[#B89352] bg-[#FAF6F0] shadow-sm">
              <img
                src={bride.image || '/images/bride.jpg'}
                alt={bride.name}
                className="w-full h-full object-cover object-top rounded-full filter contrast-[1.03]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/bride.jpg';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#5E121E] text-amber-100 text-[10px] font-medium uppercase tracking-[0.2em] px-4 py-0.5 rounded-full border border-amber-300/40 shadow-xs whitespace-nowrap">
              {bride.role}
            </div>
          </div>

          <h3 className="font-serif-cormorant font-bold text-2xl sm:text-3xl text-[#5E121E] mb-1 z-10">
            {bride.name}
          </h3>

          {bride.attire && (
            <p className="text-xs sm:text-sm text-[#B89352] font-medium tracking-wide mb-3 italic font-serif-cormorant z-10">
              {bride.attire}
            </p>
          )}

          <div className="w-12 h-[1px] bg-[#B89352]/60 my-2 z-10" />

          <p className="font-serif-cormorant text-base sm:text-lg text-[#58333B] leading-relaxed italic max-w-xs mt-2 flex-1 flex items-center z-10">
            "{bride.description}"
          </p>
        </div>
      </div>
    </section>
  );
};
