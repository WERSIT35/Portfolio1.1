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
        'Linear Algebra and Analytical Geometry',
      ],
      description: `<p>During my Bachelor of Science in Information Technologies at the University of Georgia, I acquired a strong foundation in both theoretical and practical aspects of IT. I developed skills in cybersecurity, programming, and cloud technologies, gaining hands-on experience in Amazon AWS and Microsoft Azure platforms. My coursework also covered key subjects such as database design, operating systems, and computer networks, helping me build a comprehensive understanding of modern IT infrastructure.</p>
                <p>In addition to technical skills, I enhanced my problem-solving abilities through challenging courses in discrete mathematics, data structures, and algorithms. I also gained insights into business and project management through courses like IT Services and Project Management and Fundamentals of Economics and Business, which equipped me with the knowledge to effectively manage IT projects. This multidisciplinary approach prepared me to tackle real-world IT challenges with a holistic view.</p>`,
      date: '2019 | 2025',
    },
    {
      id: 2,
      img: '/assets/education/Universities/w3.png',
      name: 'w3schools',
      title: 'Information Technologies',
      degree: 'Computer Science',
      subjects: ['AWS', 'Sass', 'Python'],
      description:
        'Focused on acquiring in-depth knowledge in cloud computing with AWS, mastering web styling techniques using Sass, and building proficiency in Python for back-end development. This curriculum provided hands-on learning through interactive tutorials and real-world projects, enhancing both theoretical knowledge and practical problem-solving skills.',
      date: '2019 | 2025',
    },

    {
      id: 3,
      img: '/assets/education/Universities/fcc.svg',
      name: 'FreeCodeCamp',
      title: 'Information Technologies',
      degree: 'Computer Science',
      subjects: [
        'Responsive Web Design',
        'JavaScript Algorithms and Data Structures',
        'Front End Development Libraries Certification',
      ],
      description:
        'Completed several certifications in web development, focusing on modern front-end technologies such as responsive design, advanced JavaScript concepts, and popular development libraries like React. Gained hands-on experience by building various projects, mastering problem-solving skills, and refining knowledge in web design and development.',
      date: '2021 | 2025',
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
