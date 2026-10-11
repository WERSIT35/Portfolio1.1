import { IssuerId, IssuerLogo } from '../interfaces/issuers';

// Official marks, unmodified, light variants for the dark theme:
//   anthropic    — Anthropic press kit, "Anthropic symbol – Ivory"
//   freecodecamp — the (flame) glyph from cdn.freecodecamp.org fcc_primary.svg (white)
//   w3schools    — the W3 mark served on verify.w3schools.com (brand green)
export const ISSUER_LOGOS: Record<IssuerId, IssuerLogo> = {
  anthropic: { name: 'Anthropic', src: '/assets/logos/anthropic-logo.svg', width: 92, height: 64 },
  freecodecamp: {
    name: 'freeCodeCamp',
    src: '/assets/logos/freecodecamp-logo.svg',
    width: 352,
    height: 240,
  },
  w3schools: { name: 'W3Schools', src: '/assets/logos/w3schools-logo.svg', width: 38, height: 35 },
};
