import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { BurgundyFloralCorner } from '../decorative/BotanicalDecorations';

export const FamilyBlessings: React.FC = () => {
  const { data } = useWedding();
  const { groomFamily, brideFamily } = data.family;

  return (
    <section id="ceremony" className="py-16 sm:py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E121E] font-semibold block mb-2">
          Paternal Blessings &amp; Lineage
        </span>
        <h2 className="font-serif-cormorant font-bold text-3xl sm:text-4xl lg:text-5xl text-[#5E121E]">
          Family Blessings
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B89352] to-transparent mx-auto mt-3" />
      </div>

      {/* Two Column Layout with Luxury Burgundy Bordered Card */}
      <div className="relative stationery-card stationery-card-inset rounded-2xl p-8 sm:p-12 lg:p-16 shadow-xl border-[1.5px] border-[#5E121E] bg-white">
        {data.appearance.showFloralDecorations && (
          <>
            <BurgundyFloralCorner position="top-left" size={120} withWash={false} />
            <BurgundyFloralCorner position="bottom-right" size={120} withWash={false} />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 relative z-10">
          {/* Vertical Divider for desktop with center gold accent */}
          <div className="hidden md:flex absolute top-4 bottom-4 left-1/2 -translate-x-1/2 flex-col items-center justify-center">
            <div className="w-[1px] flex-1 bg-[#E8DFC8]" />
            <div className="my-2 w-2 h-2 rounded-full bg-[#5E121E]" />
            <div className="w-[1px] flex-1 bg-[#E8DFC8]" />
          </div>

          {/* Left Column: Groom's Family */}
          <div className="flex flex-col items-center text-center p-3 sm:p-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#5E121E] font-bold mb-3 px-4 py-1 rounded-full bg-[#F9ECEE] border border-[#5E121E]/30">
              {groomFamily.note || "Groom's Family"}
            </span>

            <h4 className="font-calligraphy text-2xl sm:text-3xl text-[#B89352] my-1">
              {groomFamily.heading}
            </h4>

            <div className="my-4 space-y-2">
              <p className="font-serif-cormorant font-bold text-xl sm:text-2xl text-[#381A20]">
                {groomFamily.father}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-[#B89352]" />
                <span className="text-xs text-[#5E121E] font-serif-cormorant italic">&amp;</span>
                <span className="w-8 h-[1px] bg-[#B89352]" />
              </div>
              <p className="font-serif-cormorant font-bold text-xl sm:text-2xl text-[#381A20]">
                {groomFamily.mother}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#58333B] max-w-xs mt-2 italic font-serif-cormorant leading-relaxed">
              Cordially request the honour of your presence to celebrate the auspicious union of their beloved son.
            </p>
          </div>

          {/* Right Column: Bride's Family */}
          <div className="flex flex-col items-center text-center p-3 sm:p-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#5E121E] font-bold mb-3 px-4 py-1 rounded-full bg-[#F9ECEE] border border-[#5E121E]/30">
              {brideFamily.note || "Bride's Family"}
            </span>

            <h4 className="font-calligraphy text-2xl sm:text-3xl text-[#B89352] my-1">
              {brideFamily.heading}
            </h4>

            <div className="my-4 space-y-2">
              <p className="font-serif-cormorant font-bold text-xl sm:text-2xl text-[#381A20]">
                {brideFamily.father}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-[#B89352]" />
                <span className="text-xs text-[#5E121E] font-serif-cormorant italic">&amp;</span>
                <span className="w-8 h-[1px] bg-[#B89352]" />
              </div>
              <p className="font-serif-cormorant font-bold text-xl sm:text-2xl text-[#381A20]">
                {brideFamily.mother}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#58333B] max-w-xs mt-2 italic font-serif-cormorant leading-relaxed">
              Seek your blessings and gracious presence as their beloved daughter embarks on this sacred lifelong journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
