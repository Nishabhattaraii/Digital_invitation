import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { BurgundyFloralCorner } from '../decorative/BotanicalDecorations';
import { downloadIcsFile, generateGoogleCalendarUrl } from '../../utils/calendarHelper';
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus, Flame, PartyPopper } from 'lucide-react';

export const Events: React.FC = () => {
  const { data } = useWedding();
  const { wedding, reception } = data.events;
  const showReception = data.events.showReception !== false;

  const handleAddToCalendar = (event: typeof wedding) => {
    downloadIcsFile(
      `${event.title} - ${data.hero.groomName} & ${data.hero.brideName}`,
      event.description,
      `${event.venue}, ${event.address}`,
      event.date,
      event.time
    );
  };

  const getGoogleCalLink = (event: typeof wedding) => {
    const isReception = event.id === 'reception';
    const start = isReception ? '20261206T041500Z' : '20261205T031500Z';
    const end = isReception ? '20261206T091500Z' : '20261205T101500Z';
    return generateGoogleCalendarUrl(
      `${event.title} - ${data.hero.groomName} & ${data.hero.brideName}`,
      event.description,
      `${event.venue}, ${event.address}`,
      start,
      end
    );
  };

  return (
    <section id="events" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E121E] font-semibold block mb-2">
          Ceremony &amp; Festivities
        </span>
        <h2 className="font-serif-cormorant font-bold text-3xl sm:text-4xl lg:text-5xl text-[#5E121E]">
          {showReception ? 'Wedding Events' : 'Wedding Ceremony'}
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B89352] to-transparent mx-auto mt-3" />
      </div>

      <div
        className={
          showReception
            ? 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'
            : 'max-w-xl mx-auto'
        }
      >
        {/* CARD 1: WEDDING CEREMONY */}
        <div className="stationery-card stationery-card-inset rounded-2xl p-7 sm:p-10 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl border-[1.5px] border-[#5E121E] bg-white">
          {/* Restrained Burgundy Floral Corner (Decreased size) */}
          {data.appearance.showFloralDecorations && (
            <BurgundyFloralCorner position="top-right" size={110} withWash={false} />
          )}

          <div className="relative z-10">
            {/* Traditional Ritual Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#F9ECEE] text-[#5E121E] border border-[#5E121E]/30">
                <Flame className="w-3.5 h-3.5 text-[#5E121E]" />
                Vedic Vivaha Sanskar
              </span>

              <span className="text-xs text-[#B89352] font-serif-cormorant font-semibold italic">
                Auspicious Union
              </span>
            </div>

            <h3 className="font-serif-cormorant font-bold text-2xl sm:text-3xl text-[#381A20] mb-1">
              {wedding.title}
            </h3>

            {wedding.nepaliTitle && (
              <p className="font-devanagari text-lg text-[#5E121E] mb-3 font-semibold">
                {wedding.nepaliTitle}
              </p>
            )}

            <p className="text-xs sm:text-sm text-[#58333B] mb-5 leading-relaxed font-serif-cormorant italic">
              "{wedding.description}"
            </p>

            {/* Event Meta Details Grid */}
            <div className="space-y-3 bg-[#FAF6F0] p-4 sm:p-5 rounded-xl border border-[#E8DFC8] mb-6 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#5E121E] shrink-0 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold">
                    Date
                  </span>
                  <span className="font-serif-cormorant font-bold text-base text-[#381A20]">
                    {wedding.date} {wedding.dayOfWeek ? `(${wedding.dayOfWeek})` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#5E121E] shrink-0 shadow-2xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold">
                    Auspicious Lagna
                  </span>
                  <span className="font-serif-cormorant font-bold text-base text-[#381A20]">
                    {wedding.time}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#5E121E] shrink-0 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold">
                    Ceremony Venue
                  </span>
                  <span className="font-serif-cormorant font-bold text-base text-[#381A20]">
                    {wedding.venue}
                  </span>
                  <span className="block text-[11px] text-[#58333B] mt-0.5">
                    {wedding.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Burgundy and Refined Outline */}
          <div className="relative z-10 pt-2 flex flex-col sm:flex-row gap-2.5">
            <a
              href={wedding.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5E121E] hover:bg-[#4E0B14] text-white text-[10px] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
              <span>Get Directions</span>
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCalendar(wedding)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#5E121E] bg-white text-[#5E121E] hover:bg-[#F9ECEE] text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors active:scale-98 shadow-2xs cursor-pointer"
                title="Download iCal file (.ics)"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>iCal</span>
              </button>

              <a
                href={getGoogleCalLink(wedding)}
                target="_blank"
                rel="noopener noreferrer"
                title="Add directly to Google Calendar"
                className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-[#5E121E] bg-white text-[#5E121E] hover:bg-[#F9ECEE] text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors active:scale-98 shadow-2xs"
              >
                Google
              </a>
            </div>
          </div>
        </div>

        {/* CARD 2: RECEPTION EVENT (Shown only if showReception is enabled) */}
        {showReception && (
          <div className="stationery-card stationery-card-inset rounded-2xl p-7 sm:p-10 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl border-[1.5px] border-[#5E121E] bg-white">
            {/* Restrained Burgundy Floral Corner (Decreased size) */}
            {data.appearance.showFloralDecorations && (
              <BurgundyFloralCorner position="top-right" size={110} withWash={false} />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#FDF8EC] text-[#8C6B13] border border-[#B89352]/35">
                  <PartyPopper className="w-3.5 h-3.5 text-[#B89352]" />
                  Celebratory Banquet
                </span>

                <span className="text-xs text-[#B89352] font-serif-cormorant font-semibold italic">
                  Joy &amp; Festivity
                </span>
              </div>

              <h3 className="font-serif-cormorant font-bold text-2xl sm:text-3xl text-[#381A20] mb-1">
                {reception.title}
              </h3>

              {reception.nepaliTitle && (
                <p className="font-devanagari text-lg text-[#8C6B13] mb-3 font-semibold">
                  {reception.nepaliTitle}
                </p>
              )}

              <p className="text-xs sm:text-sm text-[#58333B] mb-5 leading-relaxed font-serif-cormorant italic">
                "{reception.description}"
              </p>

              {/* Reception Meta Details Grid */}
              <div className="space-y-3 bg-[#FAF6F0] p-4 sm:p-5 rounded-xl border border-[#E8DFC8] mb-6 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#8C6B13] shrink-0 shadow-2xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold">
                      Date
                    </span>
                    <span className="font-serif-cormorant font-bold text-base text-[#381A20]">
                      {reception.date} {reception.dayOfWeek ? `(${reception.dayOfWeek})` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#8C6B13] shrink-0 shadow-2xs">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold">
                      Banquet Time
                    </span>
                    <span className="font-serif-cormorant font-bold text-base text-[#381A20]">
                      {reception.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#8C6B13] shrink-0 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#5E121E] font-bold">
                      Banquet Venue
                    </span>
                    <span className="font-serif-cormorant font-bold text-base text-[#381A20]">
                      {reception.venue}
                    </span>
                    <span className="block text-[11px] text-[#58333B] mt-0.5">
                      {reception.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={reception.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5E121E] hover:bg-[#4E0B14] text-white text-[10px] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
                <span>Get Directions</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCalendar(reception)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#5E121E] bg-white text-[#5E121E] hover:bg-[#F9ECEE] text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors active:scale-98 shadow-2xs cursor-pointer"
                  title="Download iCal file (.ics)"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>iCal</span>
                </button>

                <a
                  href={getGoogleCalLink(reception)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Add directly to Google Calendar"
                  className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-[#5E121E] bg-white text-[#5E121E] hover:bg-[#F9ECEE] text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors active:scale-98 shadow-2xs"
                >
                  Google
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
