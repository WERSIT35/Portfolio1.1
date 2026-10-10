import { Projects } from '../interfaces/projects';

const isMobileShot = (src: string): boolean => /Mob\.[a-z]+$/i.test(src);

export function desktopShots(project: Projects): string[] {
  return project.img.filter((src) => !isMobileShot(src));
}

export function mobileShots(project: Projects): string[] {
  return project.img.filter(isMobileShot);
}

// Intrinsic sizes for width/height attributes: they only reserve the aspect ratio before
// the file arrives (no layout shift); CSS still sets the rendered size.
const DESKTOP_SHOT = { width: 1600, height: 760 };
const MOBILE_SHOT = { width: 380, height: 820 };

export function shotSize(src: string): { width: number; height: number } {
  return isMobileShot(src) ? MOBILE_SHOT : DESKTOP_SHOT;
}

// Desktop shots are 1600px wide with an -800w sibling (scripts/optimize-images.mjs), so
// phones and 1x screens skip the full file. Phone shots are ~380px; they need no srcset.
export function shotSrcset(src: string): string | null {
  if (isMobileShot(src) || !src.endsWith('.webp')) return null;
  return `${src.replace(/\.webp$/, '-800w.webp')} 800w, ${src} 1600w`;
}
