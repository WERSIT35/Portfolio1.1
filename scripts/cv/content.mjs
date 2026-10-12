// CV content: the single source for every variant. Facts only, from src/app/data/site-data.ts
// (audited against the GitHub repos), the repos themselves, and the owner's answers
// (2026-10-12). Markup: **x** = emphasis, [label](url) = link.

export const PERSON = {
  name: 'Otar Davitashvili',
  location: 'Tbilisi, Georgia',
  availability: 'Open to remote and relocation',
  phone: '+995 557 28 26 16',
  email: 'otowork3@gmail.com',
  links: [
    { label: 'portfolio1-1-mu.vercel.app', url: 'https://portfolio1-1-mu.vercel.app/' },
    { label: 'github.com/WERSIT35', url: 'https://github.com/WERSIT35' },
    {
      label: 'linkedin.com/in/otar-davitashvili',
      url: 'https://www.linkedin.com/in/otar-davitashvili/',
    },
  ],
};

const LUMINA_LINKS =
  '[provider-flame.vercel.app](https://provider-flame.vercel.app/) · [github.com/WERSIT35/Provider](https://github.com/WERSIT35/Provider)';

export const EXPERIENCE = {
  lumina: {
    role: 'Founder & Lead Engineer',
    org: 'Lumina Games',
    dates: 'Apr 2026 – Present',
    meta: `Independent iGaming venture, not yet incorporated · GLI-certified · ${LUMINA_LINKS}`,
    bullets: [
      'Designed and built a **server-authoritative slot provider platform** end to end: Fastify/TypeScript RGS, operator control plane, provider and operator admin consoles, and the canvas client for the first title, **Vault 20K** (6×5 pays-anywhere, tumbles, free spins, multipliers, buy-feature, ante bet).',
      'Wrote one **shared maths engine** that runs unchanged in the browser, the RGS and a seeded, sharded RTP tool; validated three RTP profiles (96.38%, 94.40%, 92.38%) with **30M seeded rounds per mode plus a 200M independent run**, all passing.',
      'Secured casino integration with an **HMAC-signed operator API** (raw-byte signatures, nonce replay protection, timestamp-skew checks, rate limiting) and seamless-wallet webhooks with idempotent debits and lost-debit rollback, proven end to end against a demo casino.',
      'Made every round auditable: deterministic seeded RNG, **hash-chained, Ed25519-signed append-only ledgers** protected by Postgres triggers, and signed round exports with an offline verifier.',
      'Ran it with team-grade discipline: a security findings register (8 findings, 2 High, all fixed), a 57-test abuse suite and **300+ automated tests** in GitHub Actions with real-browser checks, plus 45 design docs (GDD, ADRs, threat model).',
    ],
  },
  betlive: {
    role: 'AML & Game Control Officer',
    org: 'Betlive',
    dates: 'Sep 2024 – Present',
    meta: 'Full-time · iGaming operator',
    bullets: [
      'Monitor real-time transactions on a high-volume iGaming platform to detect **money laundering, fraud** and suspicious account behaviour.',
      'Work out how players abuse promotions, then find and document **bonus-abuse and fraud cases** using back-office tools, **SQL scripts and Power BI**.',
      'Test new website features and find **critical bugs**.',
      'Use browser automation to examine workflows and support operational reviews.',
    ],
  },
  freelance: {
    role: 'Freelance Full-Stack Engineer',
    org: '',
    dates: 'Sep 2022 – Present',
    meta: 'Freelance, alongside employment',
    bullets: [
      '**Elite Weddings** ([elitewe.com.ge](https://elitewe.com.ge/)): bilingual EN/KA wedding-agency platform on Angular and a framework-free Node.js backend with hand-written JWT, scrypt and RFC 6238 TOTP; layered inquiry anti-abuse (honeypot, rate limits, daily caps, CAPTCHA); Docker on k3s with network policies and cert-manager TLS.',
      '**HeatFlow / Tenebi** ([tns-khaki.vercel.app](https://tns-khaki.vercel.app/)): bilingual KA/EN catalogue of **309 products in 9 categories** for a heating-element shop; Angular SSR and prerendering on Express with schema.org Product JSON-LD and per-page SEO; later migrated from Angular 17 to 20 (signals, OnPush, lazy routes).',
      '**Akhali Sakhli** ([akhalisakhli.com](https://akhalisakhli.com/)): responsive Angular website for a real-estate platform, live.',
    ],
  },
  petc: {
    role: 'Angular Developer',
    org: 'PetC',
    dates: 'Dec 2025 – Jun 2026',
    meta: 'Contract · Remote · Social platform for pet owners with vet and grooming services · ~30-person team',
    bullets: [
      'Delivered **four core platform features** in a modular Angular codebase (Standalone Components, Signals, RxJS, REST APIs), with lazy loading and route-level code splitting.',
    ],
  },
  leantech: {
    role: 'System Team Lead',
    org: 'Lean Tech',
    dates: 'Jan 2024 – Mar 2026',
    meta: 'Part-time · Industrial technology company',
    bullets: [
      '**Led and mentored a 5-person team** taking STM32-based embedded prototypes into industrial products.',
      'Ran development cycles from planning to implementation, hands-on in C (GPIO, UART, I²C, SPI).',
    ],
  },
  icecat: {
    role: 'IT Content Manager',
    org: 'Icecat',
    dates: 'Oct 2022 – Jul 2023',
    meta: 'Full-time',
    bullets: [
      'Managed and optimised IT product content across platforms for accuracy, consistency and SEO.',
    ],
  },
};

export const PROJECTS = {
  shello: {
    name: 'Shello',
    kind: 'Full-stack e-commerce platform',
    links:
      '[shello-demo.vercel.app](https://shello-demo.vercel.app/) · [GitHub](https://github.com/WERSIT35/Shello-Demo)',
    text: 'Rotating, HMAC-hashed refresh tokens in HttpOnly cookies, Google OAuth, admin TOTP 2FA and RBAC; transactional checkout with atomic stock decrements and server-side pricing; Georgian/English SSR; Docker Compose behind Nginx plus Kubernetes manifests; secret-scanning CI.',
    stack: 'Angular 18 SSR · Node.js · Express · TypeScript · MongoDB · Docker · Kubernetes',
  },
  tatoogen: {
    name: 'TatooGen',
    kind: 'AI tattoo design app',
    links: '[GitHub](https://github.com/WERSIT35/tattoo-generator-app)',
    text: 'Two-stage AI pipeline (gpt-4o-mini prompt rewriter → gpt-image-1) with async jobs on Postgres; Firebase Auth and App Check on every call; credits economy with server-verified Google Play / App Store purchases and replay protection.',
    stack: 'Flutter · Riverpod · Node.js · Express · PostgreSQL · OpenAI API · Firebase',
  },
  stm32: {
    name: 'STM32 firmware',
    kind: 'Open-source embedded work',
    links: '[github.com/WERSIT35](https://github.com/WERSIT35)',
    text: 'MPU-6050 artificial horizon on bare metal (no HAL, two I²C buses, boot diagnostic ladder); OV5640 camera capture with DCMI + DMA2 and a framed, checksummed UART protocol; Ethernet MQTT node on lwIP without an RTOS.',
    stack: 'C · STM32L031 / STM32F767 · I²C · DCMI · DMA · lwIP · MQTT',
  },
};

export const SKILLS = {
  igaming: [
    'iGaming & risk',
    'RGS architecture, game maths & RTP simulation, seeded RNG, operator & seamless-wallet integration, AML transaction monitoring, fraud & bonus-abuse investigation, Power BI',
  ],
  backend: [
    'Backend & data',
    'Node.js, TypeScript, Fastify, Express, REST API design, PostgreSQL, MongoDB, SQL, Zod',
  ],
  security: [
    'Security',
    'HMAC request signing, nonce replay protection, Ed25519 signatures, JWT & OAuth, TOTP 2FA, rate limiting, threat modelling',
  ],
  frontend: [
    'Frontend & mobile',
    'Angular (Signals, SSR, RxJS), HTML5 Canvas, SCSS, Flutter (Riverpod)',
  ],
  infra: [
    'Infra & quality',
    'Docker, Kubernetes / k3s, Nginx, Caddy, GitHub Actions, Vitest, end-to-end & parity testing',
  ],
  embedded: ['Embedded', 'C, STM32 (bare-metal & HAL), I²C, SPI, UART, DMA, lwIP, MQTT'],
  ai: ['Applied AI', 'OpenAI API (gpt-image-1, gpt-4o-mini), Claude & Claude Code'],
  leadership: [
    'Leadership',
    'Team leadership, mentoring, technical writing (ADRs, design docs, runbooks)',
  ],
};

export const EDUCATION = [
  {
    title: 'MSc DevOps (in progress)',
    school: 'Business and Technology University (BTU), Tbilisi',
    dates: 'Expected 2026',
  },
  { title: 'BSc Computer Science', school: 'University of Georgia, Tbilisi', dates: '2019 – 2025' },
];

export const CERTS = {
  anthropicCore: [
    'Anthropic',
    'Claude Code in Action · AI Fluency: Framework & Foundations',
    '2025',
  ],
  anthropicAll: [
    'Anthropic',
    'Claude Code in Action · AI Fluency: Framework & Foundations · Claude Cowork',
    '2025',
  ],
  fccBackend: [
    'freeCodeCamp',
    'JavaScript Algorithms and Data Structures · Foundational C# with Microsoft',
    '2024 · 2026',
  ],
  fccProduct: [
    'freeCodeCamp',
    'JavaScript Algorithms and Data Structures · Front-End Development Libraries',
    '2024',
  ],
  aws: ['w3schools', 'Introduction to AWS Solutions', '2023'],
};

export const LANGUAGES =
  'Georgian (native) · English (full professional) · Russian (professional working) · German (conversational)';

const BASE_ORDER = ['lumina', 'betlive', 'freelance', 'petc', 'leantech', 'icecat'];

export const VARIANTS = [
  {
    slug: 'iGaming',
    headline: 'Founding Engineer · iGaming Platforms, Risk & Integrity',
    summary:
      'Founding-style engineer who builds complete products and leads the teams behind them. Built Lumina Games, a GLI-certified, server-authoritative slot provider platform (RGS, game maths, signed operator API, seamless wallet), while investigating AML, fraud and bonus abuse operator-side at Betlive. Previously led a 5-person STM32 product team; delivers Angular and Node.js platforms for clients.',
    core: 'RGS & game maths · RTP simulation · Operator & seamless-wallet integration · AML, fraud & bonus-abuse detection · Secure APIs · Node.js · TypeScript · Angular · PostgreSQL · Docker & Kubernetes · STM32 · Team leadership & mentoring',
    experience: BASE_ORDER,
    projects: ['shello', 'tatoogen', 'stm32'],
    skills: ['igaming', 'backend', 'security', 'frontend', 'infra', 'embedded', 'ai', 'leadership'],
    certs: ['anthropicCore', 'fccBackend', 'aws'],
  },
  {
    slug: 'Founding-Engineer',
    headline: 'Founding Engineer · Full-Stack Products, Secure Platforms & Applied AI',
    summary:
      'Founding-style engineer who takes products from idea to running system and leads the people who build them. Single-handedly built a complete, GLI-certified slot provider platform (Fastify RGS, signed operator API, wallet integration, 300+ tests), full-stack Angular and Node.js platforms for clients, and an AI image app with server-verified in-app purchases. Previously led a 5-person STM32 product team.',
    core: 'Product engineering end to end · Node.js · TypeScript · Angular · Flutter · Secure APIs & auth (HMAC, JWT, OAuth, TOTP) · PostgreSQL & MongoDB · Docker, Kubernetes & CI · Applied AI (OpenAI, Claude) · STM32 firmware · Team leadership & mentoring',
    experience: BASE_ORDER,
    overrides: {
      lumina: {
        bullets: [
          'Designed and built a complete **B2B game platform** for casino operators: Fastify/TypeScript RGS (game server), operator control plane, provider and operator admin consoles, and the canvas client for the first title, **Vault 20K**.',
        ],
        keepFrom: 1,
      },
      betlive: {
        bullets: [
          'Monitor real-time transactions on a high-volume iGaming platform to detect **money laundering, fraud** and suspicious account behaviour.',
          'Work out how players abuse promotions, then find and document **bonus-abuse and fraud cases** using back-office tools, **SQL scripts and Power BI**.',
          'Test new website features and find **critical bugs**; use browser automation to examine workflows and support operational reviews.',
        ],
      },
    },
    projects: ['tatoogen', 'shello', 'stm32'],
    skills: ['backend', 'frontend', 'security', 'infra', 'ai', 'embedded', 'igaming', 'leadership'],
    certs: ['anthropicAll', 'fccProduct', 'aws'],
  },
];
