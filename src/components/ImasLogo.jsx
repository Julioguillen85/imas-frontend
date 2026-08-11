import React from 'react';

/**
 * Componente de Logo Oficial IMAS AGENCIA ADUANAL
 * Réplica vectorial de alta precisión del logotipo de la marca.
 */
export default function ImasLogo({
  size = 'md',
  showSubtitle = true,
  variant = 'pink', // 'pink', 'dark', 'white'
  className = ''
}) {
  // Ajuste de tamaños
  const sizeMap = {
    sm: { svgHeight: 'h-6 sm:h-7', px: 'px-3 py-1', text: 'text-[9px] sm:text-[10px]' },
    md: { svgHeight: 'h-8 sm:h-10', px: 'px-4.5 py-1.5', text: 'text-xs sm:text-sm' },
    lg: { svgHeight: 'h-12 sm:h-16', px: 'px-7 py-3', text: 'text-lg sm:text-2xl' },
    hero: { svgHeight: 'h-16 sm:h-24 md:h-32', px: 'px-8 sm:px-12 py-3 sm:py-5', text: 'text-2xl sm:text-4xl md:text-5xl' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const bgStyles = {
    pink: 'bg-[#E52E71] text-white shadow-lg shadow-[#E52E71]/30',
    dark: 'bg-slate-950 text-white shadow-xl shadow-black/50 border border-slate-800',
    white: 'bg-white text-slate-950 shadow-xl'
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* CONTENEDOR REDONDEADO PRINCIPAL IMAS */}
      <div
        className={`${bgStyles[variant]} ${currentSize.px} rounded-2xl flex items-center justify-center transition-transform hover:scale-[1.02]`}
      >
        <svg
          viewBox="0 0 540 160"
          className={`${currentSize.svgHeight} w-auto fill-current`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* LETRA I */}
          <path d="M 25 15 L 55 15 C 65 15 72 22 72 32 L 72 128 C 72 138 65 145 55 145 L 25 145 C 15 145 8 138 8 128 L 8 32 C 8 22 15 15 25 15 Z M 48 85 C 48 98 56 108 68 112 L 72 113 L 72 85 Z" />

          {/* LETRA M */}
          <path d="M 85 15 L 125 15 C 135 15 142 22 148 34 L 175 88 L 202 34 C 208 22 215 15 225 15 L 265 15 C 275 15 282 22 282 32 L 282 128 C 282 138 275 145 265 145 L 235 145 C 225 145 218 138 218 128 L 218 80 L 195 125 C 188 138 178 138 171 125 L 148 80 L 148 128 C 148 138 141 145 131 145 L 101 145 C 91 145 84 138 84 128 L 84 32 C 84 22 91 15 101 15 Z" />

          {/* LETRA A */}
          <path d="M 330 15 L 370 15 C 385 15 396 24 402 38 L 435 125 C 438 135 432 145 420 145 L 390 145 C 382 145 375 140 372 131 L 362 105 L 338 105 L 328 131 C 325 140 318 145 310 145 L 280 145 C 268 145 262 135 265 125 L 298 38 C 304 24 315 15 330 15 Z M 350 50 L 342 75 L 358 75 Z" />

          {/* LETRA S */}
          <path d="M 465 15 L 515 15 C 528 15 536 24 536 36 L 536 55 C 536 65 528 72 515 72 L 475 72 C 470 72 466 75 466 80 L 466 84 C 466 89 470 92 475 92 L 515 92 C 528 92 536 100 536 112 L 536 128 C 536 138 528 145 515 145 L 465 145 C 452 145 444 138 444 128 L 444 105 C 444 95 452 88 465 88 L 505 88 C 510 88 514 85 514 80 L 514 76 C 514 71 510 68 505 68 L 465 68 C 452 68 444 60 444 48 L 444 32 C 444 22 452 15 465 15 Z" />
        </svg>
      </div>

      {/* TEXTO INFERIOR "AGENCIA ADUANAL" */}
      {showSubtitle && (
        <span className={`font-bold tracking-[0.25em] text-white uppercase mt-1.5 drop-shadow-md ${currentSize.text}`}>
          AGENCIA ADUANAL
        </span>
      )}
    </div>
  );
}
