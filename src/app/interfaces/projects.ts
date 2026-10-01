export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Projects {
  slug: string;
  projName: string;
  subname: string;
  date: string;
  about: string;
  numOfPage: number;
  duration: string;
  highlights: string[];
  img: string[];
  link: string;
  github: string;
  iflink: boolean;
  gradient: string;
  role: string;
  year: number;
  status: 'live' | 'in-production' | 'in-development' | 'prototype';
  featured: boolean;
  stack: string[];
  problem?: string;
  approach?: string[];
  metrics?: ProjectMetric[];
  lessons?: string;
  demoEmbedUrl?: string;
}
