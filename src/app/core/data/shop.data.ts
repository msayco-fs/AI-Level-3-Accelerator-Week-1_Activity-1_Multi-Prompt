import type { NavLink, ShopInfo } from '../models';

/**
 * Single source of truth for shop details and navigation.
 * Swap these values for the real business info before launch — they are also
 * referenced by the JSON-LD block in src/index.html.
 */

export const SHOP: ShopInfo = {
  name: 'Matcharap',
  tagline: 'Stone-milled matcha. Single-origin espresso. Nothing rushed.',
  addressLines: ['24 Aurora Boulevard', 'Quezon City, Metro Manila 1112'],
  phone: '+639170000000',
  phoneDisplay: '+63 917 000 0000',
  email: 'hello@matcharap.ph',
  whatsapp: '639170000000',
  hours: [
    { days: 'Monday – Friday', hours: '7:00 AM – 9:00 PM' },
    { days: 'Saturday – Sunday', hours: '8:00 AM – 10:00 PM' },
    { days: 'Public holidays', hours: '9:00 AM – 6:00 PM' },
  ],
  socials: [
    { label: 'Instagram', url: 'https://instagram.com/matcharap' },
    { label: 'Facebook', url: 'https://facebook.com/matcharap' },
    { label: 'TikTok', url: 'https://tiktok.com/@matcharap' },
  ],
};

/** Drives both the desktop nav and the mobile drawer, in scroll order. */
export const NAV_LINKS: readonly NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];
