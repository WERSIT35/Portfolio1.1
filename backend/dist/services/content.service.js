import { readDb, writeDb } from "../store/db.js";
export const getAllContent = async () => {
    const db = await readDb();
    return db.content;
};
export const getContentSection = async (section) => {
    const db = await readDb();
    return db.content[section];
};
export const updateContentSection = async (section, data) => {
    const db = await readDb();
    db.content[section] = data;
    db.content.meta = {
        ...(db.content.meta || {}),
        updatedAt: new Date().toISOString(),
    };
    await writeDb(db);
    return db.content;
};
