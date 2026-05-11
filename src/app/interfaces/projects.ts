export type ProjectStatus = 'live' | 'in-production' | 'archived' | 'private';

export interface ProjectMetric {
    label: string;
    value: string;
}

export interface Projects {
    projName: string;
    subname: string;

    date: string;
    about: string;
    numOfPage: number;
    duration: string;
    img: string[];
    link: string;
    github: string;
    iflink: boolean;

    gradient: string;
    highlights?: string[];

    role?: string;
    year?: number;
    status?: ProjectStatus;
    featured?: boolean;
    problem?: string;
    approach?: string[];
    metrics?: ProjectMetric[];
    lessons?: string;
    demoEmbedUrl?: string;
    stack?: string[];
}
