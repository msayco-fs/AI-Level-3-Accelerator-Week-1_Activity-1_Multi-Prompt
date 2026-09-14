import type { MenuCategory, MenuItem } from '../models';

/**
 * Menu content. Prices are whole PHP.
 * Edit freely — the UI is fully data-driven off these two arrays.
 */

export const MENU_CATEGORIES: readonly MenuCategory[] = [
  {
    id: 'matcha',
    label: 'Matcha Bar',
    blurb: 'Ceremonial-grade Uji leaf, whisked to order.',
  },
  {
    id: 'coffee',
    label: 'Espresso & Brew',
    blurb: 'Single-origin beans roasted weekly in Batangas.',
  },
  {
    id: 'cold-brew',
    label: 'Cold Bar',
    blurb: 'Slow-steeped 18 hours. Never diluted.',
  },
  {
    id: 'pastries',
    label: 'Kitchen',
    blurb: 'Laminated and baked in-house every morning.',
  },
];

export const MENU_ITEMS: readonly MenuItem[] = [
  /* ------------------------------- MATCHA ------------------------------- */
  {
    id: 'usucha',
    name: 'Usucha Ceremonial',
    category: 'matcha',
    description:
      'First-harvest Uji leaf whisked with 80°C spring water. No sugar, no milk — pure umami and a clean, lingering sweetness.',
    price: 190,
    largeUpcharge: 40,
    image: '',
    tags: ['vegan', 'dairy-free', 'hot'],
    badge: 'bestseller',
    available: true,
    caffeineMg: 70,
  },
  {
    id: 'matcha-latte',
    name: 'Matcharap Signature Latte',
    category: 'matcha',
    description:
      'Our house blend over cold-pressed oat milk and a whisper of muscovado. The drink the shop is named for.',
    price: 205,
    largeUpcharge: 45,
    image: '',
    tags: ['vegan', 'dairy-free', 'iced', 'hot'],
    badge: 'bestseller',
    available: true,
    caffeineMg: 65,
  },
  {
    id: 'hojicha-latte',
    name: 'Hojicha Cream Latte',
    category: 'matcha',
    description:
      'Charcoal-roasted Kyoto hojicha, low in caffeine and deeply toasty, finished with a salted cream float.',
    price: 195,
    largeUpcharge: 40,
    image: '',
    tags: ['hot', 'iced'],
    available: true,
    caffeineMg: 25,
  },
  {
    id: 'matcha-yuzu',
    name: 'Matcha Yuzu Fizz',
    category: 'matcha',
    description:
      'Ceremonial matcha shaken with Kochi yuzu juice and sparkling water. Bright, bracing, faintly bitter.',
    price: 215,
    largeUpcharge: 45,
    image: '',
    tags: ['vegan', 'dairy-free', 'iced'],
    badge: 'seasonal',
    available: true,
    caffeineMg: 60,
  },
  {
    id: 'genmaicha',
    name: 'Genmaicha Toasted Rice',
    category: 'matcha',
    description:
      'Sencha and popped brown rice with a matcha dusting. Nutty, savoury, the most comforting cup on the menu.',
    price: 165,
    largeUpcharge: 35,
    image: '',
    tags: ['vegan', 'dairy-free', 'hot'],
    available: true,
    caffeineMg: 30,
  },
  {
    id: 'matcha-affogato',
    name: 'Matcha Affogato',
    category: 'matcha',
    description:
      'A double shot of thick koicha poured over house vanilla-bean gelato. Eat it fast.',
    price: 235,
    image: '',
    tags: ['contains-nuts'],
    badge: 'new',
    available: true,
    caffeineMg: 85,
  },

  /* ------------------------------- COFFEE ------------------------------- */
  {
    id: 'espresso',
    name: 'Doppio Espresso',
    category: 'coffee',
    description:
      'Eighteen grams in, thirty-six out, twenty-eight seconds. Stone fruit and dark cocoa.',
    price: 130,
    image: '',
    tags: ['vegan', 'dairy-free', 'hot'],
    available: true,
    caffeineMg: 150,
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'coffee',
    description:
      'Ristretto base under 5oz of tightly textured whole milk. Silky, no foam, no compromise.',
    price: 175,
    largeUpcharge: 35,
    image: '',
    tags: ['hot'],
    badge: 'bestseller',
    available: true,
    caffeineMg: 130,
  },
  {
    id: 'cortado',
    name: 'Gibraltar Cortado',
    category: 'coffee',
    description: 'Equal parts espresso and steamed milk in glass. Short, sweet, direct.',
    price: 160,
    image: '',
    tags: ['hot'],
    available: true,
    caffeineMg: 120,
  },
  {
    id: 'v60',
    name: 'V60 Single Origin',
    category: 'coffee',
    description:
      'Rotating micro-lot, hand-poured in four stages. Ask the bar what is on today — it changes weekly.',
    price: 210,
    image: '',
    tags: ['vegan', 'dairy-free', 'hot'],
    available: true,
    caffeineMg: 140,
  },
  {
    id: 'spanish-latte',
    name: 'Spanish Latte',
    category: 'coffee',
    description:
      'Espresso, condensed milk and a pinch of Maldon salt. Unapologetically sweet.',
    price: 185,
    largeUpcharge: 40,
    image: '',
    tags: ['hot', 'iced'],
    available: true,
    caffeineMg: 125,
  },
  {
    id: 'decaf-swiss',
    name: 'Swiss Water Decaf',
    category: 'coffee',
    description:
      'Chemical-free decaffeination, so it still tastes like coffee. Available as espresso or filter.',
    price: 170,
    image: '',
    tags: ['decaf', 'hot'],
    available: true,
    caffeineMg: 8,
  },

  /* ------------------------------ COLD BAR ------------------------------ */
  {
    id: 'cold-brew',
    name: 'House Cold Brew',
    category: 'cold-brew',
    description:
      'Eighteen-hour steep, served neat over a single clear block. Chocolate, plum, zero bitterness.',
    price: 180,
    largeUpcharge: 40,
    image: '',
    tags: ['vegan', 'dairy-free', 'iced'],
    badge: 'bestseller',
    available: true,
    caffeineMg: 200,
  },
  {
    id: 'nitro',
    name: 'Nitro Draft',
    category: 'cold-brew',
    description:
      'Cold brew pushed through nitrogen for a stout-like cascade and a cream-thick head. Poured to order.',
    price: 215,
    image: '',
    tags: ['vegan', 'dairy-free', 'iced'],
    available: true,
    caffeineMg: 210,
  },
  {
    id: 'einspanner',
    name: 'Cold Brew Einspänner',
    category: 'cold-brew',
    description:
      'Unsweetened cold brew crowned with lightly whipped mascarpone cream. Sip through the cloud.',
    price: 220,
    largeUpcharge: 40,
    image: '',
    tags: ['iced'],
    badge: 'new',
    available: true,
    caffeineMg: 195,
  },
  {
    id: 'calamansi-cold',
    name: 'Calamansi Cold Brew',
    category: 'cold-brew',
    description:
      'Cold brew, calamansi, a touch of wildflower honey. Our answer to a Philippine afternoon.',
    price: 195,
    largeUpcharge: 40,
    image: '',
    tags: ['dairy-free', 'iced'],
    badge: 'seasonal',
    available: false,
    caffeineMg: 185,
  },

  /* ------------------------------- KITCHEN ------------------------------ */
  {
    id: 'matcha-croissant',
    name: 'Matcha Almond Croissant',
    category: 'pastries',
    description:
      'Seventy-two-hour laminated dough filled with matcha frangipane and toasted almond flakes.',
    price: 165,
    image: '',
    tags: ['contains-nuts'],
    badge: 'bestseller',
    available: true,
  },
  {
    id: 'basque',
    name: 'Burnt Basque Cheesecake',
    category: 'pastries',
    description:
      'Scorched on top, barely set in the middle. Served at room temperature, as it should be.',
    price: 190,
    image: '',
    tags: ['gluten-free'],
    available: true,
  },
  {
    id: 'ube-scone',
    name: 'Ube Coconut Scone',
    category: 'pastries',
    description: 'Purple yam and toasted coconut in a craggy, buttery scone. Best warmed.',
    price: 140,
    image: '',
    available: true,
  },
  {
    id: 'canele',
    name: 'Hojicha Canelé',
    category: 'pastries',
    description:
      'Caramelised beeswax-lined shell, custard centre infused with roasted hojicha. Twelve a day, then gone.',
    price: 155,
    image: '',
    badge: 'new',
    available: true,
  },
  {
    id: 'banana-bread',
    name: 'Miso Banana Bread',
    category: 'pastries',
    description:
      'Overripe saba bananas and white miso for depth. Thick-cut and griddled in brown butter.',
    price: 150,
    image: '',
    tags: ['contains-nuts'],
    available: true,
  },
  {
    id: 'tamago-sando',
    name: 'Tamago Sando',
    category: 'pastries',
    description:
      'Japanese egg salad on crustless milk bread. The only savoury thing we make, and we make it well.',
    price: 175,
    image: '',
    available: true,
  },
];
