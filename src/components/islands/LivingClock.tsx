import { useState, useEffect } from 'react';
import { getMoonPhaseForDate, getZodiacSign } from '../../lib/celestial';

function romanize(num: number): string {
  const romans: Record<number, string> = { 1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII' };
  return romans[num] || String(num);
}

export default function LivingClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  const now = new Date();
  const moon = getMoonPhaseForDate(now);
  const zodiac = getZodiacSign(now);

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  const hourDeg = (h % 12) * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;
  const pendulumDeg = Math.sin(Date.now() / 600) * 12;

  if (!mounted) {
    return (
      <div className="flex justify-center py-2">
        <div style={{width: 110, height: 110, borderRadius: '50%', border: '3px solid #4a3520', background: 'linear-gradient(145deg, #3e2b18, #2a1c0e)'}} />
      </div>
    );
  }

  const half = 55;

  return (
    <div className="flex flex-col items-center py-1">
      <div className="relative" style={{width: 110, height: 110}}>
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 40% 35%, #4a3520 0%, #362514 40%, #1f140a 100%)',
          border: '3px solid #8a6828',
          boxShadow: '0 3px 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.05)',
        }} />
        {/* Inner brass ring */}
        <div className="absolute rounded-full" style={{inset: 6, border: '1px solid rgba(201,169,110,0.4)', background: 'radial-gradient(circle at 35% 30%, #2a1c0e 0%, #1a0f06 70%)'}} />

        {/* Roman numerals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const num = i + 1;
          const angle = num * 30;
          const isMajor = num % 3 === 0;
          const dist = half - 12;
          const rad = (angle - 90) * (Math.PI / 180);
          const x = half + Math.cos(rad) * dist;
          const y = half + Math.sin(rad) * dist;
          return (
            <span key={num} style={{position:'absolute', left:x, top:y, transform:'translate(-50%,-50%)', fontSize: isMajor ? 8 : 0, fontFamily:"'Cormorant Garamond', Georgia, serif", color: 'rgba(240,230,210,0.75)', fontWeight: 600}}>
              {romanize(num)}
            </span>
          );
        })}

        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = i * 6;
          const major = i % 5 === 0;
          return (
            <div key={i} className="absolute left-1/2 top-0" style={{
              width: major ? 1.5 : 0.5, height: major ? 5 : 2,
              background: major ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.15)',
              transformOrigin: '0 47px', transform: `rotate(${angle}deg) translateX(-50%)`, marginTop: 8,
            }} />
          );
        })}

        {/* Moon at XII */}
        <div className="absolute text-center" style={{top: 18, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'rgba(201,169,110,0.5)'}}>
          {moon.emoji}
        </div>

        {/* Hour hand */}
        <div className="absolute" style={{width: 2.5, height: 26, background: 'linear-gradient(to bottom, #c9a96e, #8a6828)', left: '50%', top: '50%', marginLeft: -1.25, marginTop: -26, transformOrigin: '50% 100%', transform: `rotate(${hourDeg}deg)`, borderRadius: '2px 2px 0 0'}} />
        {/* Minute hand */}
        <div className="absolute" style={{width: 1.5, height: 36, background: 'linear-gradient(to bottom, #dcc088, #a08050)', left: '50%', top: '50%', marginLeft: -0.75, marginTop: -36, transformOrigin: '50% 100%', transform: `rotate(${minuteDeg}deg)`, borderRadius: '1px 1px 0 0'}} />
        {/* Second hand */}
        <div className="absolute" style={{width: 0.5, height: 40, background: '#b07078', left: '50%', top: '50%', marginLeft: -0.25, marginTop: -40, transformOrigin: '50% 100%', transform: `rotate(${secondDeg}deg)`}} />

        {/* Center cap */}
        <div className="absolute rounded-full" style={{width: 7, height: 7, background: 'radial-gradient(circle at 30% 30%, #e0c890, #a08040)', border: '1px solid #6a5020', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)'}} />
      </div>

      {/* Pendulum */}
      <div className="relative" style={{width: 10, height: 34, marginTop: -2}}>
        <div className="absolute top-0 left-1/2" style={{width: 1, height: 22, background: 'linear-gradient(to bottom, #8a6828, #4a3520)', transformOrigin: '50% 0%', transform: `translateX(-50%) rotate(${pendulumDeg}deg)`}} />
        <div className="absolute rounded-full" style={{width: 8, height: 8, background: 'radial-gradient(circle at 35% 30%, #d4b868, #8a6828)', border: '1px solid #4a3520', left: '50%', top: 20, transform: `translateX(-50%) rotate(${pendulumDeg}deg)`, transformOrigin: '-50% -22px', boxShadow: '0 2px 4px rgba(0,0,0,0.4)'}} />
      </div>

      {/* Moon + Zodiac strip */}
      <div className="flex items-center justify-center gap-2 mt-2 text-[9px] font-typewriter" style={{color: 'rgba(201,169,110,0.55)', letterSpacing: '0.1em'}}>
        <span>{moon.emoji}</span>
        <span>{moon.name}</span>
        <span style={{opacity: 0.3}}>·</span>
        <span>{zodiac.symbol}</span>
        <span>{zodiac.name}</span>
      </div>
    </div>
  );
}

