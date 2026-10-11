/** Credential issuers that have an official logo file in /assets/logos. */
export type IssuerId = 'anthropic' | 'freecodecamp' | 'w3schools';

export interface IssuerLogo {
  /** Brand name as the issuer writes it (used for the alt text). */
  name: string;
  src: string;
  /** Intrinsic size of the SVG's viewBox, so the rendered width can be reserved up front. */
  width: number;
  height: number;
}
