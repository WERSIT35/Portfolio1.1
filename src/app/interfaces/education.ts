export interface Education {
    id: number;
    img: string;
    name: string;
    title: string;
    degree: string;
    subjects: string[];
    description: string;
    date: string;

    /** Optional wide banner image for /alledu cards. If absent, a gradient placeholder is shown. */
    coverImage?: string;
    coverAlt?: string;
    /** Optional small logo override (defaults to `img`). */
    logo?: string;
  }
