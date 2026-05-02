import { readDb, writeDb } from "../store/db.js";
import { ContentDocument } from "../types/models.js";

type EditableSection = keyof ContentDocument;

export const getAllContent = async (): Promise<ContentDocument> => {
  const db = await readDb();
  return db.content;
};

export const getContentSection = async (
  section: EditableSection
): Promise<ContentDocument[EditableSection]> => {
  const db = await readDb();
  return db.content[section];
};

export const updateContentSection = async (
  section: EditableSection,
  data: unknown
): Promise<ContentDocument> => {
  const db = await readDb();
  (db.content[section] as unknown) = data;
  db.content.meta = {
    ...(db.content.meta || {}),
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.content;
};
