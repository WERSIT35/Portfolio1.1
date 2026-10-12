/** A public repository on the GitHub profile, used as evidence for skills. */
export interface Repository {
  name: string;
  url: string;
  /** Technologies the repository itself shows (its language and description). */
  stack: string[];
}
