import { getAllContent, getContentSection, updateContentSection, } from "../services/content.service.js";
const editableSections = [
    "hero",
    "ctas",
    "skills",
    "education",
    "experience",
    "certificates",
    "projects",
    "contact",
    "meta",
];
const isEditableSection = (section) => editableSections.includes(section);
export const readContent = async (_req, res) => {
    const content = await getAllContent();
    res.json(content);
};
export const readSection = async (req, res) => {
    const { section } = req.params;
    if (!isEditableSection(section)) {
        res.status(404).json({ message: "Unknown content section" });
        return;
    }
    const data = await getContentSection(section);
    res.json(data);
};
export const writeSection = async (req, res) => {
    const { section } = req.params;
    if (!isEditableSection(section)) {
        res.status(404).json({ message: "Unknown content section" });
        return;
    }
    const updated = await updateContentSection(section, req.body);
    res.json(updated);
};
