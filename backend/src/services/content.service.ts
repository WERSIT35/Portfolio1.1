import { Section } from '../models/Section.js';
import { Experience } from '../models/Experience.js';
import { Project } from '../models/Project.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { sectionSchemas, type SectionKey } from '../schemas/content.schemas.js';

const stripMeta = <T extends { toJSON?: () => unknown }>(doc: T) => {
  const obj = (doc as any).toJSON ? (doc as any).toJSON() : doc;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;
  return obj;
};

export async function readSection(key: SectionKey): Promise<unknown> {
  switch (key) {
    case 'experience': {
      const docs = await Experience.find().sort({ order: 1, id: 1 }).lean();
      return docs.map(({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest);
    }
    case 'projects': {
      const docs = await Project.find().sort({ order: 1, createdAt: 1 });
      return docs.map(stripMeta);
    }
    case 'education': {
      const docs = await Education.find().sort({ order: 1, id: 1 }).lean();
      return docs.map(({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest);
    }
    case 'certificates': {
      const docs = await Certification.find().sort({ order: 1, id: 1 }).lean();
      return docs.map(({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest);
    }
    case 'skills':
    case 'hero':
    case 'ctas':
    case 'contact': {
      const doc = await Section.findOne({ key });
      return doc ? doc.data : defaultFor(key);
    }
  }
}

function defaultFor(key: SectionKey): unknown {
  if (key === 'skills') return { name: [], color: [], icon: [], learned: [], geined: [], rating: [] };
  if (key === 'hero') return {};
  if (key === 'ctas') return [];
  if (key === 'contact')
    return { name: '', surname: '', image: '', phone: '', X: '', instagram: '', facebook: '', email: '', github: '', linkedin: '', location: '' };
  return null;
}

export async function writeSection(key: SectionKey, payload: unknown): Promise<unknown> {
  const schema = sectionSchemas[key];
  const parsed = schema.parse(payload);

  switch (key) {
    case 'experience': {
      await Experience.deleteMany({});
      await Experience.insertMany(parsed as any[]);
      return readSection(key);
    }
    case 'projects': {
      const items = parsed as Array<Record<string, unknown> & { id?: string }>;
      await Project.deleteMany({});
      const sanitized = items.map(({ id, ...rest }) => rest);
      await Project.insertMany(sanitized);
      return readSection(key);
    }
    case 'education': {
      await Education.deleteMany({});
      await Education.insertMany(parsed as any[]);
      return readSection(key);
    }
    case 'certificates': {
      await Certification.deleteMany({});
      await Certification.insertMany(parsed as any[]);
      return readSection(key);
    }
    case 'skills':
    case 'hero':
    case 'ctas':
    case 'contact': {
      await Section.findOneAndUpdate(
        { key },
        { key, data: parsed },
        { upsert: true, new: true }
      );
      return parsed;
    }
  }
}
