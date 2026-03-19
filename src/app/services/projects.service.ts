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
      gradient:'background-image: linear-gradient(90deg, #221411,#643C2E);'
    },
  ];

  constructor() {}

  getProjects(): Projects[] {
    return this.projectsList;
  }

  getProjectById(id: number): Projects | undefined {
    return this.projectsList[id];
  }
}
