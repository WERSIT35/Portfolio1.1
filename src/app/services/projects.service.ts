import { Injectable } from '@angular/core';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  protected projectsList: Projects[] = [
    {
      projName: 'Shello',
      subname: 'Full-Stack E-Commerce Platform — Angular SSR + Node.js',

      date: 'Production',

      about:
        'Shello is a production-grade full-stack e-commerce platform built with Angular SSR and Node.js, focused on performance, security, scalable architecture, and a clear frontend/backend separation. The backend exposes versioned REST APIs with secure authentication (refresh tokens in HttpOnly cookies, Google OAuth, MFA, and role-based access control) over an Express/TypeScript service backed by MongoDB. The Angular SSR frontend ships with RxJS, SCSS, an admin dashboard, and role-aware routing. The whole stack is containerized with Docker and prepared for Kubernetes-ready deployment with optimized MongoDB schemas and API workflows.',
      numOfPage: 12,
      duration: 'Angular SSR + Node.js + Docker',
      highlights: [
        'Production-grade full-stack e-commerce platform on Angular SSR + Node.js',
        'Modular architecture with versioned REST APIs and clear frontend/backend separation',
        'Secure auth: refresh tokens in HttpOnly cookies, Google OAuth, MFA, role-based access',
        'Containerized with Docker and prepared for Kubernetes-ready deployment',
        'Optimized MongoDB schemas and API workflows for production load',
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
      stack: ['Angular SSR', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes'],
      problem:
        'Ship a production-grade e-commerce platform where the frontend and backend can evolve independently, the auth flow holds up under real users, and the deployment story is the same on day one as on day one-hundred.',
      approach: [
        'Modular architecture with versioned REST APIs and clear frontend/backend separation',
        'Refresh tokens in HttpOnly cookies, Google OAuth, MFA, and role-based access control',
        'Angular SSR frontend with RxJS, SCSS, and role-aware routing',
        'Containerized with Docker; Kubernetes-ready deployment topology',
        'Optimized MongoDB schemas and API workflows tuned for production load',
      ],
      metrics: [
        { label: 'Stack', value: 'Angular SSR + Node' },
        { label: 'Auth', value: 'Cookies + OAuth + MFA' },
        { label: 'Deployment', value: 'Docker + K8s-ready' },
      ],
      lessons:
        'Layering refresh tokens in HttpOnly cookies on top of MFA and RBAC forced a cleaner separation between session state and UI state — which is exactly what made bolting on the admin dashboard cheap later.',
      demoEmbedUrl: 'https://shellotech.eu.org',
    },
    {
      projName: 'Elite Weddings',
      subname: 'Premium Wedding Landing Platform — Angular + Node.js',

      date: 'Live',

      about:
        'Elite Weddings is a premium bilingual wedding landing platform built with Angular and Node.js, designed for luxury wedding planning, destination wedding presentation, and high-quality lead capture. The platform includes modular landing sections such as Hero, Essentials, About, Gallery, FAQ, Contact, and Footer, with structured content management and inline admin editing. The backend supports secure admin authentication with JWT and TOTP MFA, role-based admin endpoints, RSVP and inquiry workflows, validation, rate limiting, deduplication, daily caps, captcha protection, and spike-alert style safeguards. The project follows a production-oriented architecture with Dockerized services, deployment-ready configuration, and clean frontend/backend separation.',

      numOfPage: 8,
      duration: 'Angular + Node.js + Docker',

      highlights: [
        'Premium bilingual EN/KA wedding landing platform',
        'Modular Angular sections for Hero, Essentials, About, Gallery, FAQ, Contact, and Footer',
        'Inline admin editing for structured content management',
        'Secure admin JWT authentication with TOTP MFA and role-based access',
        'RSVP and inquiry pipeline with validation, rate limiting, deduplication, captcha, and daily caps',
        'Dockerized and deployment-ready production structure',
      ],

      img: [
        'assets/projects/EliteWeddings/Pic1Web.png',
        'assets/projects/EliteWeddings/Pic1Mob.png',
        'assets/projects/EliteWeddings/Pic2Web.png',
        'assets/projects/EliteWeddings/Pic2Mob.png',
        'assets/projects/EliteWeddings/Pic3Web.png',
        'assets/projects/EliteWeddings/Pic3Mob.png',
        'assets/projects/EliteWeddings/Pic4Web.png',
        'assets/projects/EliteWeddings/Pic5Web.png',
        'assets/projects/EliteWeddings/Pic6Web.png',
        'assets/projects/EliteWeddings/Pic7Web.png',
        'assets/projects/EliteWeddings/Pic8Web.png',
      ],

      link: 'https://elitewe.com.ge/',
      github: 'https://github.com/WERSIT35/angular-wedding-landing',

      iflink: true,
      gradient: 'background-image: linear-gradient(90deg, #15161a, #34302c);',

      role: 'Full-stack engineer',
      year: 2026,
      status: 'live',
      featured: true,

      stack: [
        'Angular',
        'Node.js',
        'Express',
        'JWT',
        'TOTP MFA',
        'Docker',
        'k3s',
      ],

      problem:
        'Build a premium wedding platform that presents luxury destination wedding services, supports bilingual Georgian/English content, captures qualified inquiries, and allows secure admin-side content updates without turning the site into a heavy CMS.',

      approach: [
        'Designed a modular Angular landing architecture with reusable content sections',
        'Implemented bilingual EN/KA content structure for Georgian and international audiences',
        'Built secure admin authentication using JWT and TOTP MFA',
        'Created role-based admin endpoints for users, profile, content, and content-management workflows',
        'Developed RSVP and inquiry workflows with validation, rate limiting, deduplication, captcha, daily caps, and spike-alert safeguards',
        'Prepared Dockerized deployment flow with production-ready environment configuration',
      ],

      metrics: [
        { label: 'Type', value: 'Premium landing platform' },
        { label: 'UX', value: 'Bilingual EN/KA' },
        { label: 'Admin', value: 'JWT + TOTP MFA' },
        { label: 'Deployment', value: 'Docker + k3s-ready' },
      ],

      lessons:
        'A luxury service platform needs more than visuals — the lead-capture flow, content editing model, and admin security have to be designed like product infrastructure from the beginning. Keeping the landing sections modular made it easier to refine the brand presentation without touching the backend workflow.',

      demoEmbedUrl: 'https://elitewe.com.ge/',
    },
    {
      projName: 'TatooGen',
      subname: 'AI Tattoo Design Generator — Flutter + Node.js + OpenAI Images',

      date: 'Development',

      about:
        'TatooGen is an AI-powered tattoo design generator built with a Flutter mobile app and a Node.js/Express backend. The app guides users through a tattoo idea flow with style, placement, size, complexity, and optional reference image controls, then generates custom tattoo concepts through an async backend workflow powered by OpenAI Images. The backend handles multipart generation requests, status polling, image retrieval, prompt construction, rate limiting, upload handling, and API protection using Helmet, CORS, Morgan, and express-rate-limit. The Flutter app supports Android, iOS, and Web with Riverpod state management, GoRouter navigation, Dio API communication, and save/share functionality for generated results.',

      numOfPage: 9,
      duration: 'Flutter + Node.js + OpenAI Images',

      highlights: [
        'Cross-platform Flutter app for Android, iOS, and Web',
        'Guided tattoo idea flow with quiz and structured design form',
        'Style, placement, size, complexity, and reference-image controls',
        'Async generation workflow with create, poll, and fetch-image endpoints',
        'Node.js/Express backend integrated with OpenAI Images',
        'Secure API setup with Multer, Helmet, CORS, Morgan, and rate limiting',
        'Save and share generated tattoo results inside the mobile app',
      ],

      img: [
        'assets/projects/TatooGen/Pic1Web.png',
        'assets/projects/TatooGen/Pic2Web.png',
        'assets/projects/TatooGen/Pic3Web.png',
        'assets/projects/TatooGen/Pic4Web.png',
        'assets/projects/TatooGen/Pic5Web.png',

        'assets/projects/TatooGen/Pic1Mob.png',
        'assets/projects/TatooGen/Pic2Mob.png',
        'assets/projects/TatooGen/Pic3Mob.png',
        'assets/projects/TatooGen/Pic4Mob.png',
      ],

      link: '',
      github: 'https://github.com/WERSIT35/tattoo-generator-app',

      iflink: false,
      gradient: 'background-image: linear-gradient(90deg, #121316, #2b2f36);',

      role: 'Full-stack mobile engineer',
      year: 2025,
      status: 'in-production',
      featured: true,

      stack: [
        'Flutter',
        'Riverpod',
        'GoRouter',
        'Dio',
        'Node.js',
        'Express',
        'OpenAI SDK',
        'Multer',
        'Helmet',
        'CORS',
        'Rate Limiting',
      ],

      problem:
        'Create a guided AI tattoo design experience where users can describe an idea, control visual direction, optionally upload a reference image, and receive generated tattoo concepts through a reliable mobile-first workflow.',

      approach: [
        'Built a Flutter mobile app with Riverpod state management, GoRouter navigation, and Dio API communication',
        'Created a guided tattoo idea flow using a quiz and structured design form',
        'Added controls for tattoo style, placement, size, complexity, gender, and optional reference image upload',
        'Designed an async backend workflow using POST /api/generate, GET /api/status/:predictionId, and GET /api/image/:predictionId',
        'Implemented a Node.js/Express API with OpenAI Images integration and prompt-building utilities',
        'Added upload handling with Multer and API protection with Helmet, CORS, Morgan, and express-rate-limit',
        'Prepared local setup documentation, GitHub hygiene rules, and secret-safe environment configuration',
      ],

      metrics: [
        { label: 'Mobile', value: 'Flutter + Riverpod' },
        { label: 'Backend', value: 'Node.js + Express' },
        { label: 'AI', value: 'OpenAI Images' },
        { label: 'Flow', value: 'Async generation' },
      ],

      lessons:
        'AI image generation works best when the product flow collects structured intent before calling the model. Splitting the experience into a guided design form, prompt builder, async generation endpoint, polling status route, and final image fetch made the system easier to reason about across both the Flutter app and backend API.',

      demoEmbedUrl: '',
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
      gradient: 'background-image: linear-gradient(90deg, #221411,#643C2E);',

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
  ];

  constructor() { }

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
