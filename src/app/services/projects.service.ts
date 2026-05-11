import { Injectable } from '@angular/core';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  protected projectsList: Projects[] = [
    {
      projName: 'Shello Demo',
      subname: 'Full-Stack E-Commerce App for Phone Cases',

      date: 'Production Demo',

      about:
        'Shello Demo is a full-stack phone-case e-commerce platform designed with production-style architecture. The backend is built with Node.js, Express, and TypeScript, using MongoDB + Mongoose for persistence and JWT access tokens with refresh-token httpOnly cookies for secure session flow. Authentication supports both standard credential login and Google OAuth popup sign-in. The frontend is built with Angular SSR, RxJS, and SCSS, with role-based UI paths and an admin dashboard for product/content/catalog updates. Core modules include product listing and filtering, cart and checkout flow, order lifecycle management, and admin-side management panels. The project is structured as Backend/server and frontend (Angular SSR), includes environment-driven deployment setup, Docker + Nginx quick bootstrap, and dedicated architecture/security documentation (Overall/Backend/Frontend architecture, SECURITY_STANDARDS, JWT_STRATEGY).',
      numOfPage: 12,
      duration: 'Angular SSR + Express + MongoDB',
      highlights: [
        'JWT auth with refresh-token httpOnly cookie flow',
        'Google OAuth popup sign-in with secure callback handling',
        'Admin dashboard for products, catalog, and content management',
        'Order lifecycle, cart workflows, and role-based frontend paths',
        'Angular SSR frontend + Express/TypeScript API + MongoDB',
        'Docker + Nginx quick-start deployment and security docs',
      ],

      img: [
        'assets/projects/ShelloTech/Pic1Web.png',
        'assets/projects/ShelloTech/Pic1Mob.png',
        'assets/projects/ShelloTech/Pic2Web.png',
        'assets/projects/ShelloTech/Pic2Mob.png',
        'assets/projects/ShelloTech/Pic3Web.png',
        'assets/projects/ShelloTech/Pic3Mob.png',
        'assets/projects/ShelloTech/Pic4Web.png',
        'assets/projects/ShelloTech/Pic4Mob.png',
        'assets/projects/ShelloTech/Pic5Web.png',
        'assets/projects/ShelloTech/Pic5Mob.png',
        'assets/projects/ShelloTech/Pic6Web.png',
        'assets/projects/ShelloTech/Pic6Mob.png',
      ],

      link: 'https://shellotech.eu.org',
      github: 'https://github.com/WERSIT35/Shello-Demo',

      iflink: true,
      gradient: 'background-image: linear-gradient(90deg, #1f2329, #444b55);',

      role: 'Full-stack engineer',
      year: 2025,
      status: 'live',
      featured: true,
      stack: ['Angular SSR', 'TypeScript', 'Express', 'MongoDB', 'Docker', 'Nginx'],
      problem:
        'Phone-case retailers needed a production-style storefront with real auth, admin tooling, and order lifecycle — not just a static demo.',
      approach: [
        'JWT access tokens + httpOnly refresh-token cookies for secure sessions',
        'Google OAuth popup flow alongside credential login',
        'Role-based UI paths separating admin and customer journeys',
        'Docker + Nginx bootstrap so the stack runs end-to-end in one command',
      ],
      metrics: [
        { label: 'Pages shipped', value: '12' },
        { label: 'Auth flows', value: 'JWT + OAuth' },
        { label: 'Status', value: 'Live' },
      ],
      lessons:
        'Designing auth around refresh-token cookies forced cleaner separation between session state and UI state, which made the admin dashboard far easier to bolt on later.',
      demoEmbedUrl: 'https://shellotech.eu.org',
    },
    {
      projName: 'Akhali Sakhli',
      subname: 'Real Estate Platform Website',

      date: 'Client Delivery',

      about:
        'Akhali Sakhli is a real estate platform website focused on clear property presentation, responsive browsing, and conversion-friendly structure. The delivery emphasized clean sectioning, maintainable Angular components, and consistent page behavior across mobile and desktop views.',
      numOfPage: 4,
      duration: 'Angular Frontend Delivery',
      highlights: [
        'Responsive property-focused layouts for desktop and mobile',
        'Structured content hierarchy for faster listing exploration',
        'Reusable Angular UI sections for maintainable page growth',
        'Improved readability and information flow for conversion paths',
      ],

      img: [
        'assets/projects/newHouse/landing.png',
        'assets/projects/newHouse/pic1.png',
        'assets/projects/newHouse/pic2.png',
        'assets/projects/newHouse/pic3.png',
      ],

      link: 'https://akhalisakhli.com/',
      github: 'https://github.com/WERSIT35/angular-wedding-landing',

      iflink: true,
      gradient: 'background-image: linear-gradient(90deg, #121829, #22315A);',

      role: 'Frontend delivery',
      year: 2024,
      status: 'live',
      featured: false,
      stack: ['Angular', 'SCSS', 'TypeScript'],
      metrics: [
        { label: 'Pages shipped', value: '4' },
        { label: 'Status', value: 'Live' },
      ],
    },
    {
      projName: 'PetC Platform',
      subname: 'Production-Grade Angular Application',

      date: 'Dec 2025-Present',

      about:
        'PetC Platform is a production-grade Angular application focused on shipping high-impact features with long-term maintainability. The frontend architecture uses Standalone Components, Signals, Lazy Loading, and modular boundaries to improve team velocity and reduce coupling between feature areas. Delivery work included feature stabilization, cleaner route-level loading strategy, and performance improvements through intentional code splitting aligned with real product usage.',
      numOfPage: 0,
      duration: 'Angular Architecture',
      highlights: [
        'Built and stabilized core production features in an active platform',
        'Applied Standalone Components, Signals, and Lazy Loading patterns',
        'Designed cleaner module boundaries for easier onboarding and ownership',
        'Optimized loading behavior with structured route-level code splitting',
        'Improved implementation consistency across shared product sections',
        'Aligned frontend architecture decisions with product delivery priorities',
      ],

      img: [],

      link: '#',
      github: 'https://github.com/WERSIT35/BetPilot',

      iflink: false,
      gradient: 'background-image: linear-gradient(90deg, #0f1722, #2a3e5f);',

      role: 'Angular engineer',
      year: 2025,
      status: 'in-production',
      featured: true,
      stack: ['Angular', 'Standalone Components', 'Signals', 'RxJS'],
      problem:
        'An active product platform needed cleaner module boundaries and faster route-level loading without freezing feature delivery.',
      approach: [
        'Adopted Standalone Components + Signals for new feature areas',
        'Restructured routing for true lazy loading per feature',
        'Aligned code splitting with real usage patterns from product analytics',
        'Drew clearer module ownership lines for team velocity',
      ],
      metrics: [
        { label: 'Status', value: 'In production' },
        { label: 'Architecture', value: 'Signals + Lazy' },
      ],
      lessons:
        'The biggest unlock was not the tech — it was matching code-split boundaries to how users actually move through the product. Bundles shrank where it mattered, not where it looked clever.',
    },
    {
      projName: 'HeatFlow',
      subname: 'Industrial Product Website',

      date: 'Client Delivery',

      about:
        'HeatFlow is an industrial product website focused on credibility, clarity, and conversion-friendly information delivery. The frontend is built around responsive layouts and structured content hierarchy for catalog-heavy pages, making technical product information easy to scan and compare. Special attention was given to consistent component composition, reliable visual rhythm, and smooth navigation between product categories across desktop and mobile.',
      numOfPage: 5,
      duration: 'Frontend Delivery',
      highlights: [
        'Responsive delivery for catalog-heavy industrial product content',
        'Clear information architecture for fast product discovery and comparison',
        'Structured component composition for scalable content updates',
        'Consistent visual hierarchy across desktop and mobile breakpoints',
        'Conversion-focused page flow for inquiry-oriented user journeys',
        'Clean navigation patterns for deeper category exploration',
      ],

      img: [
        'assets/projects/heatFlow/1.png',
        'assets/projects/heatFlow/2.png',
        'assets/projects/heatFlow/3.png',
        'assets/projects/heatFlow/4.png',
      ],

      link: 'https://heatflow.netlify.app',
      github: 'https://github.com/WERSIT35/Artisan-Marketplace',

      iflink: true,
      gradient:'background-image: linear-gradient(90deg, #221411,#643C2E);',

      role: 'Frontend delivery',
      year: 2024,
      status: 'live',
      featured: true,
      stack: ['Angular', 'SCSS', 'TypeScript'],
      problem:
        'An industrial supplier needed a credibility-first site where buyers could scan, compare and inquire about catalog-heavy product information fast.',
      approach: [
        'Catalog-heavy responsive layouts with consistent visual rhythm',
        'Information architecture optimized for scanning and comparison',
        'Reusable component composition for ongoing content updates',
      ],
      metrics: [
        { label: 'Pages shipped', value: '5' },
        { label: 'Status', value: 'Live' },
      ],
      demoEmbedUrl: 'https://heatflow.netlify.app',
    },

    // ── Placeholder #1 — TODO: fill in
    {
      projName: 'TODO — Project name',
      subname: 'TODO — One-line subtitle',
      date: 'TODO — e.g. 2026',
      about: 'TODO — Short paragraph about what this project does and who it serves.',
      numOfPage: 0,
      duration: 'TODO — Stack summary (e.g. Angular + FastAPI + Postgres)',
      highlights: [
        'TODO — Highlight 1',
        'TODO — Highlight 2',
        'TODO — Highlight 3',
      ],
      img: [
        // 'assets/projects/<folder>/1.png',
      ],
      link: '',
      github: '',
      iflink: false,
      gradient: 'background-image: linear-gradient(90deg, #1a1a2e, #3a3a5f);',

      role: 'TODO — Your role',
      year: 2026,
      status: 'in-production',
      featured: true,
      stack: ['TODO'],
      problem: 'TODO — 2-3 sentences on the problem this project solves.',
      approach: [
        'TODO — Key technical decision 1',
        'TODO — Key technical decision 2',
      ],
      metrics: [
        { label: 'TODO', value: 'TODO' },
      ],
      lessons: 'TODO — What you learned.',
      demoEmbedUrl: '',
    },

    // ── Placeholder #2 — TODO: fill in
    {
      projName: 'TODO — Project name',
      subname: 'TODO — One-line subtitle',
      date: 'TODO — e.g. 2026',
      about: 'TODO — Short paragraph about what this project does and who it serves.',
      numOfPage: 0,
      duration: 'TODO — Stack summary',
      highlights: [
        'TODO — Highlight 1',
        'TODO — Highlight 2',
      ],
      img: [],
      link: '',
      github: '',
      iflink: false,
      gradient: 'background-image: linear-gradient(90deg, #1f2937, #4b5563);',

      role: 'TODO — Your role',
      year: 2026,
      status: 'live',
      featured: true,
      stack: ['TODO'],
      problem: 'TODO — Problem statement.',
      approach: [
        'TODO — Decision 1',
      ],
      metrics: [
        { label: 'TODO', value: 'TODO' },
      ],
      lessons: 'TODO — Lessons learned.',
      demoEmbedUrl: '',
    },

    // ── Placeholder #3 — TODO: fill in
    {
      projName: 'TODO — Project name',
      subname: 'TODO — One-line subtitle',
      date: 'TODO — e.g. 2026',
      about: 'TODO — Short paragraph about what this project does and who it serves.',
      numOfPage: 0,
      duration: 'TODO — Stack summary',
      highlights: [
        'TODO — Highlight 1',
        'TODO — Highlight 2',
      ],
      img: [],
      link: '',
      github: '',
      iflink: false,
      gradient: 'background-image: linear-gradient(90deg, #0f172a, #1e3a8a);',

      role: 'TODO — Your role',
      year: 2026,
      status: 'live',
      featured: false,
      stack: ['TODO'],
      problem: 'TODO — Problem statement.',
      approach: [
        'TODO — Decision 1',
      ],
      metrics: [
        { label: 'TODO', value: 'TODO' },
      ],
      lessons: 'TODO — Lessons learned.',
      demoEmbedUrl: '',
    },
  ];

  constructor() {}

  getProjects(): Projects[] {
    return this.projectsList;
  }

  getProjectById(id: number): Projects | undefined {
    return this.projectsList[id];
  }

  getFeatured(): Projects[] {
    return this.projectsList.filter((p) => p.featured);
  }

  getNonFeatured(): Projects[] {
    return this.projectsList.filter((p) => !p.featured);
  }
}
