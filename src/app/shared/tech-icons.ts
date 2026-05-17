export interface TechIcon {
  icon: string;   // devicon CSS class
  color: string;  // brand hex color
}

const MAP: Record<string, TechIcon> = {
  // Frontend
  'Angular':            { icon: 'devicon-angular-plain',                   color: '#DD0031' },
  'Angular SSR':        { icon: 'devicon-angular-plain',                   color: '#DD0031' },
  'Standalone Components': { icon: 'devicon-angular-plain',                color: '#DD0031' },
  'Signals':            { icon: 'devicon-angular-plain',                   color: '#DD0031' },
  'React':              { icon: 'devicon-react-original',                  color: '#61DAFB' },
  'TypeScript':         { icon: 'devicon-typescript-plain',                color: '#3178C6' },
  'JavaScript':         { icon: 'devicon-javascript-plain',                color: '#F0DB4F' },
  'RxJS':               { icon: 'devicon-rxjs-plain',                      color: '#B7178C' },
  'SCSS':               { icon: 'devicon-sass-original',                   color: '#CC6699' },
  'HTML5':              { icon: 'devicon-html5-plain',                     color: '#E34F26' },
  // Mobile
  'Flutter':            { icon: 'devicon-flutter-plain',                   color: '#02569B' },
  'Dart':               { icon: 'devicon-dart-plain',                      color: '#0175C2' },
  // Backend
  'Node.js':            { icon: 'devicon-nodejs-plain',                    color: '#68A063' },
  'Node.js (Express)':  { icon: 'devicon-nodejs-plain',                    color: '#68A063' },
  'FastAPI':            { icon: 'devicon-fastapi-plain',                   color: '#009688' },
  'Java (Spring Boot)': { icon: 'devicon-spring-plain',                   color: '#6DB33F' },
  'Spring Boot':        { icon: 'devicon-spring-plain',                    color: '#6DB33F' },
  'C#':                 { icon: 'devicon-csharp-plain',                    color: '#239120' },
  'REST API Design':    { icon: 'devicon-swagger-plain',                   color: '#7BD4C6' },
  // Data
  'PostgreSQL':         { icon: 'devicon-postgresql-plain',                color: '#336791' },
  'MySQL':              { icon: 'devicon-mysql-plain',                     color: '#4479A1' },
  'MongoDB':            { icon: 'devicon-mongodb-plain',                   color: '#47A248' },
  'Oracle':             { icon: 'devicon-oracle-plain',                    color: '#EA1B22' },
  'Firebase':           { icon: 'devicon-firebase-plain',                  color: '#FFCA28' },
  // Infrastructure
  'Docker':             { icon: 'devicon-docker-plain',                    color: '#2496ED' },
  'Kubernetes':         { icon: 'devicon-kubernetes-plain',                color: '#326CE5' },
  'k3s':                { icon: 'devicon-kubernetes-plain',                color: '#326CE5' },
  'AWS':                { icon: 'devicon-amazonwebservices-plain-wordmark', color: '#FF9900' },
  'NGINX':              { icon: 'devicon-nginx-original',                  color: '#5FCF80' },
  'CI/CD (GitHub Actions)': { icon: 'devicon-githubactions-plain',         color: '#2088FF' },
  'GitHub Actions':     { icon: 'devicon-githubactions-plain',             color: '#2088FF' },
};

export function getTechIcon(name: string): TechIcon | null {
  return MAP[name] ?? null;
}

export function hasTechIcon(name: string): boolean {
  return name in MAP;
}
