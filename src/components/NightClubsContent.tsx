'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMusic, FiAlertTriangle, FiDollarSign, FiUsers, FiMapPin, FiInfo, FiClock } from 'react-icons/fi'
import { RiVipCrownLine, RiDoorOpenLine } from 'react-icons/ri'
import { GiPartyPopper, GiSpeaker, GiDrinkMe, GiLightningArc } from 'react-icons/gi'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import { TbMoodHappy, TbBuildingSkyscraper } from 'react-icons/tb'
import { BsBuildingsFill } from 'react-icons/bs'

// Club information type
interface Club {
  id: string;
  name: string;
  title: string;
  content: string[];
  icon: React.ElementType;
  color: string;
}

export default function NightClubsContent() {
  const [activeClub, setActiveClub] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Ins Park clubs data
  const insClubs: Club[] = [
    {
      id: 'ins-park',
      name: "Ins Park",
      title: "Ins Park 🔥",
      content: [
        "Shanghai's biggest club area 🍑🔥 - where the city's hottest specimens come to flex their DNA every Friday and Saturday night",
        "🎟️ There are more than 8 clubs inside this building. By buying a FULL pass, you can enter all of them, except a club called Kezee which most people don't like it anyways.",
        "⚠️ Survival Guide:",
        "Remember to arrive early to get all the entry bracelets first! If you entry bracelets of all the clubs, you won't have to line up again, this is what I do pretty much every time I party at Ins Park."
      ],
      icon: BsBuildingsFill,
      color: '#f472b6'
    },
    {
      id: 'culture-club',
      name: "Culture Club",
      title: "🌈 Culture Club",
      content: [
        "The LGBT club, but wait, wait till I finish, keep reading.",
        "It's my favourite club, best music, everyone's here to actually dance, not pretend to dance and being touchy 🍆🍑🍒",
        "90% gays, 5% \"allies\" here for the abs, 5% straight guys praying to God they don't get hard",
        "👯 Vibe Check:",
        "Hiphop, pop songs, Music so good even your rhythmically-challenged ass will grind on strangers 🍑",
        "Dance battles with your ass twerking",
        "🎓 People:",
        "mostly uni students, and quite a lot of international hotties too",
        "⚠️ Pro Tips:",
        "Best place to get lit AF without people asking \"Do u come here often?\" :)",
        "Just don't cry when your ass can't keep up with the twerk champions 💃🔥",
        "#NoHookupZone #WearStretchyPants",
        "like if you really just look for music and dancing, this is the best place. But if you are looking for some juicy hookups, I'd recommend Hush and Radi",
        "💸 Entry fee:",
        "varies all the time",
        "Boys: $100 (comes with 1 drink to calm your fragile hetero ego)",
        "Girls: $159 (price of being fabulous 💅 – comes with 2 drinks to forget the gender pay gap)",
        "this club is included in the Full Pass, so no need to entry fee if you already have the Full Pass."
      ],
      icon: IoMusicalNotesOutline,
      color: '#8B5CF6'
    },
    {
      id: 'hush',
      name: "Hush",
      title: "Hush",
      content: [
        "this is straight-up Hip-Hop heaven",
        "Crowd:",
        "👯‍♂️ 90% thirsty college kids, 10% \"I'm definitely not here to hook up\" liars",
        "🔥 Pro tip: The bathroom line has better game than Tinder",
        "Vibe Check:",
        "Perfect for when you want to:",
        "\"Accidentally\" grind on strangers, or men-to-men grinding cuz it's quite crowded",
        "⚠️ Warning: Dance floor is a bit too small",
        "Entry fees:",
        "Weekdays: 88元",
        "Weekends: 158元",
        "🍹 All tickets include 8 basic cocktails - because liquid courage is free here",
        "this club is included in the Full Pass, so no need to entry fee if you already have the Full Pass."
      ],
      icon: GiSpeaker,
      color: '#EF4444'
    },
    {
      id: 'lafin',
      name: "LaFin Club Shanghai",
      title: "LaFin Club Shanghai 🍸",
      content: [
        "Hip-Hop & \"Networking\" 🎤💸",
        "this is more of a high-end business-type club with mostly tables 💼, not a big dance pool 🚫💃",
        "More foreign investors than a stock exchange 📈🇺🇸🇰🇷🇬🇧",
        "\"Cultural exchange programs\" that start with \"Let me buy you a drink\" 🥂 or \"You come here often?\" 😏",
        "Crowd Vibe 👯♂️:",
        "lots of college kids too 🎒, networking that definitely won't end up on LinkedIn 💋",
        "can dance in 2 square feet of space 🕺📏🚶♂️",
        "⚠️ Warning: More handsy here – keep your butt closer to your friends and protect them. ✋🔪👀",
        "Entry Fee Update 💰📅",
        "Weekdays - 150rmb (includes 2 drinks) 🍸🍸",
        "Weekends - 188rmb (includes 2 drinks) 💸💸",
        "this club is included in the Full Pass, so no need to entry fee if you already have the Full Pass."
      ],
      icon: RiVipCrownLine,
      color: '#F59E0B'
    },
    {
      id: 'radi',
      name: "Radi Club Shanghai",
      title: "Radi Club Shanghai",
      content: [
        "EDM & Pop Paradise that'll make your ass clap 👏 🎧💃",
        "Foreign hotties everywhere - so practice your \"hello\" in 6 languages 🗣️🌍",
        "Pretend you're in Ibiza until your 9am meeting ruins the fantasy 🌅",
        "Dance floor's stickier than a 3am Tinder date's sheets 🛌💦",
        "Crowd's 80% thirsty students, 10% \"models\"",
        "and 10% college kids blowing daddy's money 💸",
        "and 10% Exchange students \"researching Chinese culture\" 📚🍻",
        "💸Entry Fee: (varies all the time)",
        "Weekdays - 120rmb (includes 1  drink) 🥤",
        "Weekends - 180rmb (includes 1 drink) 🥃",
        "this club is included in the Full Pass, so no need to entry fee if you already have the Full Pass."
      ],
      icon: IoMusicalNotesOutline,
      color: '#4ECDC4'
    }
  ];
  
  // Standalone clubs data (not part of Ins Park)
  const standaloneClubs: Club[] = [
    {
      id: 'orii',
      name: "Orii",
      title: "Orii 💃",
      content: [
        "This place opened in late 2022. Now it's where hiphop heads, K-Pop stans, and thirsty foreigners.",
        "🎵 Music Vibe Check 🎵",
        "🍹 Pre-midnight: Basic white girl hours with Bieber and Tay-Tay",
        "🍹 Post-midnight: K-Pop 🔥",
        "We're talking BLACKPINK drops that vibrate your soul (and other body parts), BTS tracks that make you forget you can't dance.",
        "🍹 btw, They have a spring-loaded dance floor that's basically a trampoline for drunk adults.",
        "👯 Crowd & Vibe 👀",
        "90% hot people pretending they don't need oxygen",
        "10% foreigners trying to pronounce \"xièxie\" (which means thank you btw)",
        "and that one white guy yelling \"NI HAO\" at everyone 🥴",
        "0-100% chance you'll grind on a stranger",
        "Ladies, the free drinks will have you twerking to Big Bang by 1AM - no judgment here! 🍸",
        "💸 Survival Guide 💸",
        "Cover charge: ¥100 (weekdays) gets you entry + beer",
        "Weekend ¥150 = price of pretending you like beer",
        "Girls drink free! (Because the club knows who actually spends money 💅)😉",
        "Final thought: It's basic, it's chaotic, and you'll 100% wake up with someone's lipstick on your collar"
      ],
      icon: GiLightningArc,
      color: '#10B981'
    }
  ];

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="py-6">
      {/* Main Heading */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-center mb-2">Shanghai Nightclubs 🎧</h1>
        <p className="text-gray-600 text-center">The best places to dance the night away</p>
      </motion.div>

      {/* Main Feature Club */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-3 flex items-center">
              <BsBuildingsFill className="w-6 h-6 mr-2" />
              Ins Park - Shanghai's Club Complex
            </h2>
            <p className="mb-4 text-purple-100">
              Shanghai's biggest club area 🍑🔥 - where the city's hottest specimens come to flex their DNA every Friday and Saturday night
            </p>
            <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="font-medium flex items-center">
                <FiInfo className="w-5 h-5 mr-2" />
                <span>FULL Pass Guide 🎟️</span>
              </p>
              <p className="mt-2">
                There are more than 8 clubs inside this building. By buying a FULL pass, you can enter all of them, except a club called Kezee which most people don't like it anyways.
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="font-medium flex items-center">
                <FiAlertTriangle className="w-5 h-5 mr-2" />
                <span>Survival Guide ⚠️</span>
              </p>
              <p className="mt-2">
                Remember to arrive early to get all the entry bracelets first! If you entry bracelets of all the clubs, you won't have to line up again, this is what I do pretty much every time I party at Ins Park.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Clubs List */}
      <div className="space-y-5 mt-8">
        <motion.h2 
          className="text-xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          Popular Clubs at Ins Park
        </motion.h2>

        {insClubs.slice(1).map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
            className={`bg-white rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg ${activeClub === club.id ? 'ring-2 ring-offset-2' : ''}`}
            style={{ 
              borderLeft: activeClub === club.id ? `6px solid ${club.color}` : `3px solid ${club.color}`,
              boxShadow: activeClub === club.id ? `0 4px 14px rgba(0, 0, 0, 0.1)` : '',
            }}
          >
            <div 
              className="p-5 cursor-pointer"
              onClick={() => setActiveClub(activeClub === club.id ? null : club.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                    style={{ backgroundColor: `${club.color}20` }}
                  >
                    <club.icon className="w-5 h-5" style={{ color: club.color }} />
                  </div>
                  <h3 className="text-lg font-semibold">{club.title}</h3>
                </div>
                <motion.div 
                  animate={{ rotate: activeClub === club.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
              
              <AnimatePresence>
                {activeClub === club.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-100 space-y-4"
                  >
                    {club.content.map((line, i) => {
                      if (line.startsWith("⚠️") || line.startsWith("👯") || line.startsWith("🎓") || line.startsWith("💸") || line.startsWith("Crowd:") || line.startsWith("Vibe Check:") || line.startsWith("Entry fees:")) {
                        return (
                          <div key={i} className="mt-3">
                            <p className="font-medium text-gray-800">{line}</p>
                          </div>
                        );
                      } else {
                        return <p key={i} className="text-gray-600">{line}</p>;
                      }
                    })}
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm flex items-center"
                        style={{ backgroundColor: club.color }}
                      >
                        <FiMapPin className="mr-2" />
                        Find On Map
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
        
        {/* Other clubs included in Full Pass */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FiInfo className="w-5 h-5 mr-2 text-pink-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 font-bold">
              Other Clubs Included in Full Pass
            </span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'FreshmenClub', icon: GiPartyPopper, color: '#EC4899' },
              { name: 'AnotherSideclub', icon: IoMusicalNotesOutline, color: '#8B5CF6' },
              { name: 'FriendsClub', icon: FiUsers, color: '#3B82F6' },
              { name: 'DirtyHouseClub', icon: GiSpeaker, color: '#F97316' }
            ].map((club, index) => (
              <motion.div
                key={club.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + (index * 0.1) }}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100 group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110" 
                    style={{ 
                      backgroundColor: `${club.color}20`,
                      boxShadow: `0 0 0 0 ${club.color}50`,
                    }}
                  >
                    <club.icon className="w-5 h-5" style={{ color: club.color }} />
                  </div>
                  <p className="font-semibold text-gray-800 group-hover:text-gray-900">{club.name}</p>
                  <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Included in Full Pass</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Standalone Clubs Section */}
      <div className="space-y-5 mt-12">
        <motion.h2 
          className="text-xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          Other Popular Clubs in Shanghai
        </motion.h2>

        {/* Orii Feature Card - styled like Ins Park feature card but with different colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-blue-500 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-bold mb-3 flex items-center">
                <GiLightningArc className="w-6 h-6 mr-2" />
                Orii - Shanghai's K-Pop Paradise
              </h2>
              <p className="mb-4 text-emerald-100">
                This place opened in late 2022. Now it's where hiphop heads, K-Pop stans, and thirsty foreigners meet.
              </p>
              <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="font-medium flex items-center">
                  <FiMusic className="w-5 h-5 mr-2" />
                  <span>Music Vibe Check 🎵</span>
                </p>
                <div className="mt-2 space-y-2">
                  <p>🍹 Pre-midnight: Basic white girl hours with Bieber and Tay-Tay</p>
                  <p>🍹 Post-midnight: K-Pop 🔥</p>
                  <p>We're talking BLACKPINK drops that vibrate your soul (and other body parts), BTS tracks that make you forget you can't dance.</p>
                </div>
              </div>
              <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="font-medium flex items-center">
                  <FiUsers className="w-5 h-5 mr-2" />
                  <span>Crowd & Vibe 👀</span>
                </p>
                <div className="mt-2 space-y-2">
                  <p>90% hot people pretending they don't need oxygen</p>
                  <p>10% foreigners trying to pronounce "xièxie" (which means thank you btw)</p>
                  <p>and that one white guy yelling "NI HAO" at everyone 🥴</p>
                  <p>0-100% chance you'll grind on a stranger</p>
                </div>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="font-medium flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2" />
                  <span>Survival Guide 💸</span>
                </p>
                <div className="mt-2 space-y-2">
                  <p>Cover charge: ¥100 (weekdays) gets you entry + beer</p>
                  <p>Weekend ¥150 = price of pretending you like beer</p>
                  <p>Girls drink free! (Because the club knows who actually spends money 💅)😉</p>
                  <p>Final thought: It's basic, it's chaotic, and you'll 100% wake up with someone's lipstick on your collar</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white text-emerald-600 rounded-full text-sm font-medium flex items-center"
                >
                  <FiMapPin className="mr-2" />
                  Find On Map
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pro Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-10 p-5 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl"
      >
        <h3 className="text-lg font-bold flex items-center mb-3">
          <FiAlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
          Nightclub Pro Tips
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="bg-amber-500/20 p-1 rounded-full flex-shrink-0 mt-1 mr-2">
              <FiClock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span>Arrive before 10:30 PM to avoid the worst lines</span>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-500/20 p-1 rounded-full flex-shrink-0 mt-1 mr-2">
              <FiDollarSign className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span>The FULL pass is worth it if you plan to check out multiple clubs</span>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-500/20 p-1 rounded-full flex-shrink-0 mt-1 mr-2">
              <FiUsers className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span>Friday and Saturday nights get extremely packed - prepare for crowds</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
} 