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
        'Javascript',
        'Java',
        'C#',
        'C++',
        'Algorithms',
        'SQL',
        'Oracle',
        'Angular',
        'React',
      ],
      color: [
        '#F0DB4F', // Javascript
        '#007ACC', // Typescript
        '#EA2D2E', // Java
        '#68217A', // C#
        '#004482', // C++
        '#4D5360', // Algorithms
        '#005BA1', // SQL
        '#EA1B22', // Oracle
        '#DD0031', // Angular
        '#60D7F5'  //React
      ],
      icon: [
        'devicon-javascript-plain',
        'devicon-typescript-plain',
        'devicon-java-plain',
        'devicon-csharp-plain',
        'devicon-cplusplus-plain',
        'devicon-thealgorithms-plain',
        'devicon-azuresqldatabase-plain',
        'devicon-oracle-plain',
        'devicon-angular-plain',
        'devicon-react-original'
      ],
    },
  ];
  protected education: Education[] = [
    {
      img: '/assets/education/Universities/ug.png',
      name: 'University Of Georgia',
      title: 'Information Technologies',
      degree: 'Bachelor of Science',
      subjects: ['java/C#/C++/OOP', 'Aws/Azure', '...See all'],
      date: '2019 | 2025',
    },
    {
      img: '/assets/education/Universities/w3.png',
      name: 'University of New York',
      title: 'Bachelor of Science',
      degree: 'Computer Science',
      subjects: ['Data Structures', 'Algorithms', '...See all'],
      date: '2019 | 2025',
    },
    {
      img: '/assets/education/Universities/fcc.svg',
      name: 'FreeCodeCamp',
      title: 'Bachelor of Science',
      degree: 'Computer Science',
      subjects: ['Data Structures', 'Algorithms', '...See all'],
      date: '2019 | 2025',
    },
  ];

  getEducation(): Education[] {
    return this.education;
  }

  getSkills(): Skills[] {
    return this.skills;
  }
}
