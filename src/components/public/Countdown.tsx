import React, { useState, useEffect, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Heart } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC = () => {
  const { data } = useWedding();
  const targetDateStr = data.countdown.targetDate || '2026-12-05T09:00:00';

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
  }, [targetDateStr]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E121E] font-semibold block mb-2">
          An Auspicious Milestone
        </span>
        <h2 className="font-serif-cormorant font-bold text-3xl sm:text-4xl lg:text-5xl text-[#5E121E] mb-2">
          {data.countdown.title}
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B89352] to-transparent mx-auto mt-3 mb-8" />

        {/* Minimalist Stationery Card Frame with Burgundy Border */}
        <div className="p-7 sm:p-10 rounded-2xl bg-white border-[1.5px] border-[#5E121E] shadow-xl relative overflow-hidden stationery-card stationery-card-inset">
          {timeLeft.isPast ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-full bg-[#F9ECEE] border border-[#5E121E] flex items-center justify-center text-[#5E121E] shadow-xs">
                <Heart className="w-6 h-6 fill-[#5E121E]" />
              </div>
              <p className="font-serif-cormorant font-bold text-2xl sm:text-3xl text-[#5E121E]">
                The Sacred Union Has Begun
              </p>
              <p className="text-xs sm:text-sm text-[#58333B] max-w-md italic font-serif-cormorant">
                Blessings to Dr. Siddhartha and Dr. Prashamsa on this auspicious day.
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {units.map((unit) => (
                  <div
                    key={unit.label}
                    className="p-5 sm:p-7 rounded-xl bg-[#FAF6F0] border border-[#5E121E]/30 flex flex-col items-center justify-center shadow-xs"
                  >
                    <span className="font-serif-cormorant font-bold text-3xl sm:text-5xl lg:text-6xl text-[#5E121E] tabular-nums">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#5E121E] font-semibold mt-2">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#58333B] italic font-serif-cormorant">
                <span>Counting every sacred moment until the auspicious hour</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
