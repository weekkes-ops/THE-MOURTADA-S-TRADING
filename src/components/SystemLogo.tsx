import React from 'react';

interface SystemLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
}

export const SystemLogo: React.FC<SystemLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  let dimension = 48;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm':
        dimension = 32;
        break;
      case 'md':
        dimension = 48;
        break;
      case 'lg':
        dimension = 64;
        break;
      case 'xl':
        dimension = 84;
        break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* High-definition SVG of The Mourtada's Trading Official Emblem */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none drop-shadow-xs"
        aria-label="The Mourtada's Trading Logo"
      >
        {/* Outer Circular Blue Ring Border */}
        <circle cx="100" cy="100" r="94" stroke="#00A3E0" strokeWidth="9" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="88" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />

        {/* Laurel Wreath Left Side (Dark Charcoal Leaves) */}
        <g fill="#1E293B">
          {/* Bottom tie / leaves */}
          <path d="M 92 174 C 84 172 76 166 72 160 C 76 156 86 160 92 174 Z" />
          <path d="M 108 174 C 116 172 124 166 128 160 C 124 156 114 160 108 174 Z" />
          
          {/* Left Branch Leaves - curving upwards */}
          <path d="M 68 165 C 55 160 48 149 45 139 C 53 140 62 148 68 165 Z" />
          <path d="M 52 148 C 40 142 35 130 33 118 C 42 120 49 130 52 148 Z" />
          <path d="M 40 128 C 30 119 27 106 28 94 C 36 98 40 110 40 128 Z" />
          <path d="M 35 106 C 27 95 27 82 30 70 C 37 76 40 89 35 106 Z" />
          <path d="M 37 84 C 32 72 35 59 42 48 C 47 56 47 69 37 84 Z" />
          <path d="M 46 63 C 43 51 50 39 60 30 C 62 39 59 52 46 63 Z" />
          <path d="M 61 46 C 61 35 71 25 83 20 C 82 30 75 41 61 46 Z" />

          {/* Left Branch Inner Folia */}
          <path d="M 75 152 C 65 146 60 134 60 124 C 69 127 75 138 75 152 Z" />
          <path d="M 58 132 C 50 123 48 110 52 100 C 60 105 62 118 58 132 Z" />
          <path d="M 50 110 C 44 99 46 86 52 76 C 59 83 58 96 50 110 Z" />
          <path d="M 49 88 C 47 75 52 64 61 56 C 65 65 61 78 49 88 Z" />
          <path d="M 56 68 C 58 56 67 47 78 42 C 78 52 71 63 56 68 Z" />
        </g>

        {/* Laurel Wreath Right Side (Dark Charcoal Leaves) */}
        <g fill="#1E293B">
          {/* Right Branch Leaves - curving upwards */}
          <path d="M 132 165 C 145 160 152 149 155 139 C 147 140 138 148 132 165 Z" />
          <path d="M 148 148 C 160 142 165 130 167 118 C 158 120 151 130 148 148 Z" />
          <path d="M 160 128 C 170 119 173 106 172 94 C 164 98 160 110 160 128 Z" />
          <path d="M 165 106 C 173 95 173 82 170 70 C 163 76 160 89 165 106 Z" />
          <path d="M 163 84 C 168 72 165 59 158 48 C 153 56 153 69 163 84 Z" />
          <path d="M 154 63 C 157 51 150 39 140 30 C 138 39 141 52 154 63 Z" />
          <path d="M 139 46 C 139 35 129 25 117 20 C 118 30 125 41 139 46 Z" />

          {/* Right Branch Inner Folia */}
          <path d="M 125 152 C 135 146 140 134 140 124 C 131 127 125 138 125 152 Z" />
          <path d="M 142 132 C 150 123 152 110 148 100 C 140 105 138 118 142 132 Z" />
          <path d="M 150 110 C 156 99 154 86 148 76 C 141 83 142 96 150 110 Z" />
          <path d="M 151 88 C 153 75 148 64 139 56 C 135 65 139 78 151 88 Z" />
          <path d="M 144 68 C 142 56 133 47 122 42 C 122 52 129 63 144 68 Z" />
        </g>

        {/* Central Interlocking MT Monogram */}
        {/* Left 'T' portion in Sky Blue (#00A3E0) */}
        <g fill="#00A3E0">
          {/* Top Left Horizontal Bar */}
          <path d="M 64 64 L 118 64 L 118 78 L 92 78 L 92 136 L 80 136 L 80 78 L 64 78 Z" />
          {/* Left Vertical serif / pillar */}
          <path d="M 72 78 L 92 78 L 92 136 L 72 136 Z" />
          {/* Central Blue Triangle Chevron in M */}
          <path d="M 92 64 L 108 64 L 100 118 Z" />
        </g>

        {/* Right 'T' / 'M' portion in Dark Charcoal (#1E293B) */}
        <g fill="#1E293B">
          {/* Top Right Bar & Right Vertical Stem */}
          <path d="M 108 64 L 142 64 L 142 78 L 126 78 L 126 136 L 108 136 L 108 78 L 108 64 Z" />
          {/* Right vertical pillar */}
          <path d="M 112 78 L 132 78 L 132 136 L 112 136 Z" />
          {/* Right diagonal inner shade */}
          <path d="M 108 64 L 118 64 L 108 118 Z" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-sm md:text-base text-[#111827] uppercase tracking-tight font-sans">
            THE MOURTADA'S TRADING
          </span>
          <span className="text-[11px] text-[#2563EB] font-semibold uppercase">
            Produce Dealer • Bo City
          </span>
        </div>
      )}
    </div>
  );
};
