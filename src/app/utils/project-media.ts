import { Projects } from '../interfaces/projects';

const isMobileShot = (src: string): boolean => /Mob\.[a-z]+$/i.test(src);

export function desktopShots(project: Projects): string[] {
  return project.img.filter((src) => !isMobileShot(src));
}

export function mobileShots(project: Projects): string[] {
  return project.img.filter(isMobileShot);
}
