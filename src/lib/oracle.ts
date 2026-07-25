
export interface OracleCard {
  quote: string;
  source: string;
  card: string;
}

const ORACLE_CARDS: OracleCard[] = [
  { quote: "The stars are not afraid of the candle.", source: "Rumi", card: "The Candle" },
  { quote: "I told the stars about you.", source: "Unknown", card: "The Whisper" },
  { quote: "The moon asks nothing of the tide.", source: "Ocean Proverb", card: "The Tide" },
  { quote: "Trust the wait. Embrace the uncertainty. Enjoy the beauty of becoming.", source: "Morgan Harper Nichols", card: "The Chrysalis" },
  { quote: "In a gentle way, you can shake the world.", source: "Gandhi", card: "The Earthquake" },
  { quote: "You are the sky. Everything else is just the weather.", source: "Pema Chödrön", card: "The Sky" },
  { quote: "What if I fall? Oh, but my darling, what if you fly?", source: "Erin Hanson", card: "The Leap" },
  { quote: "The wound is the place where the light enters.", source: "Rumi", card: "The Light" },
  { quote: "She is both, hellfire and holy water. And the flavor you taste depends on how you treat her.", source: "J.M. Storm", card: "The Alchemy" },
  { quote: "Be wild; that is how to clear the river.", source: "Clarissa Pinkola Estés", card: "The River" },
  { quote: "The universe is under no obligation to make sense to you.", source: "Neil deGrasse Tyson", card: "The Mystery" },
  { quote: "You are the universe experiencing itself in human form.", source: "Alan Watts", card: "The Vessel" },
  { quote: "There is a language older by far and deeper than words.", source: "Richard Powers", card: "The Root" },
  { quote: "The quieter you become, the more you are able to hear.", source: "Rumi", card: "The Silence" },
  { quote: "If you think you are too small to make a difference, try sleeping with a mosquito.", source: "Dalai Lama", card: "The Mosquito" },
  { quote: "The cave you fear to enter holds the treasure you seek.", source: "Joseph Campbell", card: "The Cave" },
  { quote: "There are years that ask questions and years that answer.", source: "Zora Neale Hurston", card: "The Question" },
  { quote: "The soul is healed by being with children.", source: "Fyodor Dostoevsky", card: "The Child" },
  { quote: "You are your own teacher. Investigate yourself to find the truth.", source: "Buddha", card: "The Seeker" },
  { quote: "Out of difficulties grow miracles.", source: "Jean de La Bruyère", card: "The Miracle" },
  { quote: "The moon is friend for the lonesome to talk to.", source: "Carl Sandburg", card: "The Companion" },
  { quote: "A certain darkness is needed to see the stars.", source: "Osho", card: "The Dark" },
  { quote: "Throw yourself into the water if you wish to learn how to swim.", source: "Indonesian proverb", card: "The Deep" },
  { quote: "After all this time, the sun still says good morning to the flowers.", source: "Tyler Knott Gregson", card: "The Dawn" },
];

// Deterministic daily card using date as seed
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export function getCardForDate(dateStr: string): OracleCard {
  const idx = Math.floor(seededRandom(dateStr + '_oracle') * ORACLE_CARDS.length);
  return ORACLE_CARDS[idx];
}

export function getRandomCard(): OracleCard {
  return ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
}
