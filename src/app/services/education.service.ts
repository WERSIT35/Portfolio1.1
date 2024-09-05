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
        'Typescript',
        'Java',
        'C#',
        'C++',
        'Algorithms',
        'SQL',
        'Oracle',
        'Angular',
        'React',
        'Azure',
        'Aws',
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
        '#60D7F5', //React
        '#0C8BBE', //Azure
        '#FF9900', //Aws
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
        'devicon-react-original',
        'devicon-azure-plain colored',
        'devicon-amazonwebservices-plain-wordmark colored',
      ],
    },
  ];
  protected education: Education[] = [
    {
      id: 1,
      img: '/assets/education/Universities/ug.png',
      name: 'University Of Georgia',
      title: 'Information Technologies',
      degree: 'Bachelor of Science',
      subjects: [
        'Introduction to Cyber Security',
        'IT Services and Project Management',
        'Calculus II',
        'Operating System Linux',
        'Programming Language Java I',
        'Computer Networks I',
        'Oracle Database Design and Programming',
        'Microsoft Azure Security Technologies',
        'Amazon AWS Security Technologies',
        'Microsoft Azure Administration',
        'Amazon AWS Architecture',
        'Geoinformatics',
        'Visual Programming (C#) I',
        'Fundamentals of Economics and Business',
        'Fundamentals of Physics',
        'English Language VI (B2/2)',
        'Introduction to Web Technologies',
        'Academic Writing',
        'Discrete Mathematics',
        'Data Structures and Algorithms',
        'Operating System (Windows)',
        'Computer Architecture',
        'Object-Oriented Programming C++',
        'Data Structures and Algorithms',
        'Calculus II',
        'Fundamentals of Physics',
        'English Language IV (B1/2)',
        'Office Systems',
        'Programming Fundamentals (C++)',
        'Linear Algebra and Analytical Geometry'
      ],
      date: '2019 | 2025',
    },
    {
      id: 2,
      img: '/assets/education/Universities/w3.png',
      name: 'w3schools',
      title: 'Information Technologies',
      degree: 'Computer Science',
      subjects: ['Aws', 'Sass', 'Python'],
      date: '2019 | 2025',
    },
    {
      id: 3,
      img: '/assets/education/Universities/fcc.svg',
      name: 'FreeCodeCamp',
      title: 'Information Technologies',
      degree: '',
      subjects: [
        'Responsive Web Design',
        'JavaScript Algorithms and Data Structures',
        'Front End Development Libraries Certification',
      ],
      date: '2019 | 2025',
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
