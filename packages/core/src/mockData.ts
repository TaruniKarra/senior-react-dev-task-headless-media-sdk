export interface MockItem {
  id: string;
  title: string;
  author: string;
  tags: string[];
  emoji: string;
  color1: string;
  color2: string;
  width: number;
  height: number;
}

export const MOCK_PHOTOS: MockItem[] = [
  // Dogs
  { id: "d1", title: "Golden Retriever", author: "Alex Kim", tags: ["dogs", "animals", "pets", "golden"], emoji: "🐕", color1: "#f59e0b", color2: "#92400e", width: 800, height: 600 },
  { id: "d2", title: "Husky in Snow", author: "Sara Lee", tags: ["dogs", "husky", "snow", "winter"], emoji: "🐺", color1: "#60a5fa", color2: "#1e3a5f", width: 800, height: 600 },
  { id: "d3", title: "Playful Labrador", author: "Tom Wells", tags: ["dogs", "labrador", "pets", "play"], emoji: "🦮", color1: "#fcd34d", color2: "#d97706", width: 800, height: 600 },
  { id: "d4", title: "Puppy Portrait", author: "Mia Stone", tags: ["dogs", "puppy", "portrait", "cute"], emoji: "🐶", color1: "#fda4af", color2: "#be123c", width: 800, height: 600 },
  { id: "d5", title: "Border Collie", author: "Jake Ray", tags: ["dogs", "collie", "animals", "smart"], emoji: "🐾", color1: "#6d28d9", color2: "#1e1b4b", width: 800, height: 600 },
  { id: "d6", title: "Dachshund Run", author: "Lucy Fox", tags: ["dogs", "dachshund", "run", "funny"], emoji: "🌭", color1: "#b45309", color2: "#78350f", width: 800, height: 600 },

  // Cats
  { id: "c1", title: "Orange Tabby", author: "Nina Park", tags: ["cats", "tabby", "animals", "orange"], emoji: "🐈", color1: "#fb923c", color2: "#7c2d12", width: 800, height: 600 },
  { id: "c2", title: "Black Cat Night", author: "Otto Black", tags: ["cats", "black", "night", "mystery"], emoji: "🐱", color1: "#1f2937", color2: "#4c1d95", width: 800, height: 600 },
  { id: "c3", title: "Kitten Yawn", author: "Zoe Moore", tags: ["cats", "kitten", "cute", "sleepy"], emoji: "😸", color1: "#f0abfc", color2: "#7c3aed", width: 800, height: 600 },
  { id: "c4", title: "Persian Cat", author: "Ivan Cruz", tags: ["cats", "persian", "fluffy", "portrait"], emoji: "😻", color1: "#e9d5ff", color2: "#a855f7", width: 800, height: 600 },
  { id: "c5", title: "Cat on Windowsill", author: "Clea Bird", tags: ["cats", "window", "sunlight", "cozy"], emoji: "🪟", color1: "#fde68a", color2: "#f59e0b", width: 800, height: 600 },

  // Flowers
  { id: "f1", title: "Rose Garden", author: "Emma Rose", tags: ["flowers", "roses", "garden", "red"], emoji: "🌹", color1: "#f43f5e", color2: "#881337", width: 800, height: 600 },
  { id: "f2", title: "Cherry Blossoms", author: "Hana Yuki", tags: ["flowers", "cherry", "blossom", "spring", "pink"], emoji: "🌸", color1: "#fbcfe8", color2: "#9d174d", width: 800, height: 600 },
  { id: "f3", title: "Sunflower Field", author: "Leo Sun", tags: ["flowers", "sunflower", "field", "yellow", "nature"], emoji: "🌻", color1: "#fef08a", color2: "#ca8a04", width: 800, height: 600 },
  { id: "f4", title: "Lavender Valley", author: "Ava Lane", tags: ["flowers", "lavender", "purple", "field", "provence"], emoji: "💜", color1: "#a78bfa", color2: "#5b21b6", width: 800, height: 600 },
  { id: "f5", title: "Tulip Parade", author: "Lena Green", tags: ["flowers", "tulips", "spring", "colorful"], emoji: "🌷", color1: "#fb7185", color2: "#e11d48", width: 800, height: 600 },
  { id: "f6", title: "Daisy Meadow", author: "Pip White", tags: ["flowers", "daisy", "meadow", "white", "nature"], emoji: "🌼", color1: "#fef9c3", color2: "#a16207", width: 800, height: 600 },
  { id: "f7", title: "Orchid Close-up", author: "Mei Lin", tags: ["flowers", "orchid", "macro", "exotic"], emoji: "🪷", color1: "#f9a8d4", color2: "#9333ea", width: 800, height: 600 },

  // Nature
  { id: "n1", title: "Forest Path", author: "Dan Wood", tags: ["nature", "forest", "path", "green", "trees"], emoji: "🌲", color1: "#4ade80", color2: "#14532d", width: 800, height: 600 },
  { id: "n2", title: "Misty Waterfall", author: "Fern Lake", tags: ["nature", "waterfall", "mist", "water"], emoji: "💧", color1: "#7dd3fc", color2: "#1e40af", width: 800, height: 600 },
  { id: "n3", title: "Autumn Leaves", author: "Ruby Fall", tags: ["nature", "autumn", "leaves", "fall", "orange"], emoji: "🍂", color1: "#f97316", color2: "#7c2d12", width: 800, height: 600 },
  { id: "n4", title: "Green Valley", author: "Glen Hills", tags: ["nature", "valley", "green", "landscape"], emoji: "🌿", color1: "#86efac", color2: "#15803d", width: 800, height: 600 },
  { id: "n5", title: "Mushroom Forest", author: "Sage Wild", tags: ["nature", "mushroom", "forest", "macro"], emoji: "🍄", color1: "#fca5a5", color2: "#7f1d1d", width: 800, height: 600 },

  // Mountains
  { id: "m1", title: "Alpine Sunrise", author: "Max Peak", tags: ["mountains", "alpine", "sunrise", "snow"], emoji: "🏔️", color1: "#bae6fd", color2: "#1e3a5f", width: 800, height: 600 },
  { id: "m2", title: "Rocky Summit", author: "Vera Stone", tags: ["mountains", "rocky", "summit", "hiking"], emoji: "⛰️", color1: "#9ca3af", color2: "#1f2937", width: 800, height: 600 },
  { id: "m3", title: "Mountain Lake", author: "Bjorn Ice", tags: ["mountains", "lake", "reflection", "blue"], emoji: "🏕️", color1: "#38bdf8", color2: "#0c4a6e", width: 800, height: 600 },
  { id: "m4", title: "Snowy Peaks", author: "Elsa Cold", tags: ["mountains", "snow", "winter", "peaks"], emoji: "❄️", color1: "#e0f2fe", color2: "#0369a1", width: 800, height: 600 },
  { id: "m5", title: "Volcano Dusk", author: "Kai Lava", tags: ["mountains", "volcano", "dusk", "dramatic"], emoji: "🌋", color1: "#ef4444", color2: "#450a0a", width: 800, height: 600 },

  // Ocean / Beach
  { id: "o1", title: "Tropical Beach", author: "Sol Tide", tags: ["ocean", "beach", "tropical", "blue", "sea"], emoji: "🏖️", color1: "#06b6d4", color2: "#164e63", width: 800, height: 600 },
  { id: "o2", title: "Ocean Waves", author: "Coral Bay", tags: ["ocean", "waves", "sea", "water"], emoji: "🌊", color1: "#2563eb", color2: "#1e3a5f", width: 800, height: 600 },
  { id: "o3", title: "Sunset Sail", author: "Marina Blue", tags: ["ocean", "sunset", "sailing", "boat"], emoji: "⛵", color1: "#f97316", color2: "#7c3aed", width: 800, height: 600 },
  { id: "o4", title: "Coral Reef", author: "Nemo Dive", tags: ["ocean", "coral", "reef", "underwater", "sea"], emoji: "🐠", color1: "#f59e0b", color2: "#0e7490", width: 800, height: 600 },
  { id: "o5", title: "Sea Turtle", author: "Pearl Deep", tags: ["ocean", "turtle", "underwater", "animals"], emoji: "🐢", color1: "#34d399", color2: "#065f46", width: 800, height: 600 },

  // City / Architecture
  { id: "a1", title: "City Skyline", author: "Urban Fox", tags: ["city", "skyline", "architecture", "night"], emoji: "🌆", color1: "#6366f1", color2: "#1e1b4b", width: 800, height: 600 },
  { id: "a2", title: "Bridge at Dusk", author: "Arch Webb", tags: ["city", "bridge", "architecture", "dusk"], emoji: "🌉", color1: "#f97316", color2: "#1e3a5f", width: 800, height: 600 },
  { id: "a3", title: "Gothic Cathedral", author: "Stone Bell", tags: ["architecture", "cathedral", "gothic", "history"], emoji: "⛪", color1: "#9ca3af", color2: "#374151", width: 800, height: 600 },
  { id: "a4", title: "Modern Tower", author: "Miro Glass", tags: ["architecture", "tower", "modern", "glass", "city"], emoji: "🏙️", color1: "#67e8f9", color2: "#155e75", width: 800, height: 600 },
  { id: "a5", title: "Street Alley", author: "Viv Lane", tags: ["city", "street", "alley", "urban", "photography"], emoji: "🛤️", color1: "#78716c", color2: "#292524", width: 800, height: 600 },

  // Food
  { id: "fo1", title: "Pizza Margherita", author: "Marco Chef", tags: ["food", "pizza", "italian", "cheese"], emoji: "🍕", color1: "#fde68a", color2: "#b45309", width: 800, height: 600 },
  { id: "fo2", title: "Sushi Platter", author: "Yuki Sato", tags: ["food", "sushi", "japanese", "fresh"], emoji: "🍱", color1: "#f0fdf4", color2: "#166534", width: 800, height: 600 },
  { id: "fo3", title: "Morning Coffee", author: "Brew Baker", tags: ["food", "coffee", "morning", "cafe"], emoji: "☕", color1: "#92400e", color2: "#1c0a00", width: 800, height: 600 },
  { id: "fo4", title: "Berry Dessert", author: "Sweet Ava", tags: ["food", "dessert", "berries", "sweet"], emoji: "🍓", color1: "#f43f5e", color2: "#881337", width: 800, height: 600 },
  { id: "fo5", title: "Farmer's Market", author: "Herb Garden", tags: ["food", "market", "vegetables", "fresh", "colorful"], emoji: "🥦", color1: "#4ade80", color2: "#14532d", width: 800, height: 600 },

  // Travel
  { id: "t1", title: "Paris at Night", author: "Belle Rêve", tags: ["travel", "paris", "night", "europe", "city"], emoji: "🗼", color1: "#fde68a", color2: "#7c3aed", width: 800, height: 600 },
  { id: "t2", title: "Santorini Blue", author: "Aegean Wind", tags: ["travel", "santorini", "greece", "blue", "europe"], emoji: "🇬🇷", color1: "#38bdf8", color2: "#1e40af", width: 800, height: 600 },
  { id: "t3", title: "Kyoto Temple", author: "Sakura Path", tags: ["travel", "kyoto", "japan", "temple", "asia"], emoji: "⛩️", color1: "#f87171", color2: "#7f1d1d", width: 800, height: 600 },
  { id: "t4", title: "Safari Sunset", author: "Savanna Wild", tags: ["travel", "safari", "africa", "sunset", "animals"], emoji: "🦁", color1: "#fbbf24", color2: "#92400e", width: 800, height: 600 },
  { id: "t5", title: "New York Rain", author: "Rainy Times", tags: ["travel", "new york", "city", "rain", "usa"], emoji: "🗽", color1: "#6b7280", color2: "#111827", width: 800, height: 600 },

  // Sunset / Sky
  { id: "s1", title: "Golden Sunset", author: "Dusk Walker", tags: ["sunset", "golden", "sky", "dusk", "nature"], emoji: "🌅", color1: "#f97316", color2: "#7c2d12", width: 800, height: 600 },
  { id: "s2", title: "Purple Dusk", author: "Violet Sky", tags: ["sunset", "purple", "dusk", "dramatic", "sky"], emoji: "🌇", color1: "#a78bfa", color2: "#4c1d95", width: 800, height: 600 },
  { id: "s3", title: "Starry Night", author: "Cosmos Ray", tags: ["sky", "stars", "night", "galaxy", "space"], emoji: "🌌", color1: "#1e40af", color2: "#0f172a", width: 800, height: 600 },
  { id: "s4", title: "Rainbow After Rain", author: "Iris Storm", tags: ["sky", "rainbow", "rain", "colorful", "nature"], emoji: "🌈", color1: "#f0abfc", color2: "#06b6d4", width: 800, height: 600 },

  // Winter
  { id: "w1", title: "Snowy Village", author: "Frost Cole", tags: ["winter", "snow", "village", "cozy"], emoji: "🏘️", color1: "#e0f2fe", color2: "#1e3a5f", width: 800, height: 600 },
  { id: "w2", title: "Frozen Lake", author: "Ice Fisher", tags: ["winter", "ice", "lake", "frozen", "blue"], emoji: "🧊", color1: "#bae6fd", color2: "#0c4a6e", width: 800, height: 600 },
  { id: "w3", title: "Winter Forest", author: "Pine Frost", tags: ["winter", "forest", "snow", "trees", "nature"], emoji: "🎄", color1: "#d1fae5", color2: "#065f46", width: 800, height: 600 },

  // Birds
  { id: "b1", title: "Eagle in Flight", author: "Sky Hunter", tags: ["birds", "eagle", "flight", "wildlife"], emoji: "🦅", color1: "#92400e", color2: "#1c1917", width: 800, height: 600 },
  { id: "b2", title: "Flamingo Lake", author: "Pink Lagoon", tags: ["birds", "flamingo", "pink", "lake"], emoji: "🦩", color1: "#f9a8d4", color2: "#9f1239", width: 800, height: 600 },
  { id: "b3", title: "Parrot Portrait", author: "Rio Wild", tags: ["birds", "parrot", "colorful", "tropical"], emoji: "🦜", color1: "#4ade80", color2: "#c026d3", width: 800, height: 600 },
  { id: "b4", title: "Owl at Night", author: "Midnight Wing", tags: ["birds", "owl", "night", "wildlife"], emoji: "🦉", color1: "#1f2937", color2: "#92400e", width: 800, height: 600 },

  // Space
  { id: "sp1", title: "Nebula Cloud", author: "Astro Lab", tags: ["space", "nebula", "galaxy", "stars", "cosmos"], emoji: "🌌", color1: "#7c3aed", color2: "#0f172a", width: 800, height: 600 },
  { id: "sp2", title: "Planet Rise", author: "Orbit View", tags: ["space", "planet", "orbit", "cosmos"], emoji: "🪐", color1: "#f59e0b", color2: "#1e3a5f", width: 800, height: 600 },
  { id: "sp3", title: "Aurora Borealis", author: "North Light", tags: ["space", "aurora", "northern lights", "sky", "green"], emoji: "🌠", color1: "#34d399", color2: "#0c4a6e", width: 800, height: 600 },

  // Abstract / Art
  { id: "ar1", title: "Color Burst", author: "Vivid Art", tags: ["abstract", "art", "colorful", "creative"], emoji: "🎨", color1: "#f43f5e", color2: "#6366f1", width: 800, height: 600 },
  { id: "ar2", title: "Geometric Flow", author: "Shape Studio", tags: ["abstract", "geometric", "pattern", "design"], emoji: "🔷", color1: "#0ea5e9", color2: "#7c3aed", width: 800, height: 600 },
  { id: "ar3", title: "Neon Waves", author: "Glow Lab", tags: ["abstract", "neon", "waves", "light"], emoji: "〰️", color1: "#a3e635", color2: "#0891b2", width: 800, height: 600 },
];
