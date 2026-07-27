import { useState, useEffect } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getCardForDate } from '../../lib/oracle';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey } from '../../lib/utils';

export default function OracleMini() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { oracleQuotes, addOracleQuote } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const today = todayKey();
  const stored = oracleQuotes[today];
  const moon = getMoonPhaseForDate(new Date());

  const handleReveal = () => {
    if (!stored) {
      const card = getCardForDate(today);
      addOracleQuote(today, card.quote, card.source);
    }
    setRevealed(true);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealed(false);
  };

  const card = oracleQuotes[today] || getCardForDate(today);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="w-5 h-5 border-2 border-[#c9a96e]/60 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-2">
      <div className="relative" style={{ perspective: '900px' }}>
        <div
          className="relative transition-transform duration-700 cursor-pointer select-none"
          style={{
            width: '148px',
            height: '250px',
            transformStyle: 'preserve-3d',
            transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={handleReveal}
        >
          {/* === FRONT: Card back === */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-between py-5"
            style={{
              backfaceVisibility: 'hidden',
              borderRadius: '10px',
              background: 'linear-gradient(165deg, #1a2e22 0%, #14241b 40%, #0d1a13 100%)',
              border: '2px solid rgba(196,176,110,0.50)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 30px rgba(196,176,110,0.10), inset 0 0 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Top corner number */}
            <div className="w-full px-3 flex justify-between">
              <span style={{fontSize: '9px', color: 'rgba(196,176,110,0.75)', fontFamily: "'Special Elite', monospace"}}>I</span>
              <span style={{fontSize: '9px', color: 'rgba(196,176,110,0.75)', fontFamily: "'Special Elite', monospace"}}>✦</span>
            </div>

            {/* Center ornament */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative" style={{width: 48, height: 48}}>
                <div className="absolute inset-0 rounded-full border border-[#c9a96e]/32" />
                <div className="absolute inset-2 rounded-full border border-[#c9a96e]/20" />
                <div className="absolute inset-4 rounded-full border border-dashed border-[#c9a96e]/24" />
<div className="absolute inset-0 flex items-center justify-center text-[#c9a96e]/75 text-2xl" style={{filter: "drop-shadow(0 0 6px rgba(201,169,110,0.3))"}}>☾</div>
              </div>
              <span style={{fontSize: '7px', color: 'rgba(196,176,110,0.58)', fontFamily: "'Special Elite', monospace", letterSpacing: '0.4em', textTransform: 'uppercase'}}>
                The Oracle
              </span>
            </div>

            {/* Bottom label */}
            <div className="flex flex-col items-center gap-1">
              <div style={{width: 40, height: 1, background: 'rgba(196,176,110,0.28)'}} />
              <span style={{fontSize: '7px', color: 'rgba(196,176,110,0.50)', fontFamily: "'Special Elite', monospace", letterSpacing: '0.2em'}}>
                {moon.emoji} {moon.name}
              </span>
            </div>
          </div>

          {/* === BACK: Quote revealed === */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-between py-4 px-3"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '10px',
              background: 'linear-gradient(170deg, #f5efe3 0%, #e8dcc8 50%, #f0e6d2 100%)',
              border: '2px solid rgba(180,160,130,0.6)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 0 30px rgba(180,155,120,0.15)',
            }}
          >
            {/* Top header */}
            <div className="w-full text-center">
              <span style={{fontSize: '8px', color: '#6a5440', fontFamily: "'Special Elite', monospace", letterSpacing: '0.3em', textTransform: 'uppercase'}}>
                Whisper
              </span>
            </div>

            {/* Quote area */}
            <div className="flex-1 flex items-center justify-center w-full">
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '12px',
                fontStyle: 'italic',
                lineHeight: 1.5,
                color: '#3a2e1e',
                textAlign: 'center',
              }}>
                &ldquo;{card.quote}&rdquo;
              </p>
            </div>

            {/* Divider & source */}
            <div className="w-full flex flex-col items-center gap-1.5">
              <div style={{width: 24, height: 1, background: '#c9a96e'}} />
              <span style={{fontSize: '8px', color: '#8a6a4a', fontFamily: "'Special Elite', monospace", letterSpacing: '0.15em'}}>
                {card.source}
              </span>
              <button
                onClick={handleReset}
                style={{fontSize: '7px', color: '#b0a090', fontFamily: "'Special Elite', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', background: 'none', cursor: 'pointer', padding: 0}}
                className="hover:text-[#6a5440] transition-colors"
              >
                return card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
