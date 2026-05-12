import { z } from 'zod';

export const experienceSchema = z.object({
  id: z.number().int(),
  role: z.string().min(1),
  company: z.string().min(1),
  date: z.string().min(1),
  summary: z.string().min(1),
  chips: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
  order: z.number().int().optional(),
});

export const experienceListSchema = z.array(experienceSchema);

export const projectMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  projName: z.string().min(1),
  subname: z.string().default(''),
  date: z.string().default(''),
  about: z.string().default(''),
  numOfPage: z.number().int().nonnegative().default(0),
  duration: z.string().default(''),
  img: z.array(z.string()).default([]),
  link: z.string().default(''),
  github: z.string().default(''),
  iflink: z.boolean().default(false),
  gradient: z.string().default(''),
  highlights: z.array(z.string()).optional(),
  role: z.string().optional(),
  year: z.number().int().optional(),
  status: z.enum(['live', 'in-production', 'archived', 'private']).optional(),
  featured: z.boolean().optional(),
  problem: z.string().optional(),
  approach: z.array(z.string()).optional(),
  metrics: z.array(projectMetricSchema).optional(),
  lessons: z.string().optional(),
  demoEmbedUrl: z.string().optional(),
  stack: z.array(z.string()).optional(),
  order: z.number().int().optional(),
});

export const projectListSchema = z.array(projectSchema);

export const educationSchema = z.object({
  id: z.number().int(),
  img: z.string().min(1),
  name: z.string().min(1),
  title: z.string().default(''),
  degree: z.string().default(''),
  subjects: z.array(z.string()).default([]),
  description: z.string().default(''),
  date: z.string().default(''),
  coverImage: z.string().optional(),
  coverAlt: z.string().optional(),
  logo: z.string().optional(),
  order: z.number().int().optional(),
});

export const educationListSchema = z.array(educationSchema);

export const certificationSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  imageName: z.array(z.string()).default([]),
  image: z.array(z.string()).default([]),
  description: z.string().default(''),
  date: z.string().default(''),
  issuer: z.string().default(''),
  issued: z.string().default(''),
  skills: z.array(z.string()).default([]),
  timeSpent: z.string().default(''),
  tasksMade: z.array(z.string()).default([]),
  order: z.number().int().optional(),
});

export const certificationListSchema = z.array(certificationSchema);

export const skillsSchema = z.object({
  name: z.array(z.string()).default([]),
  color: z.array(z.string()).default([]),
  icon: z.array(z.string()).default([]),
  learned: z.array(z.unknown()).default([]),
  geined: z.array(z.unknown()).default([]),
  rating: z.array(z.number()).default([]),
});

export const heroSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  tagline: z.string().default(''),
  description: z.string().default(''),
}).passthrough();

export const ctasSchema = z.array(
  z.object({
    label: z.string(),
    href: z.string(),
    icon: z.string().optional(),
    style: z.string().optional(),
  })
).or(z.record(z.unknown()));

export const contactSchema = z.object({
  name: z.string().default(''),
  surname: z.string().default(''),
  image: z.string().default(''),
  phone: z.string().default(''),
  X: z.string().default(''),
  instagram: z.string().default(''),
  facebook: z.string().default(''),
  email: z.string().default(''),
  github: z.string().default(''),
  linkedin: z.string().default(''),
  location: z.string().default(''),
});

export const sectionSchemas = {
  experience: experienceListSchema,
  projects: projectListSchema,
  education: educationListSchema,
  certificates: certificationListSchema,
  skills: skillsSchema,
  hero: heroSchema,
  ctas: ctasSchema,
  contact: contactSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];

export const isSectionKey = (k: string): k is SectionKey =>
  (sectionKeys as string[]).includes(k);
