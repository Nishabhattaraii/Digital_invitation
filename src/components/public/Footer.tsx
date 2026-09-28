import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { BotanicalMonogramWreath, BurgundyFloralCorner } from '../decorative/BotanicalDecorations';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data } = useWedding();

  return (
    <footer className="mt-20 pt-16 pb-14 border-t-2 border-[#B89352]/40 bg-[#4E0B14] text-[#FAF6F0] relative overflow-hidden">
      {/* Restrained Burgundy Floral Accent in Bottom Corner (Decreased size) */}
      {data.appearance.showFloralDecorations && (
        <BurgundyFloralCorner position="bottom-right" size={110} withWash={false} className="-mr-2 -mb-2 opacity-80" />
      )}

      <div className="max-w-4xl mx-auto text-center space-y-4 px-4 relative z-10">
        {/* Monogram crest in gold on burgundy */}
        <div className="mb-2">
          <BotanicalMonogramWreath initials="S P" size={70} light={true} />
        </div>

        <h3 className="font-serif-cormorant font-normal text-2xl sm:text-3xl text-[#FAF6F0] tracking-wider uppercase">
          {data.hero.groomName} &amp; {data.hero.brideName}
        </h3>

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
          {data.hero.weddingDate}
        </p>

        <div className="w-16 h-[0.5px] bg-[#B89352]/50 mx-auto my-2" />

        <p className="font-serif-cormorant text-base sm:text-lg italic text-[#FAF6F0]/90 flex items-center justify-center gap-1.5">
          <span>With love and blessings from our families</span>
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
        </p>

        <div className="pt-6 border-t border-[#B89352]/30 max-w-xl mx-auto text-center">
          <p className="font-devanagari text-[#D4AF37] text-sm tracking-wide">
            शुभ विवाह • मङ्गलम् भगवान विष्णुः
          </p>
        </div>
      </div>
    </footer>
  );
};
