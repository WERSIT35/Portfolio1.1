export interface Experience {
    id: number;

    /** Actual job title — primary heading on every Experience surface. */
    role: string;

    /** Employer name. */
    company: string;

    /** Date range as displayed (e.g. "Dec 2025 – Present"). */
    date: string;

    /** 1–2 line role summary. */
    summary: string;

    /** 2–3 highlighted contributions shown as chips. */
    chips: string[];

    /** 2–3 supporting bullet points. */
    bullets: string[];

    /** Primary technologies used in this role — drives the tech icon strip. */
    stack?: string[];
}
