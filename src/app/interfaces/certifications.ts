import { IssuerId } from './issuers';

export interface Certifications {
  id: number;
  name: string;
  imageName: string[];
  image: string[];
  issuerId?: IssuerId;
  certificateUrl?: string;
  description: string;
  date: string;
  issuer: string;
  issued: string;
  skills: string[];
  timeSpent: string;
  tasksMade: string[];
}
