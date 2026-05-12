import { Injectable } from '@angular/core';
import { Experience } from '../interfaces/experience';
import { Certifications } from '../interfaces/certifications';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor() { }

  private experienceList: Experience[] = [
    {
      id: 1,
      role: 'Angular Developer',
      company: 'PetC',
      date: 'Dec 2025 – Present',
      summary:
        'Product-focused Angular engineering within a production-grade platform environment, with emphasis on performance, modularity, and architecture quality.',
      chips: [
        'Own development of 4 core platform features',
        'Architect frontend with Standalone Components, Signals, and Lazy Loading',
        'Align API contracts and UI architecture with backend and design teams',
      ],
      bullets: [
        'Improve load performance through structured code splitting strategy',
        'Refactor shared modules to stabilize core platform systems',
        'Maintain structured engineering standards in product delivery',
      ],
    },
    {
      id: 3,
      role: 'AML & Game Control Officer',
      company: 'Betlive',
      date: 'Sep 2024 – Present',
      summary:
        'iGaming AML and game-control role focused on real-time transaction monitoring, fraud detection, SQL-based anomaly analysis, and cross-team operational stability.',
      chips: [
        'Monitor real-time financial transactions across a high-volume iGaming platform',
        'Detect fraud patterns, bonus abuse, and suspicious user behavior',
        'Perform SQL-based analysis to trace transaction flows and anomalies',
      ],
      bullets: [
        'Collaborate with risk, payments, and technical teams to resolve system issues',
        'Investigate platform inconsistencies and support operational stability',
        'Generate financial and operational reports for internal decision-making',
      ],
    },
    {
      id: 2,
      role: 'Full-Stack Developer',
      company: 'Freelance',
      date: 'Sep 2024 – Present',
      summary:
        'Freelance full-stack delivery focused on modular Angular and Node.js systems, secure APIs, authentication flows, and Dockerized deployment.',
      chips: [
        'Architect and ship modular full-stack systems using Angular and Node.js',
        'Design REST endpoints supporting authentication, cart, and order workflows',
        'Build secure JWT authentication pipelines',
      ],
      bullets: [
        'Optimize database queries and API flows',
        'Containerize services using Docker',
        'Deliver maintainable product-oriented architecture',
      ],
    },
  ];

  private certificateList:Certifications[] = [
    {
      id:1,
      name:'FreeCodeCamp',
      imageName:['Front-End Development Libraries'],
      image:['/assets/education/Certification/FreecodeCamp/libraries.png'],
      description:'Front-End Development Libraries certification focused on practical component-driven frontend implementation with real project delivery patterns.',
      date:'Certificate',
      issuer:'FreeCodeCamp',
      issued:'2024',
      skills:['React', 'Redux', 'Bootstrap', 'jQuery', 'SASS'],
      timeSpent:'~300 hours',
      tasksMade:[
        'Build reusable React components',
        'Implement state management patterns',
        'Create project-level UI modules',
      ],
    },
    {
      id:2,
      name:'FreeCodeCamp',
      imageName:['JavaScript Algorithms and Data Structures'],
      image:['/assets/education/Certification/FreecodeCamp/js.png'],
      description:'JavaScript Algorithms and Data Structures certification validating problem-solving and language fundamentals.',
      date:'Certificate',
      issuer:'FreeCodeCamp',
      issued:'2023',
      skills:['JavaScript', 'Algorithms', 'Data Structures', 'ES6+'],
      timeSpent:'~300 hours',
      tasksMade:[
        'Solve algorithmic coding challenges',
        'Practice data structure implementation',
        'Write optimized JavaScript logic',
      ],
    },
    {
      id:3,
      name:'FreeCodeCamp',
      imageName:['Responsive Web Design'],
      image:['/assets/education/Certification/FreecodeCamp/responsive.png'],
      description:'Responsive Web Design certification focused on adaptive layout systems and semantic frontend structure.',
      date:'Certificate',
      issuer:'FreeCodeCamp',
      issued:'Aug 14, 2023',
      skills:['HTML5', 'CSS3', 'Responsive Layout', 'Accessibility'],
      timeSpent:'~300 hours',
      tasksMade:[
        'Build responsive pages with CSS Grid/Flexbox',
        'Apply semantic HTML structure',
        'Improve accessibility and layout consistency',
      ],
    },
    {
      id:4,
      name:'w3schools',
      imageName:['Introduction to AWS Solutions'],
      image:['/assets/education/Certification/AWS/AWS.png'],
      description:'Introduction to AWS Solutions certificate supporting cloud deployment and infrastructure foundations.',
      date:'Certificate',
      issuer:'w3schools',
      issued:'2024',
      skills:['AWS Core Services', 'Cloud Basics', 'Architecture Fundamentals'],
      timeSpent:'~30 hours',
      tasksMade:[
        'Understand AWS service landscape',
        'Model basic cloud architecture choices',
        'Apply cloud deployment fundamentals',
      ],
    },
  ];


  getCertificate():Certifications[]{
    return this.certificateList;
  }

  getCertifyId(id:number):Certifications | undefined{
    return this.certificateList.find(cert => cert.id === id);
  }

  getExperienceList():Experience[]{
    return this.experienceList;
  }

  getExpId(id:number):Experience | undefined {
    return this.experienceList.find(exp => exp.id === id)
  }
}
