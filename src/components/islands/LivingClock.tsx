import { useState, useEffect } from 'react';
import { getMoonPhaseForDate, getZodiacSign } from '../../lib/celestial';

export default function LivingClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => { setMounted(true); const id = setInterval(()=>setTime(new Date()), 1000); return ()=>clearInterval(id); }, []);

  const now = new Date();
  const moon = getMoonPhaseForDate(now);
  const zodiac = getZodiacSign(now);
  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds();
  const hourDeg = (h%12)*30 + m*0.5;
  const minuteDeg = m*6 + s*0.1;
  const secondDeg = s*6;
  const pendulumAngle = Math.sin(Date.now()/700)*10;

  if(!mounted) return <div style={{width:180,height:240}}/>;

  return (
    <div className="flex flex-col items-center" style={{width:180}}>
      <svg viewBox="0 0 180 240" width="180" height="240" style={{filter:'drop-shadow(0 6px 16px rgba(0,0,0,0.6))'}}>
        <defs>
          {/* Carved wood frame gradient */}
          <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a2218" />
            <stop offset="40%" stopColor="#1e120c" />
            <stop offset="100%" stopColor="#0f0906" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6828" />
            <stop offset="50%" stopColor="#c9a96e" />
            <stop offset="100%" stopColor="#6a4a18" />
          </linearGradient>
          {/* Aged dial patina */}
          <radialGradient id="dialGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#d8d0c0" />
            <stop offset="50%" stopColor="#b8b0a0" />
            <stop offset="100%" stopColor="#706858" />
          </radialGradient>
          {/* Brass center */}
          <radialGradient id="brassGrad" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#e8d4a0" />
            <stop offset="40%" stopColor="#c9a96e" />
            <stop offset="100%" stopColor="#7a5a28" />
          </radialGradient>
          {/* Moon phase */}
          <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f0e8d8" />
            <stop offset="60%" stopColor="#c8c0b0" />
            <stop offset="100%" stopColor="#706858" />
          </radialGradient>
          <filter id="age">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="n"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="n" result="f"/>
            <feBlend in="SourceGraphic" in2="f" mode="multiply"/>
          </filter>
        </defs>

        {/* ═══ ORNATE ARCH FRAME ═══ */}
        {/* Outer carved wood */}
        <path d="M20 200 L20 80 Q20 20 90 18 Q160 20 160 80 L160 200 Q160 210 150 210 L30 210 Q20 210 20 200Z"
          fill="url(#woodGrad)" stroke="#5c3a20" strokeWidth="1.5" />
        {/* Inner gold trim */}
        <path d="M26 200 L26 82 Q26 26 90 24 Q154 26 154 82 L154 200 Q154 204 150 204 L30 204 Q26 204 26 200Z"
          fill="none" stroke="url(#goldTrim)" strokeWidth="2.5" />
        {/* Carved scrollwork — top arch */}
        <path d="M40 80 Q40 40 90 38 Q140 40 140 80" fill="none" stroke="#6a4a28" strokeWidth="1" opacity="0.5"/>
        <path d="M50 80 Q50 50 90 48 Q130 50 130 80" fill="none" stroke="#8a6828" strokeWidth="0.5" opacity="0.4"/>
        {/* Side pilasters */}
        <rect x="28" y="90" width="4" height="100" rx="2" fill="#2a1810" opacity="0.6"/>
        <rect x="148" y="90" width="4" height="100" rx="2" fill="#2a1810" opacity="0.6"/>

        {/* ═══ DIAL ═══ */}
        <circle cx="90" cy="100" r="56" fill="url(#dialGrad)" stroke="#5a4a38" strokeWidth="0.5" filter="url(#age)"/>
        {/* Inner brass ring */}
        <circle cx="90" cy="100" r="48" fill="none" stroke="url(#brassGrad)" strokeWidth="2.5" opacity="0.85"/>
        <circle cx="90" cy="100" r="44" fill="none" stroke="#5a4a38" strokeWidth="0.5" opacity="0.4"/>

        {/* ═══ ROMAN NUMERALS ═══ */}
        {[1,2,3,4,5,6,7,8,9,10,11,12].map((n,i)=>{
          const angle = (n*30-90)*Math.PI/180;
          const dist = n%3===0 ? 44 : 47;
          const x = 90 + Math.cos(angle)*dist;
          const y = 90 + Math.sin(angle)*dist + 10;
          const romans = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
          return (
            <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
              fill="#3a2e1e" fontSize={n%3===0 ? 8 : 6.5} fontFamily="'Cormorant Garamond', Garamond, serif"
              fontWeight={600} opacity={0.85} style={{fontStyle:'italic'}}>
              {romans[i]}
            </text>
          );
        })}

        {/* Tick marks */}
        {Array.from({length:60}).map((_,i)=>{
          const ang = i*6*Math.PI/180;
          const r1 = i%5===0 ? 52 : 54;
          const r2 = 56;
          return <line key={i} x1={90+Math.cos(ang)*r1} y1={100+Math.sin(ang)*r1}
            x2={90+Math.cos(ang)*r2} y2={100+Math.sin(ang)*r2}
            stroke={i%5===0 ? "#5a4a38" : "#8a8070"} strokeWidth={i%5===0 ? 1.2 : 0.4} opacity={0.6}/>;
        })}

        {/* Moon phase aperture at XII */}
        <circle cx="90" cy="54" r="10" fill="#1a1510" stroke="url(#goldTrim)" strokeWidth="1.5"/>
        <circle cx="90" cy="54" r="8" fill="url(#moonGrad)"/>
        {/* Moon shadow for phase */}
        <ellipse cx="86" cy="54" rx="6" ry="8" fill="#1a1510" opacity="0.35"/>
        <text x="90" y="54" textAnchor="middle" dominantBaseline="central" fontSize={7} fill="#4a4038">{moon.emoji}</text>

        {/* Subsidiary dials (decorative) */}
        <circle cx="122" cy="100" r="7" fill="url(#dialGrad)" stroke="#5a4a38" strokeWidth="0.5" opacity="0.5"/>
        <text x="122" y="100" textAnchor="middle" dominantBaseline="central" fontSize={5} fill="#5a4a38" opacity="0.6">{zodiac.symbol}</text>

        <circle cx="58" cy="100" r="7" fill="url(#dialGrad)" stroke="#5a4a38" strokeWidth="0.5" opacity="0.5"/>
        <text x="58" y="100" textAnchor="middle" dominantBaseline="central" fontSize={5} fill="#5a4a38" opacity="0.6" style={{fontStyle:'italic'}}>{new Date().getDate()}</text>

        {/* ═══ HANDS ═══ */}
        {/* Hour — ornate spade */}
        <g transform={`rotate(${hourDeg},90,100)`}>
          <path d="M90 54 L87 98 L90 96 L93 98 Z" fill="#2a1c0e"/>
          <circle cx="90" cy="96" r="2" fill="#4a3520"/>
          <path d="M90 96 Q85 94 82 98 Q85 102 90 100" fill="#5a4a30" opacity="0.8"/>
        </g>
        {/* Minute — slender */}
        <g transform={`rotate(${minuteDeg},90,100)`}>
          <line x1="90" y1="95" x2="90" y2="50" stroke="#3e2b18" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="90" cy="50" r="1.2" fill="#5a4a38"/>
        </g>
        {/* Second — hairline */}
        <g transform={`rotate(${secondDeg},90,100)`}>
          <line x1="90" y1="98" x2="90" y2="46" stroke="#8b4048" strokeWidth="0.8"/>
          <circle cx="90" cy="46" r="0.8" fill="#8b4048"/>
        </g>

        {/* Center boss */}
        <circle cx="90" cy="100" r="4.5" fill="url(#brassGrad)" stroke="#4a3520" strokeWidth="0.8"/>
        <circle cx="90" cy="100" r="2" fill="#2a1c0e"/>
        <circle cx="90" cy="100" r="0.8" fill="#8a6828"/>

        {/* ═══ LOWER AUTOMATON PANEL ═══ */}
        <rect x="34" y="154" width="112" height="38" rx="2" fill="#7a7060" opacity="0.2"/>
        <rect x="36" y="156" width="108" height="34" rx="1" fill="#d8d0c0" opacity="0.15"/>
        {/* Waves */}
        <path d="M36 185 Q52 178 68 185 Q84 192 100 185 Q116 178 144 185 L144 190 L36 190Z"
          fill="#5a7a8a" opacity="0.25"/>
        <path d="M40 182 Q60 175 80 182 Q100 189 120 182 Q132 178 140 182" fill="none" stroke="#7090a0" strokeWidth="1" opacity="0.3"/>
        {/* Ships */}
        <path d="M50 178 L55 170 L60 178Z" fill="#5a4a38" opacity="0.5"/>
        <path d="M110 176 L115 168 L120 176Z" fill="#5a4a38" opacity="0.4"/>
        {/* Flying figure (Mercury/Time) */}
        <circle cx="90" cy="165" r="3" fill="#9a7a50" opacity="0.4"/>
        <path d="M90 168 L85 175 M90 168 L95 175 M88 172 L82 170 M92 172 L98 170" stroke="#9a7a50" strokeWidth="0.8" opacity="0.4" fill="none"/>
      </svg>

      {/* Pendulum swinging below */}
      <div className="relative" style={{width:20, height:42, marginTop:-4}}>
        <div style={{
          position:'absolute', top:0, left:'50%', width:2, height:28,
          background:'linear-gradient(to bottom, #6a4a28, #3a2210)',
          transformOrigin:'50% 0%', transform:`translateX(-50%) rotate(${pendulumAngle}deg)`
        }}/>
        <div style={{
          position:'absolute', left:'50%', top:24,
          width:14, height:14, borderRadius:'50%', border:'2px solid #6a4a28',
          background:'radial-gradient(circle at 35% 30%, #e0c890, #8a6828)',
          transformOrigin:'-50% -24px', transform:`translateX(-50%) rotate(${pendulumAngle}deg)`,
          boxShadow:'0 2px 6px rgba(0,0,0,0.5)'
        }}/>
      </div>

      {/* Moon + Zodiac caption */}
      <div className="flex items-center justify-center gap-2 text-[9px] font-typewriter mt-1" style={{color:'rgba(201,169,110,0.45)', letterSpacing:'0.12em'}}>
        <span>{moon.emoji}</span>
        <span>{moon.name}</span>
        <span style={{opacity:0.3}}>·</span>
        <span>{zodiac.symbol}</span>
      </div>
    </div>
  );
}
