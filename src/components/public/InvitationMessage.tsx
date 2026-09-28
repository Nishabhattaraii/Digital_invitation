import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { BurgundyFloralCorner } from '../decorative/BotanicalDecorations';
import { MandalaMotif } from '../decorative/MandalaMotif';

export const InvitationMessage: React.FC = () => {
  const { data } = useWedding();
  const { invitation } = data;

  return (
    <section id="invitation" className="py-16 sm:py-24 px-4 max-w-4xl mx-auto relative">
      <div className="relative stationery-card stationery-card-inset rounded-2xl sm:rounded-3xl p-8 sm:p-14 lg:p-18 text-center shadow-xl bg-white overflow-hidden border-[1.5px] border-[#5E121E]">
        {/* Subtle Watermark Mandala */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 scale-110 sm:scale-125">
          <MandalaMotif size={420} opacity={0.12} />
        </div>

        {/* Restrained Burgundy Floral Corners (Decreased size) */}
        {data.appearance.showFloralDecorations && (
          <>
            <BurgundyFloralCorner position="top-left" size={140} />
            <BurgundyFloralCorner position="bottom-right" size={140} />
          </>
        )}

        {/* Invitation Text Content */}
        <div className="relative z-10 max-w-xl mx-auto py-2">
          {/* Sacred Symbol */}
          <div className="inline-block mb-3">
            <span className="font-devanagari text-xl sm:text-3xl text-[#5E121E] font-semibold tracking-wider">
              ॥ ॐ श्री गणेशाय नमः ॥
            </span>
          </div>

          <h3 className="font-calligraphy text-3xl sm:text-4xl lg:text-5xl text-[#B89352] my-2">
            {invitation.heading}
          </h3>

          <p className="font-serif-cormorant text-base sm:text-2xl text-[#4E232B] leading-relaxed sm:leading-loose my-6 italic">
            "{invitation.mainMessage}"
          </p>

          <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#5E121E] to-transparent mx-auto my-6" />

          <p className="font-serif-cormorant font-bold text-base sm:text-xl text-[#5E121E] tracking-wide">
            {invitation.closingMessage}
          </p>

          {invitation.familySignature && (
            <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#5E121E] mt-6 font-semibold">
              — {invitation.familySignature}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
