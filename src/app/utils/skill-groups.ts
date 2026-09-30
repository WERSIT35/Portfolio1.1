import { Skills } from '../interfaces/skills';

// Brand colours are deliberately not carried over: the site is strictly monochrome.
export interface SkillGroupItem {
  name: string;
  icon: string;
  rating: number;
  learned: string[];
  gained: string[];
}

export interface SkillGroup {
  category: string;
  items: SkillGroupItem[];
}

const CATEGORY_BY_SKILL: Record<string, string> = {
  Angular: 'Frontend',
  React: 'Frontend',
  TypeScript: 'Frontend',
  JavaScript: 'Frontend',
  RxJS: 'Frontend',
  SCSS: 'Frontend',
  HTML5: 'Frontend',
  'Node.js (Express)': 'Backend & APIs',
  Fastify: 'Backend & APIs',
  'Java (Spring Boot)': 'Backend & APIs',
  FastAPI: 'Backend & APIs',
  'REST API Design': 'Backend & APIs',
  'C#': 'Backend & APIs',
  PostgreSQL: 'Data',
  MySQL: 'Data',
  MongoDB: 'Data',
  Oracle: 'Data',
  Firebase: 'Data',
  Docker: 'Cloud & DevOps',
  Kubernetes: 'Cloud & DevOps',
  'CI/CD (GitHub Actions)': 'Cloud & DevOps',
  AWS: 'Cloud & DevOps',
  NGINX: 'Cloud & DevOps',
  'Applied AI / Claude': 'Applied AI & Security',
  'HMAC / Security': 'Applied AI & Security',
  'Parity Testing': 'Applied AI & Security',
  C: 'Embedded Systems',
  'Embedded Systems (STM32)': 'Embedded Systems',
};

const CATEGORY_ORDER = [
  'Frontend',
  'Backend & APIs',
  'Data',
  'Cloud & DevOps',
  'Applied AI & Security',
  'Embedded Systems',
];

export function groupSkills(skills: Skills): SkillGroup[] {
  const groups = new Map<string, SkillGroupItem[]>();

  skills.name.forEach((name, i) => {
    const category = CATEGORY_BY_SKILL[name] ?? 'Other';
    const items = groups.get(category) ?? [];
    items.push({
      name,
      icon: skills.icon[i],
      rating: skills.rating[i],
      learned: skills.learned[i] ?? [],
      gained: skills.gained[i] ?? [],
    });
    groups.set(category, items);
  });

  return CATEGORY_ORDER.filter((category) => groups.has(category)).map((category) => ({
    category,
    items: groups.get(category)!,
  }));
}
