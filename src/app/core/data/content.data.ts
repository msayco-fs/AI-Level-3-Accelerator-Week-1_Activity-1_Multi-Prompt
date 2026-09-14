import type { GalleryImage, Testimonial } from '../models';

/**
 * Gallery + reviews content.
 *
 * `src: ''` renders the palette SVG placeholder. Drop real photos into
 * public/assets/images/gallery (or /people) and fill in the filename.
 * Target dimensions are documented in public/assets/images/README.md.
 */

export const GALLERY: readonly GalleryImage[] = [
  {
    id: 'g1',
    src: '',
    alt: 'Barista whisking bright green matcha in a ceramic chawan with a bamboo chasen.',
    caption: 'The whisk, twice daily',
    aspect: 'portrait',
  },
  {
    id: 'g2',
    src: '',
    alt: 'Marble counter with brass espresso machine and a row of warmed cups.',
    caption: 'Brass and marble',
    aspect: 'landscape',
  },
  {
    id: 'g3',
    src: '',
    alt: 'Overhead shot of a matcha latte beside a sliced almond croissant on a linen napkin.',
    caption: 'The usual order',
    aspect: 'square',
  },
  {
    id: 'g4',
    src: '',
    alt: 'Afternoon light falling across the shop window seat and rattan stools.',
    caption: 'Four o’clock light',
    aspect: 'portrait',
  },
  {
    id: 'g5',
    src: '',
    alt: 'Nitro cold brew cascading into a tall glass, head settling into cream.',
    caption: 'The cascade',
    aspect: 'square',
  },
  {
    id: 'g6',
    src: '',
    alt: 'Tins of ceremonial matcha lined along a dark walnut shelf.',
    caption: 'Straight from Uji',
    aspect: 'landscape',
  },
  {
    id: 'g7',
    src: '',
    alt: 'Baker scoring laminated croissant dough on a floured steel bench.',
    caption: 'Five in the morning',
    aspect: 'portrait',
  },
  {
    id: 'g8',
    src: '',
    alt: 'Full house on a Saturday, guests talking across the communal table.',
    caption: 'Saturdays',
    aspect: 'landscape',
  },
];

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 't1',
    quote:
      'I have had matcha in Kyoto and I have had matcha here, and I am no longer certain which I prefer. The usucha is genuinely exceptional — they do not hide it behind sugar.',
    author: 'Mika Tanaka',
    meta: 'Regular since 2022',
    rating: 5,
    avatar: '',
  },
  {
    id: 't2',
    quote:
      'The only place in the city where I can order a flat white and not have to explain what a flat white is. Small thing. Means everything.',
    author: 'Daniel Reyes',
    meta: 'Works two blocks away',
    rating: 5,
    avatar: '',
  },
  {
    id: 't3',
    quote:
      'I came for the cheesecake and stayed four hours. Nobody rushed me, the wifi held, and the hojicha latte is dangerous.',
    author: 'Alegria Santos',
    meta: 'Freelance designer',
    rating: 5,
    avatar: '',
  },
  {
    id: 't4',
    quote:
      'Ordered ahead for a team of nine and it was bagged, labelled and correct when I walked in. That never happens.',
    author: 'Jomar Villanueva',
    meta: 'Ordered for the office',
    rating: 4,
    avatar: '',
  },
  {
    id: 't5',
    quote:
      'The calamansi cold brew has no business being that good. I have tried to recreate it at home twice and failed twice.',
    author: 'Priya Nair',
    meta: 'Weekend regular',
    rating: 5,
    avatar: '',
  },
  {
    id: 't6',
    quote:
      'Dairy-free by necessity and this is the first café where that has never once felt like a downgrade. The oat milk is properly textured.',
    author: 'Tomas Aguilar',
    meta: 'Regular since 2023',
    rating: 5,
    avatar: '',
  },
];

/** Story blocks rendered by the About section. */
export const STORY_STATS: readonly { value: string; label: string }[] = [
  { value: '2019', label: 'Opened on Aurora' },
  { value: 'Uji', label: 'Single-source leaf' },
  { value: '18hr', label: 'Cold brew steep' },
  { value: '5am', label: 'Pastry bake starts' },
];
