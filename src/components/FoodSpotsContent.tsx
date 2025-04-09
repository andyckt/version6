'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCompass, FiInfo, FiClock, FiAlertTriangle, FiUsers, FiDollarSign, FiStar, FiCheck } from 'react-icons/fi'
import { GiNoodles, GiDumplingBao, GiHotSpices, GiChopsticks, GiShrimp, GiStarSwirl, GiWineGlass, GiBowlOfRice } from 'react-icons/gi'

type FoodTab = 'crab-noodles' | 'xiaolongbao' | 'hotpot' | 'chinese-cuisine' | 'affordable-seafood' | 'must-visit' | 'european' | 'korean'

export default function FoodSpotsContent() {
  const [activeTab, setActiveTab] = useState<FoodTab>('crab-noodles')

  // Helper function to render the formatted description
  const renderFormattedDescription = (description: string, spotName: string) => {
    if (spotName === 'Crab Noodles Lee (The OG Crab King)') {
      // For the detailed crab noodle description
      return (
        <div className="space-y-4">
          {/* Hot takes section */}
          <div>
            <div className="font-medium text-primary mb-2">My hot takes:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>🦀 Insane crab overload! Thick roe, generous crab meat, and that rich umami broth clinging to springy noodles? You'll be slurping till the last drop</div>
              <div>🎭 Catch their traditional dance shows if you're lucky - perfect pre-game before strolling the Bund right downstairs</div>
            </div>
          </div>
          
          {/* Location */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Prime real estate facing the Pearl Tower 🌃 - feast with Huangpu River views</div>
          </div>
          
          {/* Pro tip */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiClock className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Pro tip: Weekends get wild - budget 30+ mins in line ⏳</div>
          </div>
          
          {/* Must-try section */}
          <div>
            <div className="font-medium text-primary mb-2">Must-trys:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>🆓 Signature Crab Noodles - FREE noodle refills! (Because you'll want seconds)</div>
              <div>🦀🍚 Crab Fried Rice - Simple perfection - just fluffy rice dancing with crab goodness</div>
              <div>🍡 Shanghai Dessert Duo - QQ mochi balls & silky tofu pudding cut through the richness</div>
            </div>
          </div>
          
          {/* Alert */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>🚨 Crab season alert! Best Sept-Oct. Off-season roe can be funky - my October visit was 🔥 though</div>
          </div>
        </div>
      );
    } else if (spotName === 'Yu Xing Ji (Solid #2)') {
      // For Yu Xing Ji description
      return (
        <div className="space-y-4">
          {/* Line indication */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiUsers className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>The line out the door says it all 🚶♂️🚶♀️</div>
          </div>
          
          {/* Signature items */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-3">
            <div className="font-medium">Classic crab noodles loaded with roe & meat</div>
            <div>🖐️ Palm-sized soup dumplings with paper-thin skins - one bite releases an umami tsunami 🤤</div>
            <div>🥟 Crab xiaolongbao that'll make you question all previous dumpling experiences</div>
          </div>
          
          {/* Alert */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>Same crab season warning applies!</div>
          </div>
        </div>
      );
    } else if (spotName === 'Lai Lai Xiao Long (My Top 1)') {
      // For Lai Lai Xiao Long description
      return (
        <div className="space-y-4">
          {/* Michelin status */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiStar className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>This Michelin-starred joint lives in permanent queue mode - but worth it!</div>
          </div>
          
          {/* Signature items */}
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-primary/10 p-1.5 rounded-md mr-2 flex-shrink-0">
                <FiCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Pure Crab Roe XLB* 💸</div>
                <div className="text-gray-600 text-xs mt-0.5">Each bite feels like eating an entire crab! Rich AF - one's perfect (86RMB reality check)</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-1.5 rounded-md mr-2 flex-shrink-0">
                <FiCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Truffle Pork XLB*</div>
                <div className="text-gray-600 text-xs mt-0.5">That first bite of truffle-kissed broth? Chef's kiss 💋 (39RMB steal)</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-1.5 rounded-md mr-2 flex-shrink-0">
                <FiCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Golden Fried Pork Chop*</div>
                <div className="text-gray-600 text-xs mt-0.5">Crispy/crunchy/juicy holy trinity 🌈 Dip in chili oil for maximum slay</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === 'Chan San Chi (Solid #2)') {
      // For Chan San Chi description
      return (
        <div className="space-y-4">
          <div className="font-medium text-primary mb-1">I always order the Crab Family set</div>
          
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div className="flex items-center">
              <div className="text-lg mr-1.5">🥇</div>
              <div>Crab Xiao Long Bao</div>
            </div>
            <div className="flex items-center">
              <div className="text-lg mr-1.5">🥈</div>
              <div>Crab Noodles</div>
            </div>
            <div className="flex items-center">
              <div className="text-lg mr-1.5">🥉</div>
              <div>Crab Wontons - soup's so good you'll sip the bowl</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === 'Nan Xiang (Solid #3)') {
      // For Nan Xiang description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiClock className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Century-old institution - no reservations, just old school queues</div>
          </div>
          
          {/* Signature items */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-3">
            <div>
              <div className="font-medium">🦀 Crab Roe XLB</div>
              <div className="text-xs text-gray-600 mt-0.5">Watch them make it fresh! Zero腥味 (none of that fishy biz) - all pure crab luxury</div>
            </div>
            <div>
              <div className="font-medium">🥤 Crab Soup Dumplings</div>
              <div className="text-xs text-gray-600 mt-0.5">STRAW-required experience! The broth alone will have you weak in the knees 😵</div>
            </div>
          </div>
          
          {/* Alert */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>Same seasonal warning - autumn visits recommended!</div>
          </div>
        </div>
      );
    } else if (spotName === '🇪🇸 Don Quixote (Best Espanol food)') {
      // For Don Quixote description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>Wandering guitarists playing Despacito on loop, yes, on loopS 🎸</div>
            <div>Birthday celebrations 🎂 (they'll surprise you with guitar Happy Birthday!)</div>
          </div>
          
          {/* Must-try section */}
          <div>
            <div className="font-medium text-primary mb-2">Must-try or STFU:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Seafood Paella 🥘 - Saffron rice loaded with crustaceans 🦐 (Tastes like Barcelona beach day)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Honey Octopus 🐙 - Sweet & nutty flavor bomb! 🐙 (Weirdly addictive)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Angus Beef Steak 🥩 - So juicy you'll wanna lick the plate like how your boyfriend licks his armpit</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Sword Skewers - Cheesy, juicy, Instagram-famous ⚔️ (Instagram gold)</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-gray-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Btw: The bookshelf is rotating, idk , kinda cool</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro Tip: Come hungry – portions could feed the Federal Government</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🇮🇹 Grande A\'moo (Italian MVP)') {
      // For Grande A'moo description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>This place is straight fire 🔥 with:</div>
            <div>Chill industrial vibes 🏭</div>
            <div>Servers who actually smile 😊</div>
          </div>
          
          {/* Must-try section */}
          <div>
            <div className="font-medium text-primary mb-2">Must-try or STFU:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Cheese Wheel Pasta 🧀 - Watch them mix it in a giant cheese wheel!</div>
              <div>Chili Oil Noodles 🌶️ - Mix that egg yolk in STAT! (Warning: Addictive)</div>
              <div>Black Truffle Pizza 🍕 - honestly, no complain</div>
              <div>Tiramisu ☁️ - So good you'll wanna slap your boyfriend's ass</div>
            </div>
          </div>
          
          {/* Secret Menu */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Secret Menu: Ask for extra cheese wheel scrapings – beat his ass off if the server says no</div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Btw: Split dishes - portions are generous!</div>
          </div>
        </div>
      );
    } else if (spotName === '🇮🇹 OTF Sicilia (Insta-Worthy Italian)') {
      // For OTF Sicilia description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Perfect for taking food pics, not dick pics</div>
          </div>
          
          {/* Must-try items */}
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                <FiCheck className="w-4 h-4" />
              </div>
              <div>Cute kids' meals 👶🍴 (seriously adorable)</div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                <FiCheck className="w-4 h-4" />
              </div>
              <div>Crispy "Roast" Chicken 🍗 (Spoiler: It's actually fried AF)</div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                <FiCheck className="w-4 h-4" />
              </div>
              <div>Lemon Ice Cream 🍨 - Comes with actual frozen lemon chunks!</div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                <FiCheck className="w-4 h-4" />
              </div>
              <div>Colorful Lattes - For basic Insta bitches ☕🌈</div>
            </div>
          </div>
          
          {/* Warning */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>Heads up: Tight seating – maybe skip if you're claustrophobic, google it if you dun know what it is 😅</div>
          </div>
        </div>
      );
    } else if (spotName === '🍸 COMMUNE RESERVE (Best Bang for Buck)') {
      // For COMMUNE RESERVE description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div>
            <div className="font-medium text-primary mb-2">Where to go when:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>You're STARVING 🤤 (portions are HUGE)</div>
              <div>Where portions are XL and prices aren't 💸</div>
              <div>You want drinks + food + vibes 🍹</div>
            </div>
          </div>
          
          {/* Must-try items */}
          <div>
            <div className="font-medium text-primary mb-2">Must-try or STFU:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Black Truffle Pizza - Smells like rich people's laundry 🧺</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Beef Cheek Pasta 🐮 - Sauce so good you'll wanna drink it</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Sweet & Spicy Ribs 🍖 - Fall-off-the-bone tender</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Burrata Salad 🧀 - Fancy AF but worth it</div>
              </div>
            </div>
          </div>
          
          {/* Bonus info */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Bonus: 👀 Hot waitstaff alert! 👀 No need Tinder anymore</div>
          </div>
        </div>
      );
    } else if (spotName === '🌙 Lunette By Amanda (Our #1 French Crush)') {
      // For Lunette By Amanda description
      return (
        <div className="space-y-4">
          {/* Must-try section */}
          <div>
            <div className="font-medium text-primary mb-2">Must-try or STFU:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-3">
              <div>
                <div className="font-medium">🔥 Signature Wellington Beef 🔥</div>
                <div className="text-sm mt-1">Crispy outside, juicy inside – the beef melts in your mouth 🥩✨</div>
                <div className="text-sm mt-1">Pro tip: Comes with PARMA ham + FAT duck liver + truffle sauce + caviar = makes me horny</div>
              </div>
              <div>
                <div className="font-medium">🍽️ King Crab Risotto 🦀</div>
                <div className="text-sm mt-1">Sweet crab meat + creamy rice = instant food coma 😴💖</div>
              </div>
            </div>
          </div>
          
          {/* Views and features */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Perfect date spot with killer river views 🌃 (actually, it's kinda cool looking at the Oriental Pearl Tower!)</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we love it:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Service that actually makes you feel special 🎂 (they remembered my birthday!)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Best view in town</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🎁 Birthday freebies (cake + rose petals!)</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Request window seats 2 weeks ahead 📅</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🍆Bring your girlfriend, don't bring your one-time Tinder date, not worth the mone</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === 'Restaurant Cuivre (French Grandma\'s Kitchen)') {
      // For Restaurant Cuivre description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>🇫🇷 French-owned hidden place that's been slaying for 10+ years!</div>
            <div>No stuffy vibes – just chill bistro energy 🍷</div>
          </div>
          
          {/* Must-try section */}
          <div>
            <div className="font-medium text-primary mb-2">Must-trys or STFU:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Beef Tartare 🥩: Comes with bagel chips (portion's HUGE!)</div>
              <div>Duck Liver Pâté 🦆: Like ice cream but better – spread that goodness!</div>
              <div>Goat Cheese Salad 🧀: Holy moly, this combo slaps! 🥗💥</div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-gray-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Say "c'est magnifique" wrong on purpose – let them correct you 😏🗣️</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>No-reservations hack: Come at 6PM for early-bird seats 🐦</div>
            </div>
          </div>
          
          {/* Perks */}
          <div>
            <div className="font-medium text-primary mb-2">Perks:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>💰 Great prices (about ¥280/person)</div>
              <div>🕯️ Romantic lighting = perfect for anniversaries 💑</div>
              <div>👨🍳 80% French customers = authenticity guarantee!</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === 'Jean Georges 🌟 (Fancy Date Night)') {
      // For Jean Georges description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>Michelin-starred with epic Bund views 🌉</div>
            <div>White marble everywhere 📸</div>
            <div>Lunch deal alert! 🚨 4-course meal under ¥400 = steal!</div>
          </div>
          
          {/* Food highlights */}
          <div>
            <div className="font-medium text-primary mb-2">🍽️ Food Highlights:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Sea Urchin Toast 🌊: Fresh AF with crispy bread</div>
              <div>Lobster & Corn 🦞: Butter-soft meat with zesty lime kick</div>
              <div>Duck breast thiccer than your gym crush 🦆🍑</div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Free birthday cake = edible hint to put a ring on it 💍🎂</div>
            </div>
          </div>
          
          {/* Little tips */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Little tips: Light colors for IG-worthy shots 📸</div>
          </div>
        </div>
      );
    } else if (spotName === 'Hoxa Bistro 🏜️ (Xinjiang Chic)') {
      // For Hoxa Bistro description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>This is actually one of my favourite spots for pictures taking, and it's got good food too, duhhh.</div>
          </div>
          
          {/* Photo zones */}
          <div>
            <div className="font-medium text-primary mb-2">Free photo zones:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>🏜️ Desert-themed rooftop with full frontal Oriental Pearl view (open for pics, no dining needed)</div>
              <div>🪔 Lantern-lit corridor with mosaic floors</div>
            </div>
          </div>
          
          {/* Pro tip */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Pro tip: Borrow their embroidered cushions as props</div>
          </div>
        </div>
      );
    } else if (spotName === 'Early Morning BBQ 🥩 (Top 1 Korean Spot)') {
      // For Early Morning BBQ description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>One of my own Shanghai's Must-Eat List!</div>
          </div>
          
          {/* Pro tip */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Pro tip: Let their 🔥hot grill masters handle the cooking (they switch servers for different meats like it's Michelin-star service!). Just sit back, enjoy the skyline views of Lujiazui's "Three Giants" 🌆, and try not to drool...</div>
          </div>
          
          {/* Must-tries */}
          <div>
            <div className="font-medium text-primary mb-2">Must-tries or STFU:</div>
            <div className="space-y-3">
              <div>
                <div className="font-medium">🥩 Signature Sirloin</div>
                <div className="text-sm mt-1">Perfect medium-rare every time 🎯 Juicy AF with just salt & pepper - could rival any steakhouse!</div>
              </div>
              <div>
                <div className="font-medium">🧅 Secret Onion Dip</div>
                <div className="text-sm mt-1">The MVP sauce! Sweet-spicy magic that makes every bite better 🌟 (PSA: Only found here!)</div>
              </div>
              <div>
                <div className="font-medium">🦑 Charcoal Squid</div>
                <div className="text-sm mt-1">Shanghai's crispest squid - that satisfying crunch then sweet aftertaste? 🤯</div>
              </div>
              <div>
                <div className="font-medium">🥓 Beef Belly</div>
                <div className="text-sm mt-1">Melt-in-your-mouth goodness 🤤 Pair with their onion sauce for flavor fireworks!</div>
              </div>
            </div>
          </div>
          
          {/* Pro tip */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Pro tip: Request the window seat for IG-worthy meat+skyline shots 📸</div>
          </div>
        </div>
      );
    } else if (spotName === 'Choga Soy Sauce Crab 🦀 (Top 2 Korean)') {
      // For Choga description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Hidden spot at Korea Street! Perfect date spot with killer crab 🦀💘</div>
          </div>
          
          {/* Must-try items */}
          <div className="space-y-3">
            <div>
              <div className="font-medium">🌶️ Spicy Raw Crab</div>
              <div className="text-sm mt-1">Heavy spicy but addictively good 🔥 Perfect with rice balls - just let the staff handle the messy work!</div>
            </div>
            <div>
              <div className="font-medium">🐟 Live Eel BBQ</div>
              <div className="text-sm mt-1">Crispy skin + tender flesh = pure happiness 😇 Comes with 4 dipping sauces for maximum flavor!</div>
            </div>
          </div>
          
          {/* Warning */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>Warning: Spicy crab requires milk standby 🥛</div>
          </div>
        </div>
      );
    } else if (spotName === 'Fafu Korean BBQ 🍖 (Top 3)') {
      // For Fafu Korean BBQ description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Where K-pop stars eat! Pro tip: Come at 5PM sharp or prepare to queue 🕔</div>
          </div>
          
          {/* Must-try items */}
          <div className="space-y-3">
            <div>
              <div className="font-medium">🐷 Thick-cut Pork Belly</div>
              <div className="text-sm mt-1">Crispy meets juicy 🤩 Wrap in lettuce with grilled pineapple - sweet/savory heaven!</div>
            </div>
            <div>
              <div className="font-medium">🦐 Seafood Pancake</div>
              <div className="text-sm mt-1">Extra thicc & crispy-edged perfection 🤤 We always order 2 sets!</div>
            </div>
            <div>
              <div className="font-medium">🧀 Grilled Cheese Wrap</div>
              <div className="text-sm mt-1">Think cheesy meat burrito meets Korean BBQ 🧀🥩 Mind = blown</div>
            </div>
          </div>
          
          {/* Hack */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Hack: Book 1 week ahead via 📞 (They're strict about full-party seating!)</div>
          </div>
        </div>
      );
    } else if (spotName === 'Nabi 🦋 (Foodie Holy Grail)') {
      // For Nabi description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>Shanghai's hardest-to-book Korean fine dining! Only 16 seats with butterfly-themed everything 🦋✨</div>
            <div>12-course tasting menu changes seasonally 🍽️ Chef Tom (aka "Korean Gong Yoo") serves artsy dishes that look too pretty to eat... until you taste them 😍</div>
          </div>
          
          {/* Highlights */}
          <div>
            <div className="font-medium text-primary mb-2">¥1500+ 12-course adventure:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>👨🍳 Chef Tom's smile (worth 30% of the price)</div>
              <div>🍠 Sweet Potato Ice Cream - Mind-blowing texture play</div>
              <div>🍜 Hidden Ramen - Surprise midnight snack vibes</div>
            </div>
          </div>
          
          {/* Hidden bonus */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Hidden bonus: Secret seafood ramen & rice cakes!</div>
          </div>
          
          {/* Pro Tips */}
          <div className="space-y-2">
            <div className="bg-amber-50 p-2 rounded-lg flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Reservation warfare: Set monthly alarm for 1st 00:00 ⏰</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>💰 Pro Tips: Tiny portions but huge experience.</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🍤 Da Bao Kou Fu (Affordable Seafood Heaven)') {
      // For Da Bao Kou Fu description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Where you get lit on crustaceans without selling a kidney 💸</div>
          </div>
          
          {/* Vibe Check */}
          <div>
            <div className="font-medium text-primary mb-2">Vibe Check:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Chaotic seafood market energy 🦞 (Bring your loudest friends)</div>
              <div>Weekend waits? Worth it for those portion sizes – holy shit 😱</div>
              <div>Free-flow watermelon that'll make you question your grocery store choices 🍉</div>
            </div>
          </div>
          
          {/* Must-eat section */}
          <div>
            <div className="font-medium text-primary mb-2">Must-Eat or STFU:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Crab + Rice Cake Gangbang 🦀 - Sticky AF with more膏 than a K-pop fan convention</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Crispy AF Shrimp 🍤 - Eat the whole damn thing shell-and-all (crunchgasm guaranteed)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Sea Worm Rice - Sounds gross, tastes like umami punched you in the face 👊</div>
              </div>
            </div>
          </div>
          
          {/* Secret weapon */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Secret Weapon: That steamed fish so fresh it's basically still swimming 🐟</div>
          </div>
          
          {/* Free Shit Alert */}
          <div>
            <div className="font-medium text-primary mb-2">Free Shit Alert:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>🍦 Unlimited ice cream (Pro move: Make affogato with their espresso shot)</div>
              <div>🍫 Chocolate Dumplings - Basically legal heroin for dessert hoes</div>
            </div>
          </div>
          
          {/* Pro Tips */}
          <div>
            <div className="font-medium text-primary mb-2">Pro Tips:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Come hungry or get wrecked – portions could feed a small army</div>
              <div>4+ crew = Taste everything without food coma</div>
              <div>Wear stretchy pants – you'll need 'em after that rice cake mountain</div>
              <div>Take leftovers for next-day flexing ("Look ma, I adulted!")</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🔥 Chongqing Banquet Hotpot (Iconic Views Alert!)') {
      // For Chongqing Banquet Hotpot description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Prime view of the Oriental Pearl Tower while dipping meats with friends = ultimate vibe check ✅</div>
            <div className="mt-2">This riverside spot gives you front-row seats to the Bund's glittering skyline 🌃 – the Oriental Pearl Tower looks close enough to high-five!</div>
          </div>
          
          {/* Pro tip */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>Pro tip: Book their only full-window table (1 week advance, minimum spend required) for proposal-worthy moments 😉</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we ❤️ it:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>120-year-old intangible cultural heritage broth recipe 👵🏮</div>
              <div>Staff will literally cook your food for you (hello, VIP treatment! 👑)</div>
              <div>Insta-bait interior with magic night shows Wed-Fri ✨🎩</div>
            </div>
          </div>
          
          {/* Instagram spots */}
          <div>
            <div className="font-medium text-primary mb-2">Snap Insta-worthy shots:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>📸 Wear light colors against the skyline backdrop</div>
              <div>📸 Capture "Magic Hotpot Nights" with performing magicians</div>
            </div>
          </div>
          
          {/* Must-Order */}
          <div>
            <div className="font-medium text-primary mb-2">Must-Order:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Supreme Beef Platter - Meat lover's ASMR</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Luxury Seafood Tower - For when you wanna eat like a K-drama CEO</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🥇 Qingting Fresh Hotpot (Our #1 Hotpot Pick)') {
      // For Qingting Fresh Hotpot description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Where foodies get quality without breaking the bank 💸</div>
          </div>
          
          {/* Price and Time */}
          <div className="bg-gray-50 p-2 rounded-lg flex justify-between">
            <div className="flex items-center">
              <FiDollarSign className="w-4 h-4 mr-1.5 text-gray-500" />
              <span>~150RMB/person</span>
            </div>
            <div className="flex items-center">
              <FiClock className="w-4 h-4 mr-1.5 text-gray-500" />
              <span>Always busy (expect 1hr queues)</span>
            </div>
          </div>
          
          {/* Highlights */}
          <div>
            <div className="font-medium text-primary mb-2">Highlights:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Tea master performance at your table 🫖 (that pour game though!)</div>
              <div>CRISP-EEEST tripe you'll ever taste 🤤</div>
              <div>Free flow fresh fruits & fragrant teas 🍉🍍</div>
              <div>Customizable spice levels 🌶️ (newbie-friendly!)</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🥈 Seafood Wong Hotpot (Budget King 👑)') {
      // For Seafood Wong Hotpot description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Personal mini pots = no fighting over broth choices!</div>
          </div>
          
          {/* Price and Highlight */}
          <div className="bg-gray-50 p-2 rounded-lg flex justify-between">
            <div className="flex items-center">
              <FiDollarSign className="w-4 h-4 mr-1.5 text-gray-500" />
              <span>10-15RMB/dishes</span>
            </div>
            <div className="flex items-center">
              <span>🦀 Full膏 crab alert!</span>
            </div>
          </div>
          
          {/* Win-win deal */}
          <div>
            <div className="font-medium text-primary mb-2">Win-win deal:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Individual pots from 12RMB 🍲</div>
              <div>MASSIVE oysters & taro that melts like butter 🦪🍠</div>
              <div>Oysters bigger than your phone 📱</div>
            </div>
          </div>
          
          {/* Secret Menu */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>💡 Secret Menu: Ask for garlic butter dipping sauce – life-changing!</div>
          </div>
        </div>
      );
    } else if (spotName === '🥉 Banu Tripe Hotpot (24/7 Legend ⏰)') {
      // For Banu Tripe Hotpot description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>For birthday freebies!!!</div>
          </div>
          
          {/* Birthday hacks */}
          <div className="bg-amber-50 p-2 rounded-lg flex items-start">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
            <div>🎂 Birthday hacks: Free tiger prawn longevity noodles 🍜🍤 (Total flex for IG stories)</div>
          </div>
          
          {/* Must-tries */}
          <div>
            <div className="font-medium text-primary mb-2">Must-tries:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Mushroom broth that'll make you wanna slap the table 🍄👏</div>
              <div>New Zealand tripe cooked tableside (15sec timer included! ⏲️)</div>
              <div>Unlimited fruit bar & DIY sauce station 🍇🍈</div>
            </div>
          </div>
          
          {/* Pro Tip */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Pro Tip: Their veggie platter &gt; meat. Fight me. 🥬</div>
          </div>
        </div>
      );
    } else if (spotName === '🌶️ Two Hotpot (Spice Lord Challenge 🔥)') {
      // For Two Hotpot description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 mb-2">
            <div>Not for basic taste buds!</div>
          </div>
          
          {/* What's good */}
          <div>
            <div className="font-medium text-primary mb-2">What's good:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Retro 90s Chongqing vibes 📺</div>
              <div>Braised Beef that falls apart like 🔥</div>
              <div>Ice glutinous balls = spicy salvation 🍡</div>
            </div>
          </div>
          
          {/* Warnings */}
          <div className="space-y-2">
            <div className="bg-amber-50 p-2 rounded-lg flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>⚠️ Warning: Their "mild" = Shanghai's "extra spicy"</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Heads up: This ain't your basic hotpot – expect pig trotters, tendons, and intestines! 🐷</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === 'Manner Coffee ☕ (Broke Girl\'s Bund)') {
      // For Manner Coffee description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold text-center italic">"Price of a coffee = $100m worth of view" 💬</div>
          </div>
          
          {/* Photo shots guide */}
          <div>
            <div className="font-medium text-primary mb-2">Instagram Playbook:</div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-primary/10 p-1.5 rounded-md mr-2 flex-shrink-0 text-primary font-bold">
                  1
                </div>
                <div>
                  <div className="font-medium">Glass Wall Lean</div>
                  <div className="text-sm mt-1">Pudong skyline behind you (casual flex) 😎</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-1.5 rounded-md mr-2 flex-shrink-0 text-primary font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium">Reflection Shot</div>
                  <div className="text-sm mt-1">Coffee cup + river reflection = accidental art student vibes 🎨</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-1.5 rounded-md mr-2 flex-shrink-0 text-primary font-bold">
                  ⭐
                </div>
                <div>
                  <div className="font-medium">Secret Level: Staircase</div>
                  <div className="text-sm mt-1">Makes legs look 2m long 👯♀️</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Best times */}
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="font-medium mb-1">Prime Hours:</div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <FiClock className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                <span>7-9AM: Foggy mystique 🌫️</span>
              </div>
              <div className="flex items-center">
                <FiClock className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                <span>8PM: Light show backdrop ✨</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === 'Manner Coffee (Guoke Riverside) ☕️') {
      // For Manner Coffee Guoke Riverside description
      return (
        <div className="space-y-4">
          {/* Why it slays */}
          <div>
            <div className="font-medium text-primary mb-2">Skyline Features:</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center text-center">
                <div className="text-xl mb-1">🏙️</div>
                <div className="text-xs">Oriental Pearl Tower</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center text-center">
                <div className="text-xl mb-1">🚢</div>
                <div className="text-xs">Huangpu River Cruises</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center text-center">
                <div className="text-xl mb-1">🌉</div>
                <div className="text-xs">Nanpu Bridge View</div>
              </div>
            </div>
          </div>
          
          {/* Secret spots */}
          <div>
            <div className="font-medium text-primary mb-2">Insider Photo Spots:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div className="flex items-center">
                <div className="text-lg mr-2">🪑</div>
                <div>Glass walkway that makes you float above the river</div>
              </div>
              <div className="flex items-center">
                <div className="text-lg mr-2">🌅</div>
                <div>Sunrise golden hour magic (6-7AM crowd-free!)</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
            <div className="font-medium mb-2">Pro Strategies:</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-primary flex-shrink-0" />
                <div><span className="font-medium">Coffee hack:</span> ¥15 latte = photo permit 📷</div>
              </div>
              <div className="flex items-start">
                <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-primary flex-shrink-0" />
                <div><span className="font-medium">Outfit plan:</span> Wear monochrome for contrast with the colorful view</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🥇 Oriental House (Best Date Night)') {
      // For Oriental House description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>Where 90s bops meet Insta-worthy plates 🎶</div>
            <div>🔥 Hot Picks:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>✅ Crispy Beef - Imagine beef candy with black pepper glaze 🤤</div>
              <div>✅ Sea Worm Noodles (Don't think, just eat!) - Umami bomb in a bowl 🍜</div>
            </div>
            <div className="text-sm mt-1">💃 Vibe Check:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Mid-2000s club playlist (Britney vibes!) 💿</div>
              <div>Modern luxe interior perfect for "casual flex" pics 📸</div>
            </div>
            <div className="text-sm mt-1">Prepare for lunch queues – bring your best gossip to kill time 💅</div>
          </div>
          
          {/* Views and features */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Perfect date spot with killer river views 🌃 (actually, it's kinda cool looking at the Oriental Pearl Tower!)</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we love it:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Service that actually makes you feel special 🎂 (they remembered my birthday!)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Best view in town</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🎁 Birthday freebies (cake + rose petals!)</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Request window seats 2 weeks ahead 📅</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🍆Bring your girlfriend, don't bring your one-time Tinder date, not worth the mone</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🦀 Cheng Long Hang (Crab Lovers\' Church)') {
      // For Cheng Long Hang description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>Michelin-starred crustacean worship 🙏</div>
            <div>Crab Commandments:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>1️⃣ Golden Crab Fat Rice - 100% pure crab orgasm (portion control is key!) 🍚💛</div>
              <div>2️⃣ Crab Roe Dumplings - Bite-sized liquid gold 🥟</div>
              <div>3️⃣ Crispy Chicken - 20-year recipe that slaps harder than your ex 👋</div>
            </div>
            <div className="text-sm mt-1">⚠️ Warning: Ordering multiple crab dishes = food coma risk! 💤</div>
          </div>
          
          {/* Views and features */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Perfect date spot with killer river views 🌃 (actually, it's kinda cool looking at the Oriental Pearl Tower!)</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we love it:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Service that actually makes you feel special 🎂 (they remembered my birthday!)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Best view in town</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🎁 Birthday freebies (cake + rose petals!)</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Request window seats 2 weeks ahead 📅</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🍆Bring your girlfriend, don't bring your one-time Tinder date, not worth the mone</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🎭 Shi He Yuan (Peking Duck Theater)') {
      // For Shi He Yuan description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>Where dinner becomes performance art 🦆✨</div>
            <div className="text-sm mt-1">Michelin Magic:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Duck Three Ways - Caviar-topped skin = edible jewelry 💎</div>
              <div>Pear-Shrimp Tango - Fruit meets seafood in a flavor mosh pit 🍐🦐</div>
              <div>Fish Head + Oil Stick - Carb-loaded comfort food heaven 🥖</div>
            </div>
            <div className="text-sm mt-1">Pro Move: Book balcony seats for陆家嘴三件套 backdrop 🌆 (100% Tinder profile upgrade)</div>
          </div>
          
          {/* Views and features */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Perfect date spot with killer river views 🌃 (actually, it's kinda cool looking at the Oriental Pearl Tower!)</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we love it:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Service that actually makes you feel special 🎂 (they remembered my birthday!)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Best view in town</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🎁 Birthday freebies (cake + rose petals!)</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Request window seats 2 weeks ahead 📅</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🍆Bring your girlfriend, don't bring your one-time Tinder date, not worth the mone</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🦀 Loong Dock (Crab Wonderland)') {
      // For Loong Dock description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>For when you wanna eat like a seafood tycoon 💰</div>
            <div className="text-sm mt-1">Sugar Daddy Specials:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Drunken Giant Shrimp - Size matters here 🍤👀</div>
              <div>Lobster-Crab Fusion - Two luxuries for the price of... well, two 😅</div>
            </div>
            <div className="text-sm mt-1">💰 Damage Control: Skip the king crab unless it's bonus season!</div>
          </div>
          
          {/* Views and features */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Perfect date spot with killer river views 🌃 (actually, it's kinda cool looking at the Oriental Pearl Tower!)</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we love it:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Service that actually makes you feel special 🎂 (they remembered my birthday!)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Best view in town</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🎁 Birthday freebies (cake + rose petals!)</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Request window seats 2 weeks ahead 📅</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🍆Bring your girlfriend, don't bring your one-time Tinder date, not worth the mone</div>
            </div>
          </div>
        </div>
      );
    } else if (spotName === '🦆 Sheng Yong Xing (Duck Drama)') {
      // For Sheng Yong Xing description
      return (
        <div className="space-y-4">
          {/* Intro */}
          <div className="pl-1 border-l-2 border-primary/20 space-y-2">
            <div>View &gt; Food (But that duck tho...)</div>
            <div className="text-sm mt-1">Controversial Take:</div>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2">
              <div>Caviar Duck = Worth the hype (and price) 💸</div>
              <div>Other dishes = Fancy background actors 🎭</div>
            </div>
            <div className="text-sm mt-1">Bund views make even mediocre food photogenic 🌃</div>
          </div>
          
          {/* Views and features */}
          <div className="bg-gray-50 p-2 rounded-lg flex items-start">
            <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
            <div>Perfect date spot with killer river views 🌃 (actually, it's kinda cool looking at the Oriental Pearl Tower!)</div>
          </div>
          
          {/* Why we love it */}
          <div>
            <div className="font-medium text-primary mb-2">Why we love it:</div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Service that actually makes you feel special 🎂 (they remembered my birthday!)</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>Best view in town</div>
              </div>
            </div>
          </div>
          
          {/* Pro tips */}
          <div className="bg-amber-50 p-2 rounded-lg space-y-2">
            <div className="flex items-start">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
              <div>Tell them it's your birthday, even if it's not your birthday, but in advance, when you call to reserve</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🎁 Birthday freebies (cake + rose petals!)</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>Pro tip: Request window seats 2 weeks ahead 📅</div>
            </div>
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
              <div>🍆Bring your girlfriend, don't bring your one-time Tinder date, not worth the mone</div>
            </div>
          </div>
        </div>
      );
    } else {
      // For regular descriptions, keep the simple format
      return description.split('\n').map((line, i) => (
        <div key={i} className={i > 0 ? 'mt-2' : ''}>
          {line}
          </div>
      ));
    }
  };

  const foodTabs = [
    { id: 'crab-noodles', label: 'Crab Noodles', icon: GiNoodles },
    { id: 'xiaolongbao', label: 'Xiaolongbao', icon: GiDumplingBao },
    { id: 'hotpot', label: 'Hotpot', icon: GiHotSpices },
    { id: 'chinese-cuisine', label: 'Chinese Cuisine', icon: GiChopsticks },
    { id: 'affordable-seafood', label: 'Affordable Seafood', icon: GiShrimp },
    { id: 'must-visit', label: 'Regret if You Don\'t Go', icon: GiStarSwirl },
    { id: 'european', label: 'European Food', icon: GiWineGlass },
    { id: 'korean', label: 'Korean Spots', icon: GiBowlOfRice },
  ]

  // Placeholder restaurant data for each tab
  const foodSpots = {
    'crab-noodles': [
      { name: 'Crab Noodles Lee (The OG Crab King)', location: 'Jing\'an District', description: 'My hot takes:\n🦀 Insane crab overload! Thick roe, generous crab meat, and that rich umami broth clinging to springy noodles? You\'ll be slurping till the last drop\n🎭 Catch their traditional dance shows if you\'re lucky - perfect pre-game before strolling the Bund right downstairs\nPrime real estate facing the Pearl Tower 🌃 - feast with Huangpu River views\nPro tip: Weekends get wild - budget 30+ mins in line ⏳\nMust-trys:\n🆓 Signature Crab Noodles - FREE noodle refills! (Because you\'ll want seconds)\n🦀🍚 Crab Fried Rice - Simple perfection - just fluffy rice dancing with crab goodness\n🍡 Shanghai Dessert Duo - QQ mochi balls & silky tofu pudding cut through the richness\n🚨 Crab season alert! Best Sept-Oct. Off-season roe can be funky - my October visit was 🔥 though' },
      { name: 'Yu Xing Ji (Solid #2)', location: 'Huangpu District', description: 'The perpetual line out the door says it all 🚶♂️🚶♀️\nClassic crab noodles loaded with roe & meat\n🖐️ Palm-sized soup dumplings with paper-thin skins - one bite releases an umami tsunami 🤤\n🥟 Crab xiaolongbao that\'ll make you question all previous dumpling experiences\nSame crab season warning applies!' }
    ],
    'xiaolongbao': [
      { name: 'Lai Lai Xiao Long (My Top 1)', location: 'Huangpu District', description: 'This Michelin-starred joint lives in permanent queue mode - but worth it!\nPure Crab Roe XLB* 💸\nEach bite feels like eating an entire crab! Rich AF - one\'s perfect (86RMB reality check)\nTruffle Pork XLB*\nThat first bite of truffle-kissed broth? Chef\'s kiss 💋 (39RMB steal)\nGolden Fried Pork Chop*\nCrispy/crunchy/juicy holy trinity 🌈 Dip in chili oil for maximum slay' },
      { name: 'Chan San Chi (Solid #2)', location: 'Multiple Locations', description: 'I always order the Crab Family set\n🥇 Crab Xiao Long Bao\n🥈 Crab Noodles\n🥉 Crab Wontons - soup\'s so good you\'ll sip the bowl' },
      { name: 'Nan Xiang (Solid #3)', location: 'Multiple Locations', description: 'Century-old institution - no reservations, just old school queues\n🦀 Crab Roe XLB\nWatch them make it fresh! Zero腥味 (none of that fishy biz) - all pure crab luxury\n🥤 Crab Soup Dumplings\nSTRAW-required experience! The broth alone will have you weak in the knees 😵\nSame seasonal warning - autumn visits recommended!' }
    ],
    'hotpot': [
      { name: '🔥 Chongqing Banquet Hotpot (Iconic Views Alert!)', location: 'The Bund', description: 'Prime view of the Oriental Pearl Tower while dipping meats with friends = ultimate vibe check ✅\nThis riverside spot gives you front-row seats to the Bund\'s glittering skyline 🌃 – the Oriental Pearl Tower looks close enough to high-five! Pro tip: Book their only full-window table (1 week advance, minimum spend required) for proposal-worthy moments 😉\nWhy we ❤️ it:\n120-year-old intangible cultural heritage broth recipe 👵🏮\nStaff will literally cook your food for you (hello, VIP treatment! 👑)\nInsta-bait interior with magic night shows Wed-Fri ✨🎩\nSnap Insta-worthy shots:\n📸 Wear light colors against the skyline backdrop\n📸 Capture "Magic Hotpot Nights" with performing magicians\n\nMust-Order:\n✅ Supreme Beef Platter - Meat lover\'s ASMR\n✅ Luxury Seafood Tower - For when you wanna eat like a K-drama CEO' },
      { name: '🥇 Qingting Fresh Hotpot (Our #1 Hotpot Pick)', location: 'Former French Concession', description: 'Where foodies get quality without breaking the bank 💸\n💰 ~150RMB/person | 🕒 Always busy (expect 1hr queues)\nHighlights:\nTea master performance at your table 🫖 (that pour game though!)\nCRISP-EEEST tripe you\'ll ever taste 🤤\nFree flow fresh fruits & fragrant teas 🍉🍍\nCustomizable spice levels 🌶️ (newbie-friendly!)' },
      { name: '🥈 Seafood Wong Hotpot (Budget King 👑)', location: 'Hongkou District', description: 'Personal mini pots = no fighting over broth choices!\n💰 10-15RMB/dishes | 🦀 Full膏 crab alert!\nWin-win deal:\nIndividual pots from 12RMB 🍲\nMASSIVE oysters & taro that melts like butter 🦪🍠\nOysters bigger than your phone 📱\n💡 Secret Menu: Ask for garlic butter dipping sauce – life-changing!' },
      { name: '🥉 Banu Tripe Hotpot (24/7 Legend ⏰)', location: 'Jing\'an District', description: 'For birthday freebies!!!\n🎂 Birthday hacks: Free tiger prawn longevity noodles 🍜🍤 (Total flex for IG stories)\nMust-tries:\nMushroom broth that\'ll make you wanna slap the table 🍄👏\nNew Zealand tripe cooked tableside (15sec timer included! ⏲️)\nUnlimited fruit bar & DIY sauce station 🍇🍈\nPro Tip: Their veggie platter &gt; meat. Fight me. 🥬' },
      { name: '🌶️ Two Hotpot (Spice Lord Challenge 🔥)', location: 'Xuhui District', description: 'Not for basic taste buds!\nWhat\'s good:\nRetro 90s Chongqing vibes 📺\nBraised Beef that falls apart like 🔥\nIce glutinous balls = spicy salvation 🍡\n⚠️ Warning: Their "mild" = Shanghai\'s "extra spicy"\nHeads up: This ain\'t your basic hotpot – expect pig trotters, tendons, and intestines! 🐷' }
    ],
    'chinese-cuisine': [
      { name: '🥇 Oriental House (Best Date Night)', location: 'Pudong', description: 'Where 90s bops meet Insta-worthy plates 🎶\n🔥 Hot Picks:\n✅ Crispy Beef - Imagine beef candy with black pepper glaze 🤤\n✅ Sea Worm Noodles (Don\'t think, just eat!) - Umami bomb in a bowl 🍜\n💃 Vibe Check:\nMid-2000s club playlist (Britney vibes!) 💿\nModern luxe interior perfect for "casual flex" pics 📸\nPrepare for lunch queues – bring your best gossip to kill time 💅' },
      { name: '🦀 Cheng Long Hang (Crab Lovers\' Church)', location: 'Huangpu District', description: 'Michelin-starred crustacean worship 🙏\nCrab Commandments:\n1️⃣ Golden Crab Fat Rice - 100% pure crab orgasm (portion control is key!) 🍚💛\n2️⃣ Crab Roe Dumplings - Bite-sized liquid gold 🥟\n3️⃣ Crispy Chicken - 20-year recipe that slaps harder than your ex 👋\n⚠️ Warning: Ordering multiple crab dishes = food coma risk! 💤' },
      { name: '🎭 Shi He Yuan (Peking Duck Theater)', location: 'Former French Concession', description: 'Where dinner becomes performance art 🦆✨\nMichelin Magic:\nDuck Three Ways - Caviar-topped skin = edible jewelry 💎\nPear-Shrimp Tango - Fruit meets seafood in a flavor mosh pit 🍐🦐\nFish Head + Oil Stick - Carb-loaded comfort food heaven 🥖\nPro Move: Book balcony seats for陆家嘴三件套 backdrop 🌆 (100% Tinder profile upgrade)' },
      { name: '🦀 Loong Dock (Crab Wonderland)', location: 'The Bund', description: 'For when you wanna eat like a seafood tycoon 💰\nSugar Daddy Specials:\nDrunken Giant Shrimp - Size matters here 🍤👀\nLobster-Crab Fusion - Two luxuries for the price of... well, two 😅\n💰 Damage Control: Skip the king crab unless it\'s bonus season!' },
      { name: '🦆 Sheng Yong Xing (Duck Drama)', location: 'Huangpu District', description: 'View &gt; Food (But that duck tho...)\nControversial Take:\nCaviar Duck = Worth the hype (and price) 💸\nOther dishes = Fancy background actors 🎭\nBund views make even mediocre food photogenic 🌃' }
    ],
    'affordable-seafood': [
      { name: '🍤 Da Bao Kou Fu (Affordable Seafood Heaven)', location: 'Yangpu District', description: 'Where you get lit on crustaceans without selling a kidney 💸\nVibe Check:\nChaotic seafood market energy 🦞 (Bring your loudest friends)\nWeekend waits? Worth it for those portion sizes – holy shit 😱\nFree-flow watermelon that\'ll make you question your grocery store choices 🍉\nMust-Eat or STFU:\n✅ Crab + Rice Cake Gangbang 🦀 - Sticky AF with more膏 than a K-pop fan convention\n✅ Crispy AF Shrimp 🍤 - Eat the whole damn thing shell-and-all (crunchgasm guaranteed)\n✅ Sea Worm Rice - Sounds gross, tastes like umami punched you in the face 👊\nSecret Weapon: That steamed fish so fresh it\'s basically still swimming 🐟\nFree Shit Alert:\n🍦 Unlimited ice cream (Pro move: Make affogato with their espresso shot)\n🍫 Chocolate Dumplings - Basically legal heroin for dessert hoes\nPro Tips:\nCome hungry or get wrecked – portions could feed a small army\n4+ crew = Taste everything without food coma\nWear stretchy pants – you\'ll need \'em after that rice cake mountain\nTake leftovers for next-day flexing ("Look ma, I adulted!")' }
    ],
    'must-visit': [
      { name: 'Hoxa Bistro 🏜️ (Xinjiang Chic)', location: 'Huangpu District', description: 'This is actually one of my favourite spots for pictures taking, and it\'s got good food too, duhhh.\nFree photo zones:\n🏜️ Desert-themed rooftop with full frontal Oriental Pearl view (open for pics, no dining needed)\n🪔 Lantern-lit corridor with mosaic floors\nPro tip: Borrow their embroidered cushions as props' },
      { name: 'Manner Coffee ☕ (Broke Girl\'s Bund)', location: 'The Bund', description: '"Price of a coffee = $100m worth of view"\nShot 1: Lean against the glass with Pudong skyline behind you (casual flex) 😎\nShot 2: Coffee cup + river reflection = accidental art student vibes 🎨\nSecret level: Staircase shots make legs look 2m long 👯♀️\nBest times: 7-9am (foggy mystique) or 8pm (light show backdrop) 🌫️💫' },
      { name: 'Manner Coffee (Guoke Riverside) ☕️', location: 'Pudong', description: 'Why it slays:\nFree Pudong skyline backdrop featuring:\n🏙️ Oriental Pearl Tower\n🚢 Huangpu River cruise ships\n🌉 Nanpu Bridge\nSecret spots:\n🪑 Glass walkway that makes you float above the river\n🌅 Sunrise golden hour magic (6-7AM crowd-free)\nCoffee hack: ¥15 latte = photo permit 📷\nWhat to wear: Monochrome outfits for contrast' }
    ],
    'european': [
      { name: '🇪🇸 Don Quixote (Best Espanol food)', location: 'Huangpu District', description: 'Wandering guitarists playing Despacito on loop, yes, on loopS 🎸\nBirthday celebrations 🎂 (they\'ll surprise you with guitar Happy Birthday!)\nMust-try or STFU:\n✅ Seafood Paella 🥘 - Saffron rice loaded with crustaceans 🦐 (Tastes like Barcelona beach day)\n✅ Honey Octopus 🐙 - Sweet & nutty flavor bomb! 🐙 (Weirdly addictive)\n✅ Angus Beef Steak 🥩 - So juicy you\'ll wanna lick the plate like how your boyfriend licks his armpit\n✅ Sword Skewers - Cheesy, juicy, Instagram-famous ⚔️ (Instagram gold)\n\nBtw: The bookshelf is rotating, idk , kinda cool\nPro Tip: Come hungry – portions could feed the Federal Government' },
      { name: '🇮🇹 Grande A\'moo (Italian MVP)', location: 'Jing\'an District', description: 'This place is straight fire 🔥 with:\nChill industrial vibes 🏭\nServers who actually smile 😊\nMust-try or STFU:\nCheese Wheel Pasta 🧀 - Watch them mix it in a giant cheese wheel!\nChili Oil Noodles 🌶️ - Mix that egg yolk in STAT! (Warning: Addictive)\nBlack Truffle Pizza 🍕 - honestly, no complain\nTiramisu ☁️ - So good you\'ll wanna slap your boyfriend\'s ass\nSecret Menu: Ask for extra cheese wheel scrapings – beat his ass off if the server says no\nBtw: Split dishes - portions are generous!' },
      { name: '🇮🇹 OTF Sicilia (Insta-Worthy Italian)', location: 'Huangpu District', description: 'Perfect for taking food pics, not dick pics\n✅ Cute kids\' meals 👶🍴 (seriously adorable)\n✅ Crispy "Roast" Chicken 🍗 (Spoiler: It\'s actually fried AF)\n✅ Lemon Ice Cream 🍨 - Comes with actual frozen lemon chunks!\n✅ Colorful Lattes - For basic Insta bitches ☕🌈\nHeads up: Tight seating – maybe skip if you\'re claustrophobic, google it if you dun know what it is 😅' },
      { name: '🍸 COMMUNE RESERVE (Best Bang for Buck)', location: 'Former French Concession', description: 'Where to go when:\nYou\'re STARVING 🤤 (portions are HUGE)\nWhere portions are XL and prices aren\'t 💸\nYou want drinks + food + vibes 🍹\nMust-try or STFU:\n✅ Black Truffle Pizza - Smells like rich people\'s laundry 🧺\n✅ Beef Cheek Pasta 🐮 - Sauce so good you\'ll wanna drink it\n✅ Sweet & Spicy Ribs 🍖 - Fall-off-the-bone tender\n✅ Burrata Salad 🧀 - Fancy AF but worth it\nBonus: 👀 Hot waitstaff alert! 👀 No need Tinder anymore' },
      { name: '🇫🇷 Lunette By Amanda (Our #1 French Crush)', location: 'Huangpu District', description: 'Must-try or STFU:\n🔥 Signature Wellington Beef 🔥\nCrispy outside, juicy inside – the beef melts in your mouth 🥩✨\nPro tip: Comes with PARMA ham + FAT duck liver + truffle sauce + caviar = makes me horny\nPerfect date spot with killer river views 🌃 (actually, it\'s kinda cool looking at the Oriental Pearl Tower!)\n🍽️ King Crab Risotto 🦀\nSweet crab meat + creamy rice = instant food coma 😴💖\nWhy we love it:\n✅ Service that actually makes you feel special 🎂 (they remembered my birthday!)\n✅ Best view in town\nTell them it\'s your birthday, even if it\'s not your birthday, but in advance, when you call to reserve\n🎁 Birthday freebies (cake + rose petals!)\nPro tip: Request window seats 2 weeks ahead 📅\n🍆Bring your girlfriend, don\'t bring your one-time Tinder date, not worth the mone' },
      { name: '🇫🇷 Restaurant Cuivre (French Grandma\'s Kitchen) 👵', location: 'Former French Concession', description: '🇫🇷 French-owned hidden place that\'s been slaying for 10+ years!\nNo stuffy vibes – just chill bistro energy 🍷\nMust-trys or STFU:\nBeef Tartare 🥩: Comes with bagel chips (portion\'s HUGE!)\nDuck Liver Pâté 🦆: Like ice cream but better – spread that goodness!\nGoat Cheese Salad 🧀: Holy moly, this combo slaps! 🥗💥\n\nPro tip: Say "c\'est magnifique" wrong on purpose – let them correct you 😏🗣️\nNo-reservations hack: Come at 6PM for early-bird seats 🐦\nPerks:\n💰 Great prices (about ¥280/person)\n🕯️ Romantic lighting = perfect for anniversaries 💑\n👨🍳 80% French customers = authenticity guarantee!' },
      { name: '🇫🇷 Jean Georges 🌟 (Fancy Date Night)', location: 'The Bund', description: 'Michelin-starred with epic Bund views 🌉\nWhite marble everywhere 📸\nLunch deal alert! 🚨 4-course meal under ¥400 = steal!\n🍽️ Food Highlights:\nSea Urchin Toast 🌊: Fresh AF with crispy bread\nLobster & Corn 🦞: Butter-soft meat with zesty lime kick\nDuck breast thiccer than your gym crush 🦆🍑\nTell them it\'s your birthday, even if it\'s not your birthday, but in advance, when you call to reserve\nFree birthday cake = edible hint to put a ring on it 💍🎂\nLittle tips: Light colors for IG-worthy shots 📸' }
    ],
    'korean': [
      { name: 'Early Morning BBQ 🥩 (Top 1 Korean Spot)', location: 'Pudong', description: 'One of my own Shanghai\'s Must-Eat List!\nPro tip: Let their 🔥hot grill masters handle the cooking (they switch servers for different meats like it\'s Michelin-star service!). Just sit back, enjoy the skyline views of Lujiazui\'s "Three Giants" 🌆, and try not to drool...\nMust-tries or STFU:\n🥩 Signature Sirloin\nPerfect medium-rare every time 🎯 Juicy AF with just salt & pepper - could rival any steakhouse!\n🧅 Secret Onion Dip\nThe MVP sauce! Sweet-spicy magic that makes every bite better 🌟 (PSA: Only found here!)\n🦑 Charcoal Squid\nShanghai\'s crispest squid - that satisfying crunch then sweet aftertaste? 🤯\n🥓 Beef Belly\nMelt-in-your-mouth goodness 🤤 Pair with their onion sauce for flavor fireworks!\nPro tip: Request the window seat for IG-worthy meat+skyline shots 📸' },
      { name: 'Choga Soy Sauce Crab 🦀 (Top 2 Korean)', location: 'Korea Street', description: 'Hidden spot at Korea Street! Perfect date spot with killer crab 🦀💘\n🌶️ Spicy Raw Crab\nHeavy spicy but addictively good 🔥 Perfect with rice balls - just let the staff handle the messy work!\n🐟 Live Eel BBQ\nCrispy skin + tender flesh = pure happiness 😇 Comes with 4 dipping sauces for maximum flavor!\nWarning: Spicy crab requires milk standby 🥛' },
      { name: 'Fafu Korean BBQ 🍖 (Top 3)', location: 'Hongqiao', description: 'Where K-pop stars eat! Pro tip: Come at 5PM sharp or prepare to queue 🕔\n🐷 Thick-cut Pork Belly\nCrispy meets juicy 🤩 Wrap in lettuce with grilled pineapple - sweet/savory heaven!\n🦐 Seafood Pancake\nExtra thicc & crispy-edged perfection 🤤 We always order 2 sets!\n🧀 Grilled Cheese Wrap\nThink cheesy meat burrito meets Korean BBQ 🧀🥩 Mind = blown\nHack: Book 1 week ahead via 📞 (They\'re strict about full-party seating!)' },
      { name: 'Nabi 🦋 (Foodie Holy Grail)', location: 'Former French Concession', description: 'Shanghai\'s hardest-to-book Korean fine dining! Only 16 seats with butterfly-themed everything 🦋✨\n12-course tasting menu changes seasonally 🍽️ Chef Tom (aka "Korean Gong Yoo") serves artsy dishes that look too pretty to eat... until you taste them 😍\n¥1500+ 12-course adventure:\n👨🍳 Chef Tom\'s smile (worth 30% of the price)\n🍠 Sweet Potato Ice Cream - Mind-blowing texture play\n🍜 Hidden Ramen - Surprise midnight snack vibes\nHidden bonus: Secret seafood ramen & rice cakes!\nReservation warfare: Set monthly alarm for 1st 00:00 ⏰\n💰 Pro Tips: Tiny portions but huge experience.' }
    ]
  }

      return (
    <div className="py-6">
      {/* Tab navigation - 2x4 grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {foodTabs.slice(0, 4).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FoodTab)}
            className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-1.5" />
            <span>{tab.label}</span>
          </button>
        ))}
          </div>
      <div className="grid grid-cols-2 gap-3">
        {foodTabs.slice(4, 8).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FoodTab)}
            className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-1.5" />
            <span>{tab.label}</span>
          </button>
        ))}
          </div>
          
      {/* Content for each tab */}
      <div className="mt-6 space-y-4">
        {activeTab === 'must-visit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold mb-2 text-gray-800 border-b border-gray-200 pb-2">Top 2 spots for taking hot ass photos, no cap, you will regret if you don't go</h2>
          </motion.div>
        )}

        {activeTab === 'hotpot' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold mb-2 text-gray-800 border-b border-gray-200 pb-2">🍲 Must-Try Chinese Hotpot in Shanghai 🥢</h2>
          </motion.div>
        )}

        {activeTab === 'european' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800 border-b border-gray-200 pb-2">Italian & Spanish Cuisine</h2>
            </motion.div>
            
            {foodSpots[activeTab].slice(0, 4).map((spot, index) => (
              <motion.div
                key={spot.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mb-4"
              >
          <div>
                  <h3 className="font-semibold text-lg mb-4">{spot.name}</h3>
                  <div className="text-gray-600 text-sm">
                    {renderFormattedDescription(spot.description, spot.name)}
                </div>
              </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 4 * 0.1 }}
              className="mb-6 mt-8"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800 border-b border-gray-200 pb-2">🇫🇷 French Cuisine Picks</h2>
            </motion.div>
            
            {foodSpots[activeTab].slice(4).map((spot, index) => (
              <motion.div
                key={spot.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + 4) * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mb-4"
              >
          <div>
                  <h3 className="font-semibold text-lg mb-4">{spot.name}</h3>
                  <div className="text-gray-600 text-sm">
                    {renderFormattedDescription(spot.description, spot.name)}
            </div>
          </div>
              </motion.div>
            ))}
          </>
        )}
        
        {activeTab !== 'european' && foodSpots[activeTab].map((spot, index) => (
          <motion.div
            key={spot.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
          <div>
              <h3 className="font-semibold text-lg mb-4">{spot.name}</h3>
              <div className="text-gray-600 text-sm">
                {renderFormattedDescription(spot.description, spot.name)}
            </div>
          </div>
          </motion.div>
        ))}
        
        {activeTab === 'must-visit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: foodSpots[activeTab].length * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mt-6"
          >
            <h3 className="font-semibold text-lg mb-4">Pro Tips for the 'Gram:</h3>
            <div className="text-gray-600 text-sm space-y-3">
            <div className="flex items-start">
                <div className="text-primary font-bold mr-2">✨</div>
                <div>Golden hour starts at 4:30pm in winter – fight tourists for ledge spots ⏰🥊</div>
            </div>
            <div className="flex items-start">
                <div className="text-primary font-bold mr-2">✨</div>
                <div>Coffee cups {'>'} designer bags here – hold them like they're Celine 💼➡️☕</div>
            </div>
              <div className="flex items-start">
                <div className="text-primary font-bold mr-2">✨</div>
                <div>Pretend to laugh at nothing – makes you look ~mysteriously happy~ 😂👻</div>
                </div>
              <div className="mt-4 italic font-medium">No cap, your feed will look richer than a Bund property tycoon after these 📈💎</div>
              </div>
          </motion.div>
        )}

        {activeTab === 'korean' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: foodSpots[activeTab].length * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mt-6"
          >
            <h3 className="font-semibold text-lg mb-3">Pro Tips:</h3>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2 text-gray-600 text-sm">
              <div>Most BBQ spots offer free banchan refills - ask for more kimchi!</div>
              <div>Nabi diners: Wear black - matches the minimalist aesthetic</div>
              <div>Korea Street is full of Korean restaurants, so don't have to stick to my recommendations</div>
          </div>
          </motion.div>
        )}

        {activeTab === 'hotpot' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: foodSpots[activeTab].length * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mt-6"
          >
            <h3 className="font-semibold text-lg mb-3">Universal Hotpot Rules:</h3>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2 text-gray-600 text-sm">
              <div>📅 Weekday lunches = shorter queues</div>
              <div>🧥 Bring hair ties – things get messy!</div>
              <div>🍚 Order half-portions to try more dishes</div>
            </div>
          </motion.div>
        )}

        {activeTab === 'chinese-cuisine' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: foodSpots[activeTab].length * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mt-6"
          >
            <h3 className="font-semibold text-lg mb-3">Universal Shanghai Dining Hacks:</h3>
            <div className="pl-1 border-l-2 border-primary/20 space-y-2 text-gray-600 text-sm">
              <div>🕔 4:30PM = Magic reservation hour</div>
              <div>📸 Food-first policy – cameras eat before you</div>
              <div>🍚 Always order rice – rice with the duck sauce...you might forget your mum's name</div>
            </div>
          </motion.div>
        )}
          </div>
        </div>
  )
} 