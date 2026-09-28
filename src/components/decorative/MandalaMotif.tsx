import React from 'react';

interface MandalaProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export const MandalaMotif: React.FC<MandalaProps> = ({
  className = '',
  size = 180,
  opacity = 0.85,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {/* Outer decorative ring */}
      <circle cx="100" cy="100" r="92" stroke="var(--primary-gold)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="86" stroke="var(--primary-gold)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="80" stroke="var(--primary-red)" strokeWidth="0.75" />

      {/* 8-Petal Outer Lotus */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <path
            d="M100 20 C108 40, 120 55, 100 75 C80 55, 92 40, 100 20 Z"
            fill="var(--primary-gold)"
            fillOpacity="0.12"
            stroke="var(--primary-gold)"
            strokeWidth="1.2"
          />
          <circle cx="100" cy="30" r="2.5" fill="var(--primary-red)" />
          <path
            d="M100 35 Q100 55 100 65"
            stroke="var(--primary-gold)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* 16 Middle Radiating Petals */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
        (angle, i) => (
          <g key={i} transform={`rotate(${angle} 100 100)`}>
            <circle cx="100" cy="50" r="2" fill="var(--primary-gold)" />
          </g>
        )
      )}

      {/* Middle floral ring */}
      <circle cx="100" cy="100" r="48" stroke="var(--primary-gold)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="42" stroke="var(--primary-red)" strokeWidth="1" strokeDasharray="2 2" />

      {/* Inner 8 Petals */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <path
            d="M100 58 C105 70, 112 80, 100 90 C88 80, 95 70, 100 58 Z"
            fill="var(--primary-red)"
            fillOpacity="0.1"
            stroke="var(--primary-red)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Center Bindu and Floral Core */}
      <circle cx="100" cy="100" r="22" fill="var(--primary-gold)" fillOpacity="0.15" stroke="var(--primary-gold)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="14" fill="var(--primary-red)" fillOpacity="0.2" stroke="var(--primary-red)" strokeWidth="1" />
      <circle cx="100" cy="100" r="6" fill="var(--primary-gold)" />
      <circle cx="100" cy="100" r="2.5" fill="#FFFFFF" />
    </svg>
  );
};
