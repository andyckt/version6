'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiClock, FiDollarSign, FiCamera, FiInfo, FiStar, FiMapPin, FiSun, FiMoon, FiAlertTriangle, FiCoffee } from 'react-icons/fi'
import { RiCupLine, RiMoonClearLine, RiBuilding4Line, RiVipCrownLine } from 'react-icons/ri'
import { GiMartini, GiWineBottle, GiPartyPopper, GiWineGlass } from 'react-icons/gi'
import { TbSunglasses, TbPhoto, TbGlass, TbGlassFull, TbMoodHappy, TbAlertTriangle, TbMapPin } from 'react-icons/tb'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import { BiDrink, BiDish } from 'react-icons/bi'

// Bar information type
interface Bar {
  id: string;
  name: string;
  title: string;
  content: string[];
  icon: React.ElementType;
  color: string;
}

export default function GetDrunkContent() {
  const [activeTab, setActiveTab] = useState<'nightview' | 'predrink' | 'redflag' | 'hidden' | 'gooddrinks'>('nightview')
  const [expandedBar, setExpandedBar] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Nightview rooftop bars data
  const nightviewBars: Bar[] = [
    {
      id: 'captains-bar',
      name: "The Captain's Bar",
      title: "🍸 The Captain's Bar",
      content: [
        "\"Sexy Beach\" mocktail (wink wink) (my favourite) actually lives up to its name 🌴 - 68¥ for liquid confidence without the hangover.",
        "Pro tip: Come at 5pm to avoid crowd 👯♀️. Book that window seat early or cry about your shitty pictures later. Magic hour = 7pm when the Pearl Tower begins its light show 💎."
      ],
      icon: GiMartini,
      color: '#FF6B6B'
    },
    {
      id: 'kev-rooftop',
      name: "KEV Rooftop (Bund 18)",
      title: "🥂 KEV Rooftop (Bund 18)",
      content: [
        "Most of their tequila are pretty good ngl, for example the Kev Blood 🍆.",
        "Good food too, like Vietnam-style chips, good service, and good background music, 8/10 ngl"
      ],
      icon: GiWineGlass,
      color: '#4ECDC4'
    },
    {
      id: 'roosevelt-bar',
      name: "Roosevelt Sky Bar",
      title: "📸 Roosevelt Sky Bar",
      content: [
        "Recommend to show up at 6:30pm, to avoid too many people. Cocktails? Meh, average. Views? I think ppl mainly go for the views💋. No entry fee, just need you buy a drink, but need to standing, unless you drop 3k¥ on a table."
      ],
      icon: TbPhoto,
      color: '#FFD166'
    },
    {
      id: 'flair-rooftop',
      name: "Flair Rooftop",
      title: "🍸 Flair Rooftop",
      content: [
        "No entry fee, just need to buy one drink (around168¥)",
        "If you're ritz carlton hotel guests, Free entry, no need to buy any drink nor food.",
        "⏰ Pro Timing:",
        "6:30pm arrival",
        "7pm = When the city lights up 🔥",
        "🍟 Eats & Treats:",
        "Truffle fries, banging good, worth it",
        "⚠️ Recommend booking one day before, always long queue"
      ],
      icon: RiBuilding4Line,
      color: '#118AB2'
    },
    {
      id: 'sir-ellys-terrace',
      name: "Sir Elly's Terrace",
      title: "🍸 Sir Elly's Terrace",
      content: [
        "No minimum spend! Just buy a drink",
        "⏰ Timing is Everything:",
        "Can walk in, highly recommend arriving earlier, around 8pm, 9-10pm is peak time, more people",
        "🍔 Eats & Sips:",
        "\"Blue Steel\" my favourite drink 💙",
        "Burger is banging",
        "Fries? Meh.",
        "📸 Picture Hacks:",
        "Bring human flashlight (aka friend with phone light) 💡",
        "Overall:  it's my favouirte bar spot with my bfs"
      ],
      icon: RiVipCrownLine,
      color: '#073B4C'
    }
  ]
  
  // Pre-drink bars data
  const preDrinkBars: Bar[] = [
    {
      id: 'perrys',
      name: "Perry's",
      title: "Perrys (good for pre drinks, and then go clubbing)",
      content: [
        "Shanghai famous bar chain for affordable pre-drink before clubbing",
        "Basic but effective drinks to get you tipsy fast",
        "Peach cocktail bucket is worth a shot",
        "Don't forget to try their crunchy AF fries 🍟",
        "Banger playlists 🔊 - Top 40 remixes x neon lights",
        "Warning: not a good place if you wanna chat ❌🗣️"
      ],
      icon: GiPartyPopper,
      color: '#FF9F1C'
    },
    {
      id: 'jolly-bar',
      name: "Jolly Bar",
      title: "Jolly Bar 🍍 Fruit cocktail",
      content: [
        "¥20-30 per drinkdrink",
        "Low-alcohol fruity drinks, every cocktail comes with whole fruit slices",
        "Shared tables = instant friends (been here many times back in freshman year, heard many juicy and wild stories here!)",
        "Must-try Drinks:",
        "Recommend 🥃 Hawthorn Whiskey - quite heavy, can get you tipsy",
        "Recommend 🍉 Watermelon cocktain - very fresh",
        "Pro tip: Perfect warm-up before hitting the clubs!"
      ],
      icon: GiWineBottle,
      color: '#E76F51'
    }
  ]

  // Red Flag bars data
  const redFlagBars: Bar[] = [
    {
      id: 'insomnia-bar',
      name: "Insomnia Bar",
      title: "Insomnia Bar",
      content: [
        "*Not worth the hype but here's the tea:*",
        "- Looks decent for Instagram pics 📸, but drinks taste like regret 🤢 Total style-over-substance vibe",
        "- just turned the lights down low and called it ~ambiance~",
        "- Music's whack 🎵 (think loud chaos, not cool beats)",
        "- **Drinks taste like astronaut food** 👩🚀",
        "*\"My cocktail was 40% dry ice, 60% regret\"*",
        "- cool ceiling lights tho",
        "**Tip:** Skip the drinks, snap a pic if you're nearby 📸❌🍸, it's got a cool ceiling"
      ],
      icon: TbAlertTriangle,
      color: '#EF4444'
    }
  ]

  // Hidden bars data
  const hiddenBars: Bar[] = [
    {
      id: 'southern-cross',
      name: "Southern Cross Bar",
      title: "Southern Cross Bar 🌌",
      content: [
        "😎 Very Low-key and hidden bar!",
        "✨ Best hidden bar, my date spot with my bfs",
        "A 20-year-old bar that regulars keep coming back to",
        "🍸 Awesome drinks - Their Japanese-style bar keeps it real with classic cocktails (no trendy BS)",
        "🌳 Hidden behind the road - Easy to miss but worth the hunt",
        "😎 Chill vibes - Often feels like you've got the place to yourself (went twice and basically had private service!)",
        "💎 Zero marketing hustle - Found it through comments",
        "👫 Perfect date spot - Quiet enough for actual conversation, social but not loud",
        "Must-try Drinks:",
        "🤌 Negroni - \"From someone who's tried 30+ Negronis – this one's magic\"",
        "🛩️ Aviation - Gin + lemon + crushed ice = beautiful blue happiness",
        "🕶️ Dry Martini - \"Smooth\"",
        "Pro tip: Walk in expecting good drinks, walk out with new friends 🥂 Both times ended up chatting with strangers like we were regulars!"
      ],
      icon: TbMapPin,
      color: '#8B5CF6'
    }
  ]

  // Good Drinks bars data
  const goodDrinksBars: Bar[] = [
    {
      id: 'pony-up',
      name: "Pony Up",
      title: "Pony Up (highly recommend)",
      content: [
        "9:30pm is peak time, so arrive before it",
        "Recommended drinks:",
        "🍸 Enable (the best of the best in my POV)",
        "Brandy + apricot + butter with a very satisfying buttered smell 🧈💋",
        "Pro tip: Chug this before Tinder dates for instant charm mode 😏",
        "☕ Espresso Martini That'll Make You Horny...",
        "Coffee + booze + floral notes = IRL liquid courage.",
        "Bonus: Makes your breath smell like a sexy coffee shop ☕✨",
        "🌶️ Saucy Margarita",
        "The citrusy pineapple smooths out the tequila bite, then the milk makes everything creamy. You get salty first, then the heat kicks in, ends with this satisfying savory aftertaste.",
        "Pro tip: add Tabasco if you wanna turn up the heat! 💛💛💛💛💛",
        "🥃 Ochazuke Old Fashioned",
        "for Whiskey lovers! Whiskey + kombu + tieguanyin tea + plum wine",
        "Smokier than your last failed hookup's vape pen 💨",
        "🍔 Drunk Food:",
        "Hot Dog",
        "Chocolate Butter Cookie - Saw these at the next table after few drinks - girl said they're her must-have every visit. Had to try",
        "Overall?: That butter cocktail alone is worth the liver damage, fight me"
      ],
      icon: GiMartini,
      color: '#10B981'
    },
    {
      id: 'paal',
      name: "Paal",
      title: "Paal (also recommend)",
      content: [
        "🥂 Solid drinks overall",
        "✨ Biggest takeaway: This place is OCD-level CLEAN!",
        "The two bartenders were constantly wiping, washing, and organizing between making drinks - like hyperactive cleaning fairies 🧹 Watching them made me tired (but lowkey impressed). Gives major \"no crumb left behind\" vibes.",
        "Must-Tries:",
        "Drinks:",
        "🥚 Salted Egg Yolk - The wildcard winner! Sounds weird but that savory-sweet magic just works",
        "🥒 Bitter Melon - Surprisingly refreshing! Topped with this silky foam layer. Gets the bitter-sweet balance just right - finishes clean like a spa day for your tongue 💆♂️",
        "🥭 Mango - The heavyweight champ! Told my friend \"Okay we can go home now\" after this one. Starts sweet like a tropical martini, then...",
        "The baijiu base sneaks up on you - zero alcohol burn thanks to the pickled onion 🧅 that adds this salty kick. Pro tip: Bite the onion halfway through - instant sobriety hack! Went from 🥴 to \"I could plow a field rn\" real quick.",
        "🍹 Perfect pre-game spot - drinks go down easy but still have depth. Bonus: It's walking distance from Root Down (another 🔥 bar worth checking out)."
      ],
      icon: TbGlassFull,
      color: '#3B82F6'
    },
    {
      id: 'aba-whisky',
      name: "Aba Whisky Bar",
      title: "🥃 Aba Whisky Bar (HIGHLY recommend) (one of my favs in town!)",
      content: [
        "🍦 WHISKY ICE CREAM!! (seriously, don't skip this)",
        "🍸 Solid drinks that never miss",
        "🤝 Owner's super chill and easy to chat with, vibe is always welcoming",
        "🎥 Came for the cinematic decor and creative drink names, stayed for the good times",
        "✨ Perfect low-key spot for proper whisky tasting without the pretentiousness",
        "When friends wanna explore whisky, ABA's my go-to spot",
        "✔️ Fair prices",
        "✔️ No pushy upsells from staff",
        "Must-try: East Meets West",
        "Whisky meets Chinese baijiu and Japanese matcha – total flavor explosion",
        "Bar snacks:",
        "🍦 Their whisky ice cream? Absolute game-changer",
        "Liquid Mont Blanc cocktail – dessert in a glass!",
        "Got hooked on their wine cask-aged Kavalan",
        "Even their salads hit different",
        "P.S. Nearby bars also recommended: @coa, @speaklow, and @paal within walking distance.",
        "Pro tip: Don't skip that ice cream!"
      ],
      icon: BiDrink,
      color: '#F59E0B'
    },
    {
      id: 'suzu-bar',
      name: "Suzu Bar",
      title: "🍸 Suzu Bar - Shanghai's martini best spot",
      content: [
        "✔️ Even if you're not big on cocktails, you'll love these drinks",
        "⚠️ Heads up:",
        "Tables are cozy, packed in tight",
        "Sound carries – you'll hear everyone's convos",
        "Why go:",
        "Martini lovers MUST make the pilgrimage",
        "Japanese-style bar with genius twists on classics",
        "Unbeatable textures in every variation",
        "Vibe: 🎌",
        "Books up fast – bar seats gone in 30 mins",
        "Lively atmosphere (not your quiet date spot)",
        "Team of master mixologists (2 Japanese + 1 Chinese bartender)",
        "Pro tip:",
        "These are PROPER martinis – bold and bracing 🚨",
        "Not your watered-down \"girl dinner\" versions",
        "Must-try:",
        "Martini No. 5 (first page menu star)",
        "Just... wow. Trust me.",
        "Best for: Cocktail exports 🧪",
        "Skip if: You want intimate conversations 🍆🍆🍆🔥🔥🔥"
      ],
      icon: GiMartini,
      color: '#4B5563'
    },
    {
      id: 'speaklow',
      name: "Speaklow",
      title: "Speaklow 🚪 (but can consider go or not)",
      content: [
        "🎪 This place is more of an attraction than bar now",
        "but if you go, you gotta try their Mapo Tofu Pizza 🍕🍕",
        "⚠️ Heads up:",
        "No reservations (except 3rd floor)",
        "Peak crowds after 6:30pm – queue starts before sunset!",
        "Tight seating, noise levels vary by floor",
        "Why go:",
        "Hidden door gimmick 🕵️‍♂️ (fun for first-timers)",
        "Two distinct experiences:",
        "🥛 2nd floor: Creamy cocktails & casual vibe",
        "🎎 3rd floor: Japanese-inspired craft cocktails",
        "Food that slaps:",
        "🍕 Foie Gras Mapo Tofu Pizza (wild combo)",
        "🍟 Japanese-style Fries",
        "🔪 Beef Tartare (good but \"Ximei\" on Anfu Rd does it better)",
        "Best time: Arrive before 6:30pm ⏰",
        "Skip if: You want intimate dates 🍆🍑🍒"
      ],
      icon: TbGlassFull,
      color: '#9CA3AF'
    }
  ]

  // Toggle accordion for a bar
  const toggleBar = (id: string) => {
    setExpandedBar(expandedBar === id ? null : id)
    
    // Scroll to the content after expansion
    if (expandedBar !== id) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  return (
    <div className="py-6">
      {/* Main Heading */}
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Best Bars in Shanghai</h1>
        <p className="text-gray-600 max-w-lg mx-auto"></p>
      </motion.div>

      {/* Tab Selection */}
      <div className="mb-8">
        <div className="flex justify-center">
          <motion.div 
            className="bg-white rounded-full p-1 shadow-md flex flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 m-1 ${
                activeTab === 'nightview' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('nightview')}
            >
              <div className="flex items-center">
                <RiMoonClearLine className="mr-2" />
                <span>Nightview Bars</span>
              </div>
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 m-1 ${
                activeTab === 'predrink' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('predrink')}
            >
              <div className="flex items-center">
                <TbGlassFull className="mr-2" />
                <span>Pre Drinks</span>
              </div>
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 m-1 ${
                activeTab === 'hidden' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('hidden')}
            >
              <div className="flex items-center">
                <TbMapPin className="mr-2" />
                <span>Hidden Bars</span>
              </div>
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 m-1 ${
                activeTab === 'gooddrinks' 
                  ? 'bg-black text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('gooddrinks')}
            >
              <div className="flex items-center">
                <BiDrink className="mr-2" />
                <span>Good Drinks</span>
              </div>
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 m-1 ${
                activeTab === 'redflag' 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('redflag')}
            >
              <div className="flex items-center">
                <TbAlertTriangle className="mr-2" />
                <span>Red Flags</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bar Cards */}
      <div className="space-y-4" ref={contentRef}>
        <AnimatePresence mode="wait">
          {activeTab === 'nightview' ? (
            <motion.div
              key="nightview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {nightviewBars.map((bar, index) => (
                <motion.div
                  key={bar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div 
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-300`}
                    onClick={() => toggleBar(bar.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: `${bar.color}20`, color: bar.color }}
                        >
                          <bar.icon className="text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{bar.name}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedBar === bar.id ? 180 : 0 }}
                        className="text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedBar === bar.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 overflow-hidden"
                      >
                        <div className="pb-5 pt-2">
                          <h4 className="text-lg font-semibold mb-3" style={{ color: bar.color }}>{bar.title}</h4>
                          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: `${bar.color}40` }}>
                            {bar.content.map((paragraph, i) => (
                              <p key={i} className="text-gray-600">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : activeTab === 'predrink' ? (
            <motion.div
              key="predrink"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {preDrinkBars.map((bar, index) => (
                <motion.div
                  key={bar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div 
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-300`}
                    onClick={() => toggleBar(bar.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: `${bar.color}20`, color: bar.color }}
                        >
                          <bar.icon className="text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{bar.name}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedBar === bar.id ? 180 : 0 }}
                        className="text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedBar === bar.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 overflow-hidden"
                      >
                        <div className="pb-5 pt-2">
                          <h4 className="text-lg font-semibold mb-3" style={{ color: bar.color }}>{bar.title}</h4>
                          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: `${bar.color}40` }}>
                            {bar.content.map((paragraph, i) => (
                              <p key={i} className="text-gray-600">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : activeTab === 'hidden' ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {hiddenBars.map((bar, index) => (
                <motion.div
                  key={bar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-purple-500"
                >
                  <div 
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-300`}
                    onClick={() => toggleBar(bar.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: `${bar.color}20`, color: bar.color }}
                        >
                          <bar.icon className="text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{bar.name}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          Hidden Bar
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedBar === bar.id ? 180 : 0 }}
                        className="text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedBar === bar.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 overflow-hidden"
                      >
                        <div className="pb-5 pt-2">
                          <h4 className="text-lg font-semibold mb-3" style={{ color: bar.color }}>{bar.title}</h4>
                          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: `${bar.color}40` }}>
                            {bar.content.map((paragraph, i) => (
                              <p key={i} className="text-gray-600">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              <motion.div 
                className="mt-6 bg-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <FiStar className="text-purple-500 mr-3 text-xl" />
                  <h3 className="text-xl font-semibold text-gray-800">Why Hidden Bars Are Special</h3>
                </div>
                <p className="text-gray-700 ml-8">
                  These bars may be hard to find, but they offer authentic experiences away from the tourist crowds. For those who value quality drinks, intimate atmospheres, and unique character over flashy decor.
                </p>
              </motion.div>
            </motion.div>
          ) : activeTab === 'gooddrinks' ? (
            <motion.div
              key="gooddrinks"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {goodDrinksBars.map((bar, index) => (
                <motion.div
                  key={bar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-black"
                >
                  <div 
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-300`}
                    onClick={() => toggleBar(bar.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: `${bar.color}20`, color: bar.color }}
                        >
                          <bar.icon className="text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{bar.name}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedBar === bar.id ? 180 : 0 }}
                        className="text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedBar === bar.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 overflow-hidden"
                      >
                        <div className="pb-5 pt-2">
                          <h4 className="text-lg font-semibold mb-3" style={{ color: bar.color }}>{bar.title}</h4>
                          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: `${bar.color}40` }}>
                            {bar.content.map((paragraph, i) => (
                              <p key={i} className="text-gray-600">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              <motion.div 
                className="mt-6 bg-gray-900 p-6 rounded-2xl shadow-sm border border-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <FiStar className="text-white mr-3 text-xl" />
                  <h3 className="text-xl font-semibold text-white">Why We Love These Bars</h3>
                </div>
                <p className="text-gray-200 ml-8">
                  These bars offer exceptional drink experiences with unique flavors, quality ingredients, and skilled bartending. If you're someone who appreciates the craft of cocktail-making and wants memorable drinks, these places should be on your must-visit list.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="redflag"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {redFlagBars.map((bar, index) => (
                <motion.div
                  key={bar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-red-500"
                >
                  <div 
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-300`}
                    onClick={() => toggleBar(bar.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: `${bar.color}20`, color: bar.color }}
                        >
                          <bar.icon className="text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{bar.name}</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Not Recommended
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedBar === bar.id ? 180 : 0 }}
                        className="text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedBar === bar.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 overflow-hidden"
                      >
                        <div className="pb-5 pt-2">
                          <h4 className="text-lg font-semibold mb-3" style={{ color: bar.color }}>{bar.title}</h4>
                          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: `${bar.color}40` }}>
                            {bar.content.map((paragraph, i) => (
                              <p key={i} className="text-gray-600">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              <motion.div 
                className="mt-6 bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <FiAlertTriangle className="text-red-500 mr-3 text-xl" />
                  <h3 className="text-xl font-semibold text-gray-800">Why We Include Red Flags</h3>
                </div>
                <p className="text-gray-700 ml-8">
                  Some places in Shanghai get hyped on social media but don't deliver in person. We share these spots so you can save your time and money for the places that are actually worth it!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 