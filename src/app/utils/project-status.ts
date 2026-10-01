import { Projects } from '../interfaces/projects';

const STATUS_LABEL: Record<Projects['status'], string> = {
  live: 'Live',
  'in-production': 'In Production',
  'in-development': 'In Development',
  prototype: 'Prototype',
};

export function projectStatusLabel(status: Projects['status']): string {
  return STATUS_LABEL[status];
}
