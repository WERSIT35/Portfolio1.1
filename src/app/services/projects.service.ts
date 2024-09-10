import { Injectable } from '@angular/core';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  protected projectsList : Projects[]=[
    {
      projName:"HeatFlow",
      date:"18/6/2024",

      about:'One of my proudest projects was creating an industrial website for HeatFlow. Built using Angular, the website showcases hundreds of tubular heating elements, complete with detailed product specifications and company information. I was responsible for both the front-end development and UI/UX design, ensuring that the site was user-friendly, visually appealing, and responsive across all devices. The goal was to provide a seamless experience for users in the industrial sector, allowing easy navigation through a vast inventory of products.',
      numOfPage:5,
      duration:"1 Week",

      img:[
        "assets/projects/heatFlow/1.png",
        "assets/projects/heatFlow/2.png",
        "assets/projects/heatFlow/3.png",
        "assets/projects/heatFlow/4.png",  
      ],

      link:"https://heatflow.netlify.app",

      iflink:true,
    },
    {
      projName:"Akhali Sakhli",
      date:"4/5/2024",

      about:"Another project I worked on was for Akhali Sakhli, a development company that specializes in designing and repairing houses. For this website, I focused on creating the front end and designing a clean and modern UI/UX. The site was designed to highlight the company's services and portfolio, ensuring a user-friendly experience for potential clients and homeowners interested in their work.",
      numOfPage:26,
      duration:"1 month",

      img:[
        "assets/projects/newHouse/landing.png",
        "assets/projects/newHouse/pic1.png",
        "assets/projects/newHouse/pic2.png",
        "assets/projects/newHouse/pic3.png",  
      ],

      link:"https://akhalisakhli.com/",

      iflink:true,
    },
    {
      projName:"Cyber Blog",
      date:"1/1/2023",

      about:"Built a sleek cyber blog website for cybersecurity enthusiasts. Features latest trends, news, and interactive discussions. Responsive design ensures seamless browsing on all devices. Engaging content and visuals enhance user experience.",
      numOfPage:12,
      duration:"1 month",

      img:[
        "assets/projects/cyberBlog/landing.png",
        "assets/projects/cyberBlog/pic1.png",
        "assets/projects/cyberBlog/pic2.png",
        "assets/projects/cyberBlog/pic3.png",  
      ],

      link:"https://cyberblogug.netlify.app/",

      iflink:true,
    },
    {
      projName:"Achuke Gift Store",
      date:"4/2/2023",

      about:"Designed and developed Achuke Gift Store's online presence, featuring shop, and company details. Built with user-friendly navigation and responsive design for seamless viewing across devices. Incorporated engaging graphics and intuitive UI elements for an enhanced user experience.",
      numOfPage:5,
      duration:"3 Day",

      img:[
        "assets/projects/achuke/landing.png",
        "assets/projects/achuke/pic1.png",
        "assets/projects/achuke/pic2.png",
        "assets/projects/achuke/pic3.png",  
      ],

      link:"http://achukegiftstore.netlify.app/",

      iflink:true,
    },
  ]

  constructor() { }
}
