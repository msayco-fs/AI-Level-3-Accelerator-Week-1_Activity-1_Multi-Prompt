/** Content models for the marketing sections (nav, gallery, reviews, hours). */

export interface NavLink {
  /** Anchor target without the leading '#'. */
  readonly id: string;
  readonly label: string;
}

export interface GalleryImage {
  readonly id: string;
  /** Path under /assets/images/gallery, or '' for the SVG placeholder. */
  readonly src: string;
  /** Required — decorative-only images are not allowed in this gallery. */
  readonly alt: string;
  readonly caption: string;
  /** Controls the masonry span on desktop. */
  readonly aspect: 'portrait' | 'landscape' | 'square';
  /** Tiny blurred data-URI or solid palette color shown while loading. */
  readonly placeholder?: string;
}

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  /** Role or context, e.g. "Regular since 2022". */
  readonly meta: string;
  /** 1–5. Rendered as stars and exposed to AT as text. */
  readonly rating: 1 | 2 | 3 | 4 | 5;
  /** Path under /assets/images/people, or '' to render initials. */
  readonly avatar: string;
}

export interface OpeningHours {
  readonly days: string;
  readonly hours: string;
}

export interface ShopInfo {
  readonly name: string;
  readonly tagline: string;
  readonly addressLines: readonly string[];
  /** E.164 for links. */
  readonly phone: string;
  /** Human-readable for display. */
  readonly phoneDisplay: string;
  readonly email: string;
  /** Digits only, country code first — required by the wa.me link format. */
  readonly whatsapp: string;
  readonly hours: readonly OpeningHours[];
  readonly socials: readonly { readonly label: string; readonly url: string }[];
}

/** Contact form shape, mirrored by the reactive form group. */
export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}
