import { Injectable } from '@angular/core';
import { Education } from '../interfaces/education';
import { Skills } from '../interfaces/skills';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor() {}
  protected skills: Skills[] = [
    {
      name: [
        'Angular',
        'React',
        'TypeScript',
        'JavaScript',
        'RxJS',
        'SCSS',
        'Node.js (Express)',
        'Java (Spring Boot)',
        'FastAPI',
        'REST API Design',
        'Docker',
        'Kubernetes',
        'CI/CD (GitHub Actions)',
        'AWS',
        'NGINX',
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Oracle',
      ],
      color: [
        '#DD0031', // Angular
        '#61DAFB', // React
        '#3178C6', // TypeScript
        '#F0DB4F', // JavaScript
        '#B7178C', // RxJS
        '#CC6699', // SCSS
        '#68A063', // Node.js
        '#EA2D2E', // Java
        '#009688', // FastAPI
        '#7BD4C6', // REST
        '#2496ED', // Docker
        '#326CE5', // Kubernetes
        '#2088FF', // GitHub Actions
        '#FF9900', // AWS
        '#5FCF80', // NGINX
        '#336791', // PostgreSQL
        '#4479A1', // MySQL
        '#47A248', // MongoDB
        '#EA1B22', // Oracle
      ],
      icon: [
        'devicon-angular-plain',
        'devicon-react-original',
        'devicon-typescript-plain',
        'devicon-javascript-plain',
        'devicon-rxjs-plain',
        'devicon-sass-original',
        'devicon-nodejs-plain',
        'devicon-java-plain',
        'devicon-fastapi-plain',
        'devicon-swagger-plain',
        'devicon-docker-plain',
        'devicon-kubernetes-plain',
        'devicon-githubactions-plain',
        'devicon-amazonwebservices-plain-wordmark colored',
        'devicon-nginx-original',
        'devicon-postgresql-plain',
        'devicon-mysql-plain',
        'devicon-mongodb-plain',
        'devicon-oracle-plain',
      ],
      learned:[
        ['Freelance Production Work','PetC'],
        ['Freelance Production Work','PetC'],
        ['Freelance Production Work','University of Georgia'],
        ['Freelance Production Work','University of Georgia'],
        ['Angular Production Work'],
        ['Angular + React Frontend Architecture'],
        ['Freelance Full-Stack Work'],
        ['Academic + Production Projects'],
        ['Backend Service Development'],
        ['Production API Contract Work'],
        ['Containerized Deployment Workflows'],
        ['Container Orchestration Practice'],
        ['Release Pipelines & Automation'],
        ['Cloud Deployment Practice'],
        ['Production Deployment Strategies'],
        ['E-Commerce Data Layer'],
        ['Relational Data Modeling'],
        ['Product Data Storage'],
        ['University of Georgia Coursework'],
      ],
      geined:[
        ['Modular architecture','Lazy loading','Signals'],
        ['Component-driven systems','Reusable UI patterns'],
        ['Type-safe contracts','Maintainability'],
        ['ES6+ patterns','Performance-aware code'],
        ['Reactive state composition'],
        ['Structured design systems'],
        ['Auth/cart/order workflow support'],
        ['Enterprise backend integration'],
        ['Secure API implementation'],
        ['Contract-first thinking'],
        ['Portable environments'],
        ['Scalable deployments'],
        ['Reliable release flow'],
        ['Cloud-ready deployment'],
        ['Reverse proxy + serving strategy'],
        ['SQL optimization'],
        ['Relational query tuning'],
        ['Document data handling'],
        ['Schema and query fundamentals'],
      ],
      rating:[
        5,5,5,5,4,5,5,4,4,5,5,3,4,4,4,4,4,4,4
      ]
    },
  ];
  protected education: Education[] = [
    {
      id: 1,
      img: '/assets/education/Universities/ug.png',
      name: 'University of Georgia',
      title: 'Computer Science',
      degree: 'BSc Computer Science',
      subjects: [
        'Data Structures and Algorithms',
        'Computer Networks',
        'Operating Systems',
        'Object-Oriented Programming',
        'Oracle Database Design and Programming',
        'Introduction to Web Technologies',
        'IT Services and Project Management',
        'Discrete Mathematics',
        'Computer Architecture',
      ],
      description: `<p>Completed Bachelor-level computer science studies with focus on software engineering foundations and system-oriented coursework.</p>
                <p>Built strong fundamentals in algorithms, backend logic, architecture thinking, and database systems that now support production full-stack delivery.</p>`,
      date: '2019-2025',
    },
    {
      id: 2,
      img: '/assets/education/Universities/btu.png',
      name: 'Business and Technology University',
      title: 'DevOps',
      degree: 'MSc DevOps - In Progress',
      subjects: [
        'Containerization and orchestration',
        'Cloud infrastructure',
        'CI/CD systems',
        'Production deployment strategies',
      ],
      description:
        'Currently pursuing MSc DevOps with expected graduation in 2026, focused on production-grade deployment standards and scalable infrastructure practices.',
      date: 'Expected 2026',
    },

    {
      id: 3,
      img: '/assets/education/Universities/fcc.svg',
      name: 'FreeCodeCamp',
      title: 'Frontend + Cloud Foundations',
      degree: 'Professional Certificates',
      subjects: [
        'Responsive Web Design',
        'JavaScript Algorithms and Data Structures',
        'Front-End Development Libraries',
        'Introduction to AWS Solutions',
      ],
      description:
        'Completed focused certification path to strengthen practical frontend architecture and cloud fundamentals used in production work.',
      date: 'Ongoing',
    },
  ];

  getEducation(): Education[] {
    return this.education;
  }

  getEduId(id: number): Education | undefined {
    return this.education.find((sitem) => sitem.id === id);
  }

  getSkills(): Skills[] {
    return this.skills;
  }
}
