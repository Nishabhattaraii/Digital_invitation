import React from 'react';

interface BurgundyFloralCornerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number; // size on desktop, automatically scaled down on mobile
  withWash?: boolean;
}

/**
 * BurgundyFloralCorner
 * Restrained, aesthetic vintage botanical corner illustration of deep burgundy roses,
 * wine-tinted petals, and muted foliage.
 * Uses true transparent 32-bit PNG with un-multiplied alpha and zero rectangular boundaries,
 * appearing printed directly onto the invitation paper.
 */
export const BurgundyFloralCorner: React.FC<BurgundyFloralCornerProps> = ({
  position = 'top-left',
  className = '',
  size = 140,
  withWash = true,
}) => {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');

  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return 'none';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return '-top-3 -right-3 sm:-top-5 sm:-right-5';
      case 'bottom-left':
        return '-bottom-3 -left-3 sm:-bottom-5 sm:-left-5';
      case 'bottom-right':
        return '-bottom-3 -right-3 sm:-bottom-5 sm:-right-5';
      default:
        return '-top-3 -left-3 sm:-top-5 sm:-left-5';
    }
  };

  // Mask origin point for smooth tonal fade along outer edges
  const getMaskStyle = (): React.CSSProperties => {
    const origin = `${isLeft ? '0%' : '100%'} ${isTop ? '0%' : '100%'}`;
    const maskValue = `radial-gradient(circle at ${origin}, black 75%, rgba(0, 0, 0, 0.85) 88%, transparent 100%)`;
    return {
      maskImage: maskValue,
      WebkitMaskImage: maskValue,
    };
  };

  const mobileSize = Math.round(size * 0.72); // Scaled on mobile for optimal text clearance

  return (
    <div
      className={`absolute pointer-events-none select-none z-20 ${getPositionClasses()} ${className}`}
      aria-hidden="true"
    >
      {/* Soft watercolor wine/burgundy wash blooming organically from the corner */}
      {withWash && (
        <div
          className="absolute -z-10 rounded-full blur-xl pointer-events-none transition-opacity duration-300"
          style={{
            width: `${size * 1.25}px`,
            height: `${size * 1.25}px`,
            top: isTop ? '-15%' : 'auto',
            bottom: !isTop ? '-15%' : 'auto',
            left: isLeft ? '-15%' : 'auto',
            right: !isLeft ? '-15%' : 'auto',
            background:
              'radial-gradient(circle at 30% 30%, rgba(94, 18, 30, 0.42) 0%, rgba(122, 28, 43, 0.22) 42%, rgba(156, 52, 70, 0.08) 68%, transparent 85%)',
          }}
        />
      )}

      {/* Transparent Floral Arrangement (No square clipping, natural painted stationery feel) */}
      <div
        className="relative transition-all duration-300"
        style={{
          width: `var(--corner-size, ${size}px)`,
          height: `var(--corner-size, ${size}px)`,
          transform: getTransform(),
          ...getMaskStyle(),
        }}
      >
        <style>{`
          @media (max-width: 640px) {
            :root {
              --corner-size: ${mobileSize}px;
            }
          }
        `}</style>
        <img
          src="/images/botanical/burgundy-corner-transparent.png"
          alt="Vintage burgundy botanical floral corner"
          className="w-full h-full object-contain filter contrast-[1.04] brightness-[0.98] drop-shadow-[0_2px_10px_rgba(94,18,30,0.18)]"
          loading="lazy"
        />
      </div>
    </div>
  );
};

/**
 * BotanicalMonogramWreath
 * Delicate gold laurel circular wreath with initials, matching top center of reference photo.
 */
export const BotanicalMonogramWreath: React.FC<{
  initials?: string;
  size?: number;
  className?: string;
  light?: boolean;
}> = ({ initials = 'S P', size = 80, className = '', light = false }) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`relative rounded-full flex items-center justify-center p-3 border ${
          light
            ? 'border-[#D4AF37]/70 bg-[#4E0B14] shadow-inner'
            : 'border-[#B89352]/60 bg-transparent'
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {/* Subtle decorative laurel SVG ring */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 w-full h-full ${
            light ? 'text-[#D4AF37] opacity-80' : 'text-[#B89352] opacity-75'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="50" cy="50" r="44" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 22 50 C 22 34, 34 22, 50 22 C 46 28, 46 36, 42 42 C 36 44, 28 46, 22 50 Z" fill="currentColor" opacity="0.4" />
          <path d="M 78 50 C 78 34, 66 22, 50 22 C 54 28, 54 36, 58 42 C 64 44, 72 46, 78 50 Z" fill="currentColor" opacity="0.4" />
          <path d="M 22 50 C 22 66, 34 78, 50 78 C 46 72, 46 64, 42 58 C 36 56, 28 54, 22 50 Z" fill="currentColor" opacity="0.4" />
          <path d="M 78 50 C 78 66, 66 78, 50 78 C 54 72, 54 64, 58 58 C 64 56, 72 54, 78 50 Z" fill="currentColor" opacity="0.4" />
        </svg>

        <span
          className={`font-serif-cormorant font-normal text-xl sm:text-2xl tracking-widest relative z-10 ${
            light ? 'text-[#FAF6F0]' : 'text-[#5E121E]'
          }`}
        >
          {initials}
        </span>
      </div>

      {/* Tiny gold motif underneath like reference image */}
      <div className="flex items-center gap-1.5 mt-1.5 opacity-70">
        <span className="w-3 h-[0.5px] bg-[#B89352]" />
        <span className="text-[10px] text-[#B89352]">❦</span>
        <span className="w-3 h-[0.5px] bg-[#B89352]" />
      </div>
    </div>
  );
};

/**
 * BurgundyFloralSideSpray
 * Vertical botanical spray of burgundy roses and foliage for edges and bottom corners,
 * matching the user's reference image where foliage climbs along the right border.
 */
export const BurgundyFloralSideSpray: React.FC<{
  position?: 'bottom-right' | 'bottom-left' | 'right' | 'left';
  className?: string;
  width?: number;
  height?: number;
  withWash?: boolean;
}> = ({
  position = 'bottom-right',
  className = '',
  width = 130,
  height = 190,
  withWash = true,
}) => {
  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return '-bottom-4 -right-4 sm:-bottom-6 sm:-right-6';
      case 'bottom-left':
        return '-bottom-4 -left-4 sm:-bottom-6 sm:-left-6';
      case 'left':
        return 'top-1/2 -translate-y-1/2 -left-4 sm:-left-6';
      default:
        return 'top-1/2 -translate-y-1/2 -right-4 sm:-right-6';
    }
  };

  const mobileWidth = Math.round(width * 0.72);
  const mobileHeight = Math.round(height * 0.72);

  return (
    <div
      className={`absolute pointer-events-none select-none z-20 ${getPositionClasses()} ${className}`}
      aria-hidden="true"
    >
      {withWash && (
        <div
          className="absolute -z-10 rounded-full blur-xl pointer-events-none"
          style={{
            width: `${width * 1.2}px`,
            height: `${height * 0.9}px`,
            bottom: isBottom ? '-10%' : 'auto',
            right: isRight ? '-10%' : 'auto',
            background:
              'radial-gradient(circle at 70% 70%, rgba(94, 18, 30, 0.45) 0%, rgba(122, 28, 43, 0.22) 45%, rgba(156, 52, 70, 0.08) 70%, transparent 85%)',
          }}
        />
      )}

      <div
        className="relative transition-all duration-300"
        style={{
          width: `var(--spray-w, ${width}px)`,
          height: `var(--spray-h, ${height}px)`,
          transform: isRight ? 'none' : 'scaleX(-1)',
        }}
      >
        <style>{`
          @media (max-width: 640px) {
            :root {
              --spray-w: ${mobileWidth}px;
              --spray-h: ${mobileHeight}px;
            }
          }
        `}</style>
        <img
          src="/images/botanical/burgundy-side-spray-transparent.png"
          alt="Climbing burgundy botanical spray"
          className="w-full h-full object-contain filter contrast-[1.04] brightness-[0.98] drop-shadow-[0_2px_10px_rgba(94,18,30,0.18)]"
          loading="lazy"
        />
      </div>
    </div>
  );
};

