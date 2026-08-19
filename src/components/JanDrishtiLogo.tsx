import React from 'react';

interface JanDrishtiLogoProps {
  variant?: 'full' | 'compact' | 'icon-only' | 'hero' | 'header';
  theme?: 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const JanDrishtiLogo: React.FC<JanDrishtiLogoProps> = ({
  variant = 'compact',
  theme = 'dark',
  className = '',
  size = 'md'
}) => {
  const isDark = theme === 'dark';

  // Precision Vector Emblem matching the provided logo
  const LogoMark = ({ iconSize = 44 }: { iconSize?: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      {/* 1. Green Leaf Accent at the tail of the road */}
      <g id="leaf-accent">
        <path
          d="M28 118 C26 142 42 165 68 174 C48 162 38 145 38 126 C38 114 44 108 52 104 C36 102 29 108 28 118 Z"
          fill="#058C42"
        />
        <path
          d="M32 132 C34 152 50 170 74 178 C56 170 46 155 46 138 C46 128 50 122 56 118 C44 118 36 122 32 132 Z"
          fill="#0D6E38"
        />
      </g>

      {/* 2. Stylized "J" Roadway Shape in Deep Navy */}
      <path
        d="M58 84 H176 V140 C176 182 144 206 102 206 C60 206 32 178 32 138 C32 122 42 112 56 112 C70 112 80 122 80 138 C80 152 90 162 102 162 C116 162 128 152 128 138 V128 H176 V84 Z"
        fill="#0F1E36"
      />

      {/* Road curvature inner boundary */}
      <path
        d="M176 84 H58 V128 H128 V138 C128 152 116 162 102 162 C90 162 80 152 80 138 C80 122 70 112 56 112 C42 112 32 122 32 138 C32 178 60 206 102 206 C144 206 176 182 176 140 V84 Z"
        fill="#0F1E36"
      />

      {/* 3. Road Lane Dashes (White dashed centerline along the J curve) */}
      <path
        d="M152 96 V138 C152 165 130 184 102 184 C76 184 56 168 54 146"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 10"
      />

      {/* 4. Saffron/Orange Location Pin with Drishti Eye */}
      <g id="location-pin" transform="translate(86, 92)">
        {/* Pin Outer Drop Shape */}
        <path
          d="M0 -36 C22 -36 38 -18 38 4 C38 28 0 66 0 66 C0 66 -38 28 -38 4 C-38 -18 -22 -36 0 -36 Z"
          fill="#F35B16"
        />

        {/* Pin Inner Eye Lens (White background circle) */}
        <circle cx="0" cy="4" r="19" fill="#FFFFFF" />

        {/* Eye Pupil in Navy */}
        <circle cx="0" cy="4" r="12" fill="#0F1E36" />

        {/* Eye Catchlight / Reflection */}
        <circle cx="3.5" cy="0.5" r="4" fill="#FFFFFF" />
        <circle cx="-2" cy="7" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );

  // Icon only
  if (variant === 'icon-only') {
    const iconDim = size === 'sm' ? 36 : size === 'md' ? 52 : size === 'lg' ? 72 : 96;
    return <LogoMark iconSize={iconDim} />;
  }

  // Hero Presentation Card (Matches exact official logo card in prompt)
  if (variant === 'hero') {
    return (
      <div className={`inline-flex items-center bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200 ${className}`}>
        <LogoMark iconSize={size === 'xl' ? 76 : 64} />
        <div className="h-12 w-px bg-slate-300 mx-3 sm:mx-4" />
        <div className="flex flex-col justify-center">
          <div className="flex items-center leading-none">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F1E36] font-sans">
              Jan<span className="text-[#F35B16]">Drishti</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-black tracking-widest text-[#0F1E36] uppercase mt-1">
            MAKING BHARAT BETTER.
          </p>
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#F35B16]">
            One Step Towards Revolution • One Civic Issue at a Time.
          </p>
        </div>
      </div>
    );
  }

  // Compact Header / Navbar Logo
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 ${className}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
        <LogoMark iconSize={38} />
      </div>
      
      <div className="h-7 w-px bg-slate-700/80 hidden sm:block" />

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F1E36]'}`}>
            Jan<span className="text-[#F35B16]">Drishti</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
            जनदृष्टि
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] tracking-wider leading-none">
          <span className={`font-extrabold uppercase ${isDark ? 'text-slate-200' : 'text-[#0F1E36]'}`}>
            MAKING BHARAT BETTER.
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-amber-400 font-semibold hidden md:inline">
            One Step Towards Revolution
          </span>
        </div>
      </div>
    </div>
  );
};
