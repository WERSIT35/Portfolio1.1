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
      name: "Freelancer Web Developer",
      subname: "Tools",
      subnameText:[ 
        "Angular TS | React TS",
        "JavaScript",
        "SASS/Tailwind",
        "jQuery | Redux",
        "Rest API",
      ],
      subname1: "Responsibilities",
      subname1Text: [
        "Design UI/UX",
        "Optimize Performance",
        "Responsive Design",
        "Timely Delivery",
        "Collaborative Approach",
        "Continuous Improvement",
      ],
      description:'',
      date: "2023 | Present",
    },
    {
      id: 2,
      name: "Google solution challenge hackathon",
      subname: "Winner",
      subnameText:[ 
        "Team: Convoy",
        "Project: Oceana",
        "About: Water pollution in the world",
      ],
      subname1: "Tools",
      subname1Text: [
        "NodeJS",
        "AngularTS",
        "Firebase",
        "Tailwind",
        "Bootstrap",
        "RestAPI",
      ],
      description:'',
      date: " 17 Dec 2023",
    },
    {
      id: 3,
      name: "IT Specialist | MyOffice",
      subname: "Responsibilities",
      subnameText: [
        "Manage daily IT operations.",
        "Provide tech support to staff.",
        "Monitor network and servers.",
        "Implement data security measures.",
        "Train staff on IT procedures."
      ],
      subname1: "Tools",
      subname1Text: [
        "Windows Server",
        "Active Directory",
        "Microsoft Office 365",
        "VMware",
        "Cisco Networking",
        "PowerShell Scripting"
      ],
      description: "As an IT Specialist at MyOffice, I managed and maintained IT infrastructure, provided technical support to staff, implemented security measures, and ensured smooth daily operations. I also trained employees on new IT systems and managed various tools such as Windows Server, Active Directory, Office 365, VMware, and Cisco Networking equipment.",
      date: "Jun 2023 | Nov 2023"
    }
  ];

  private certificateList:Certifications[] = [
    {
      id:1,
      name:'FreeCodeCamp',
      imageName:['Front End Development Libraries Certification'],
      image:['/assets/education/Certification/FreecodeCamp/libraries.png'],
      description:'',
      date:'',
    },
    {
      id:2,
      name:'FreeCodeCamp',
      imageName:['JavaScript Algorithms and Data Structures'],
      image:['/assets/education/Certification/FreecodeCamp/js.png'],
      description:'',
      date:'',
    },
    {
      id:3,
      name:'FreeCodeCamp',
      imageName:['Front End Development Libraries Certification'],
      image:['/assets/education/Certification/FreecodeCamp/responsive.png'],
      description:'',
      date:'',
    },
    {
      id:4,
      name:'w3schools',
      imageName:['Introduction to AWS Solutions'],
      image:['/assets/education/Certification/AWS/AWS.png'],
      description:'',
      date:'',
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
