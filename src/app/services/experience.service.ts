import { Injectable } from '@angular/core';
import { Experience } from '../interfaces/experience';
import { Certifications } from '../interfaces/certifications';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor() { }


  private experienceList:Experience[]=[
    {
      id: 1,
      name: "Angular Developer | PetC",
      subname: "Core Contributions",
      subnameText:[
        "Own development of 4 core platform features",
        "Architect frontend with Standalone Components, Signals, and Lazy Loading",
        "Apply modular structure for production readiness",
        "Align API contracts and UI architecture with backend and design teams",
      ],
      subname1: "Impact",
      subname1Text: [
        "Improve load performance through structured code splitting strategy",
        "Refactor shared modules to stabilize core platform systems",
        "Maintain structured engineering standards in product delivery",
      ],
      description:'Product-focused Angular engineering within a production-grade platform environment with emphasis on performance, modularity, and architecture quality.',
      date: "Dec 2025-Present",
    },
    {
      id: 2,
      name: "Full-Stack Developer | Freelance",
      subname: "Core Contributions",
      subnameText:[ 
        "Architect and ship modular full-stack systems using Angular, React and Node.js",
        "Design REST endpoints supporting authentication, cart, and order workflows",
        "Build secure JWT authentication pipelines",
      ],
      subname1: "Technical Focus",
      subname1Text: [
        "Optimize database queries and API flows",
        "Containerize services using Docker",
        "Deliver maintainable product-oriented architecture",
      ],
      description:'Freelance full-stack delivery focused on structured systems, API reliability, and deployment-ready implementation.',
      date: "Sept 2024-Present",
    },
    {
      id: 3,
      name: "Product-Focused Full-Stack Engineer",
      subname: "Frontend",
      subnameText:[ 
        "Angular (v17+), React, TypeScript, Modern JavaScript (ES6+), RxJS, SCSS, HTML5",
        "Component-Based Architecture",
      ],
      subname1: "Backend & Platform",
      subname1Text: [
        "Node.js (Express), Java (Spring Boot), C#, Python (FastAPI)",
        "RESTful API Design, Authentication & Authorization",
        "Docker, Kubernetes, CI/CD Pipelines (GitHub Actions), AWS, NGINX",
      ],
      description:'Production-grade application architecture with strong emphasis on modular frontend systems, scalable API design, and deployment strategy.',
      date: "Core Skill Stack",
    },
    {
      id: 4,
      name: "Flagship Project | GiftShop",
      subname: "Platform Scope",
      subnameText: [
        "Architect modular e-commerce platform with separated frontend/backend layers",
        "Develop reusable Angular components integrated with REST services",
        "Implement cart, order validation, and secure authentication",
      ],
      subname1: "Delivery",
      subname1Text: [
        "Configure Dockerized development and deployment environments",
        "Apply production-oriented code organization",
      ],
      description: "GiftShop - Modular Full-Stack E-Commerce Platform | Angular + Node.js + Docker",
      date: "Flagship Project"
    }
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
