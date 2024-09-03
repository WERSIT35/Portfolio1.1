import { Injectable } from '@angular/core';
import { Experience } from '../interfaces/experience';

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
      date: "2023 | Present",
    },
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
      subname1: "Senior Software Developer",
      subname1Text: [
        "Design UI/UX",
        "Optimize Performance",
        "Responsive Design",
        "Timely Delivery",
        "Collaborative Approach",
        "Continuous Improvement",
      ],
      date: "2023 | Present",
    },
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
      subname1: "Senior Software Developer",
      subname1Text: [
        "Design UI/UX",
        "Optimize Performance",
        "Responsive Design",
        "Timely Delivery",
        "Collaborative Approach",
        "Continuous Improvement",
      ],
      date: "2023 | Present",
    },
  ];


  getExperienceList():Experience[]{
    return this.experienceList;
  }
}
