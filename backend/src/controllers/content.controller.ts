import { Request, Response } from "express";
import {
  getAllContent,
  getContentSection,
  updateContentSection,
} from "../services/content.service.js";
import { ContentDocument } from "../types/models.js";

const editableSections: Array<keyof ContentDocument> = [
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

const isEditableSection = (section: string): section is keyof ContentDocument =>
  editableSections.includes(section as keyof ContentDocument);

export const readContent = async (_req: Request, res: Response): Promise<void> => {
  const content = await getAllContent();
  res.json(content);
};

export const readSection = async (req: Request, res: Response): Promise<void> => {
  const { section } = req.params;
  if (!isEditableSection(section)) {
    res.status(404).json({ message: "Unknown content section" });
    return;
  }
  const data = await getContentSection(section);
  res.json(data);
};

export const writeSection = async (req: Request, res: Response): Promise<void> => {
  const { section } = req.params;
  if (!isEditableSection(section)) {
    res.status(404).json({ message: "Unknown content section" });
    return;
  }
  const updated = await updateContentSection(section, req.body);
  res.json(updated);
};
