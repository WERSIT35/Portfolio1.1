import { CONTACT, EDUCATION_ITEMS } from '../data/site-data';
import { Projects } from '../interfaces/projects';

/** Canonical origin for absolute URLs (OG, canonical, JSON-LD, sitemap). */
export const SITE_URL = 'https://portfolio1-1-mu.vercel.app';
export const PERSON_ID = `${SITE_URL}/#person`;

/** Insert or replace one JSON-LD block in <head> (works during prerender and in the browser). */
export function setJsonLd(document: Document, id: string, data: object): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** schema.org Person, from the site's own contact and education data only. */
export function personJsonLd(): object {
  const [city, country] = CONTACT.location.split(',').map((part) => part.trim());
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: `${CONTACT.name} ${CONTACT.surname}`,
    jobTitle: 'Full-Stack Engineer',
    url: SITE_URL,
    image: `${SITE_URL}${CONTACT.image}`,
    email: `mailto:${CONTACT.email}`,
    address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: country },
    sameAs: [CONTACT.github, CONTACT.linkedin].filter(Boolean),
    knowsLanguage: CONTACT.languages.map((language) => language.replace(/\s*\(.*\)/, '')),
    alumniOf: EDUCATION_ITEMS.filter((item) => /BSc|MSc/.test(item.degree)).map((item) => ({
      '@type': 'CollegeOrUniversity',
      name: item.name,
    })),
  };
}

/** schema.org CreativeWork for one case study. */
export function projectJsonLd(p: Projects): object {
  const live = p.iflink && p.link && p.link !== '#' ? p.link : null;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.projName,
    headline: p.subname,
    description: p.result ? `${p.subname}. ${p.result}.` : p.subname,
    url: `${SITE_URL}/work/${p.slug}`,
    image: `${SITE_URL}/assets/og/${p.slug}.png`,
    dateCreated: String(p.year),
    keywords: p.stack.join(', '),
    creator: { '@id': PERSON_ID },
    ...(live ? { sameAs: live } : {}),
    ...(p.github ? { isBasedOn: p.github } : {}),
  };
}
