import { useState, useMemo } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { getMoodByName } from '../../lib/mood';

type Tab = 'oracle' | 'journal';

export default function GrimoirePage() {
  const [tab, setTab] = useState<Tab>('journal');
  const [jumpDate, setJumpDate] = useState('');
  const [journalSearch, setJournalSearch] = useState('');

  const { oracleQuotes, journalEntries, moods } = usePlannerStore();

  // === ORACLE DECK DATA ===
  const oracleDates = useMemo(() => {
    return Object.entries(oracleQuotes)
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [oracleQuotes]);

  // === JOURNAL BINDING DATA ===
  const journalDates = useMemo(() => {
    const entries = Object.values(journalEntries).sort((a, b) => b.date.localeCompare(a.date));
    if (!journalSearch.trim()) return entries;
    const q = journalSearch.toLowerCase();
    return entries.filter(e => e.content.toLowerCase().includes(q) || e.date.includes(q));
  }, [journalEntries, journalSearch]);

  const handleJump = () => {
    if (!jumpDate) return;
    const el = document.getElementById('oracle-' + jumpDate);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="max-w-4xl mx-auto pt-2 pb-16 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">The Archive</h1>
        <p className="font-typewriter text-xs tracking-[0.3em] text-[var(--text-3)] mt-2">
          {Object.keys(journalEntries).length} ENTRIES &bull; {Object.keys(oracleQuotes).length} ORACLES
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setTab('journal')}
          className={`px-4 py-2 rounded-full font-typewriter text-[10px] tracking-wider uppercase transition-all ${
            tab === 'journal'
              ? 'wax-seal'
              : 'bg-[var(--bg-card)]/40 border border-[var(--text-3)]/15 text-[var(--text-3)] hover:border-[var(--gold)]/30'
          }`}
        >
          The Journal Binding
        </button>
        <button
          onClick={() => setTab('oracle')}
          className={`px-4 py-2 rounded-full font-typewriter text-[10px] tracking-wider uppercase transition-all ${
            tab === 'oracle'
              ? 'wax-seal'
              : 'bg-[var(--bg-card)]/40 border border-[var(--text-3)]/15 text-[var(--text-3)] hover:border-[var(--gold)]/30'
          }`}
        >
          The Oracle Deck
        </button>
      </div>

      {/* === ORACLE DECK === */}
      {tab === 'oracle' && (
        <div className="space-y-4">
          {/* Date jump */}
          <div className="flex items-center justify-center gap-2">
            <input
              type="date"
              value={jumpDate}
              onChange={(e) => setJumpDate(e.target.value)}
              className="bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-1.5 text-xs font-typewriter text-[var(--text-1)] focus:outline-none focus:border-[var(--gold)]/40"
            />
            <button onClick={handleJump} className="wax-seal px-3 py-1.5 rounded-full text-[10px] font-typewriter">
              Jump
            </button>
          </div>

          {oracleDates.length === 0 ? (
            <p className="text-center text-[var(--text-3)]/50 font-typewriter text-xs tracking-wider pt-8">
              No oracles drawn yet. Visit the Desk to pull your first card.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {oracleDates.map(([date, card]) => {
                const moon = getMoonPhaseForDate(new Date(date + 'T00:00:00'));
                const mood = moods[date];
                return (
                  <div
                    key={date}
                    id={'oracle-' + date}
                    className="paper-lift rounded-lg bg-[var(--bg-card)]/40 border border-[var(--text-3)]/10 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-typewriter text-[10px] text-[var(--gold)] tracking-wider uppercase">
                        {date}
                      </span>
                      <span className="text-xs">{moon.emoji} {moon.name}</span>
                    </div>
                    <blockquote className="font-serif text-base italic text-[var(--text-1)] leading-relaxed">
                      &ldquo;{card.quote}&rdquo;
                    </blockquote>
                    <p className="font-typewriter text-[9px] text-[var(--text-3)] tracking-wide">
                      {card.source}
                    </p>
                    {mood && (
                      <div className="flex items-center gap-1 pt-1">
                        <span className="text-sm">{getMoodByName(mood.mood).emoji}</span>
                        <span className="text-[9px] font-typewriter text-[var(--text-3)] capitalize">{mood.mood}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* === JOURNAL BINDING === */}
      {tab === 'journal' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={journalSearch}
              onChange={(e) => setJournalSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full max-w-xs bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-1.5 text-xs font-typewriter text-[var(--text-1)] placeholder:text-[var(--text-3)]/40 focus:outline-none focus:border-[var(--gold)]/40"
            />
          </div>

          {journalDates.length === 0 ? (
            <p className="text-center text-[var(--text-3)]/50 font-typewriter text-xs tracking-wider pt-8">
              {journalSearch ? 'No entries match your search.' : 'No journal entries yet. Visit the Grimoire to begin.'}
            </p>
          ) : (
            <div className="space-y-4">
              {journalDates.map((entry) => {
                const date = entry.date;
                const moon = getMoonPhaseForDate(new Date(date + 'T00:00:00'));
                const mood = moods[date];
                const oracle = oracleQuotes[date];
                return (
                  <div
                    key={date}
                    className="paper-lift rounded-lg bg-[var(--bg-card)]/30 border border-[var(--text-3)]/10 p-5 space-y-3"
                  >
                    {/* Date header with context */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-typewriter text-[10px] text-[var(--gold)] tracking-wider uppercase">
                        {date}
                      </span>
                      <span className="text-xs">{moon.emoji} {moon.name}</span>
                      {mood && (
                        <span className="text-xs" title={getMoodByName(mood.mood).name}>
                          {getMoodByName(mood.mood).emoji}
                        </span>
                      )}
                    </div>

                    {/* Journal content */}
                    <p className="font-serif text-sm italic text-[var(--text-1)] leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    {/* Auto-enriched context bar */}
                    <div className="flex items-center gap-3 pt-2 border-t border-[var(--text-3)]/10">
                      {oracle && (
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-typewriter text-[var(--text-3)]/60 tracking-wider uppercase">Daily Oracle</p>
                          <p className="text-[10px] font-serif italic text-[var(--text-2)] truncate">
                            &ldquo;{oracle.quote}&rdquo;
                          </p>
                        </div>
                      )}
                      <div className="text-[9px] font-typewriter text-[var(--text-3)]/40 whitespace-nowrap">
                        {moon.emoji}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
