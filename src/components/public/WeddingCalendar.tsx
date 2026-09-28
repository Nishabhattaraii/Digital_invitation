import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { downloadIcsFile } from '../../utils/calendarHelper';
import { Calendar as CalendarIcon, Clock, MapPin, CalendarPlus, CheckCircle2 } from 'lucide-react';

export const WeddingCalendar: React.FC = () => {
  const { data } = useWedding();
  const { weddingDay, receptionDay } = data.calendar;
  const { wedding, reception } = data.events;
  const showReception = data.events.showReception !== false;

  // Selected date state: defaults to wedding day
  const [selectedDay, setSelectedDay] = useState<number>(weddingDay);

  // December 2026 starts on Tuesday (index 2: Sun=0, Mon=1, Tue=2)
  const daysInMonth = 31;
  const startDayOfWeek = 2; // Tuesday

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const weekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventForDay = (day: number | null) => {
    if (day === weddingDay) return wedding;
    if (showReception && day === receptionDay) return reception;
    return null;
  };

  const activeEvent = getEventForDay(selectedDay);

  return (
    <section id="calendar" className="py-16 sm:py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E121E] font-semibold block mb-2">
          Save the Auspicious Dates
        </span>
        <h2 className="font-serif-cormorant font-bold text-3xl sm:text-4xl lg:text-5xl text-[#5E121E]">
          Wedding Calendar
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B89352] to-transparent mx-auto mt-3" />
        <p className="text-xs sm:text-sm text-[#58333B] max-w-md mx-auto mt-2 italic font-serif-cormorant">
          Mark your calendar for the sacred ceremony and celebration
        </p>
      </div>

      <div className="stationery-card stationery-card-inset rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-xl border-[1.5px] border-[#5E121E] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Calendar Grid Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E8DFC8]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#5E121E]" />
                <h3 className="font-serif-cormorant font-bold text-xl sm:text-2xl text-[#381A20]">
                  {data.calendar.monthYear}
                </h3>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#5E121E] border border-[#5E121E]/30">
                Auspicious Vivaha
              </span>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekHeaders.map((day) => (
                <div
                  key={day}
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5E121E] py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-10 sm:h-11" />;
                }

                const isWedding = day === weddingDay;
                const isReception = showReception && day === receptionDay;
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`h-10 sm:h-11 rounded-lg flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer font-medium text-xs sm:text-sm ${
                      isWedding
                        ? 'bg-[#5E121E] text-white shadow-xs scale-102 z-10 font-bold ring-2 ring-amber-300/60'
                        : isReception
                        ? 'bg-[#8C6B13] text-white shadow-xs scale-102 z-10 font-bold ring-2 ring-amber-300/60'
                        : isSelected
                        ? 'border border-[#5E121E] bg-[#FAF6F0] text-[#5E121E] font-bold'
                        : 'hover:bg-[#FAF6F0] text-[#381A20] border border-transparent'
                    }`}
                  >
                    <span>{day}</span>
                    {isWedding && (
                      <span className="text-[7px] uppercase tracking-tighter text-amber-200 font-bold leading-none mt-0.5">
                        Vivaha
                      </span>
                    )}
                    {isReception && (
                      <span className="text-[7px] uppercase tracking-tighter text-amber-100 font-bold leading-none mt-0.5">
                        Banquet
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-[#E8DFC8] text-xs text-[#58333B]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5E121E] inline-block" />
                <span className="font-serif-cormorant font-semibold text-sm text-[#5E121E]">Wedding Ceremony (Dec 5)</span>
              </div>
              {showReception && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6B13] inline-block" />
                  <span className="font-serif-cormorant font-semibold text-sm text-[#8C6B13]">Reception Party (Dec 6)</span>
                </div>
              )}
            </div>
          </div>

          {/* Event Details Panel with Burgundy Accent */}
          <div className="lg:col-span-5 bg-[#FAF6F0] rounded-xl p-5 sm:p-6 border border-[#5E121E]/30 flex flex-col justify-between">
            {activeEvent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-[0.2em] text-white ${
                      activeEvent.id === 'wedding' ? 'bg-[#5E121E]' : 'bg-[#8C6B13]'
                    }`}
                  >
                    {activeEvent.id === 'wedding' ? 'Wedding Ceremony' : 'Reception Party'}
                  </span>
                  <span className="text-xs text-[#5E121E] font-semibold">
                    Dec {selectedDay}, 2026
                  </span>
                </div>

                <h4 className="font-serif-cormorant font-bold text-2xl text-[#381A20] leading-tight">
                  {activeEvent.title}
                </h4>

                <p className="text-xs text-[#58333B] leading-relaxed italic font-serif-cormorant">
                  "{activeEvent.description}"
                </p>

                <div className="space-y-2.5 pt-2 text-xs text-[#381A20]">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-[#5E121E] shrink-0 mt-0.5" />
                    <span>{activeEvent.time}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#5E121E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#381A20] block">{activeEvent.venue}</span>
                      <span className="text-[#58333B] text-[11px]">{activeEvent.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() =>
                      downloadIcsFile(
                        `${activeEvent.title} - ${data.hero.groomName} & ${data.hero.brideName}`,
                        activeEvent.description,
                        `${activeEvent.venue}, ${activeEvent.address}`,
                        activeEvent.date,
                        activeEvent.time
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5E121E] hover:bg-[#4E0B14] text-white text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-200 shadow-xs cursor-pointer active:scale-98"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-amber-200" />
                    <span>Add Dec {selectedDay} to Calendar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#5E121E] flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-[#B89352]" />
                <p className="text-xs uppercase tracking-[0.2em] font-bold">
                  Dec {selectedDay}
                </p>
                <p className="text-[11px] text-[#58333B] italic font-serif-cormorant">
                  Select Dec 5 or Dec 6 to view event details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
