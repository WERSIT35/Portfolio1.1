import { Injectable } from '@angular/core';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  protected projectsList: Projects[] = [
    {
      projName: 'GiftShop',
      subname: 'Modular Full-Stack E-Commerce Platform',

      date: 'Flagship Project',

      about:
        'Architect modular e-commerce platform with separated frontend/backend layers. Develop reusable Angular components integrated with REST services. Implement cart, order validation, and secure authentication. Configure Dockerized development and deployment environments.',
      numOfPage: 5,
      duration: 'Angular + Node.js + Docker',

      img: [
        'assets/projects/achuke/landing.png',
        'assets/projects/achuke/pic1.png',
        'assets/projects/achuke/pic2.png',
        'assets/projects/achuke/pic3.png',
      ],

      link: 'http://achukegiftstore.netlify.app/',

      iflink: true,
      gradient:'background-image: linear-gradient(90deg, #10222A, #1E4A54);'
    },
    {
      projName: 'PetC Platform',
      subname: 'Production-Grade Angular Application',

      date: 'Dec 2025-Present',

      about:
        "Own development of 4 core platform features within a production-grade Angular environment. Architect frontend using Standalone Components, Signals, Lazy Loading, and modular structure while improving load performance through structured code splitting.",
      numOfPage: 4,
      duration: 'Angular Architecture',

      img: [
        'assets/projects/newHouse/landing.png',
        'assets/projects/newHouse/pic1.png',
        'assets/projects/newHouse/pic2.png',
        'assets/projects/newHouse/pic3.png',
      ],

      link: 'https://akhalisakhli.com/',

      iflink: true,
      gradient:'background-image: linear-gradient(90deg, #121829,#22315A);'
    },
    {
      projName: 'HeatFlow',
      subname: 'Industrial Product Website',

      date: 'Client Delivery',

      about:
        'Production-focused frontend delivery with clear information architecture, responsive layout, and structured component composition for catalog-heavy product content.',
      numOfPage: 5,
      duration: 'Frontend Delivery',

      img: [
        'assets/projects/heatFlow/1.png',
        'assets/projects/heatFlow/2.png',
        'assets/projects/heatFlow/3.png',
        'assets/projects/heatFlow/4.png',
      ],

      link: 'https://heatflow.netlify.app',

      iflink: true,
      gradient:'background-image: linear-gradient(90deg, #221411,#643C2E);'
    },
  ];

  constructor() {}

  getProjects(): Projects[] {
    return this.projectsList;
  }
}
