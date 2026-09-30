export interface Experience {
  id: number;
  role: string;
  company: string;
  /** e.g. 'Full-time', 'Freelance', 'Contract'; omitted when not stated. */
  employment?: string;
  /** 'Mon YYYY – Mon YYYY' or 'Mon YYYY – Present'. */
  date: string;
  /** The role in its own words; the UI splits it into sentences (lead + numbered lines). */
  summary: string;
  stack: string[];
}
