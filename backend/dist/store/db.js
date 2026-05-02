import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { v4 as uuid } from "uuid";
import { config } from "../config.js";
import { hashPassword } from "../utils/auth.js";
const defaultContent = () => ({
    hero: {
        fullName: "OTAR DAVITASHVILI",
        headline: "Product-Focused Full-Stack Engineer",
        subheadline: "Angular & React Architecture Specialist",
        summary: "I build scalable frontend and full-stack systems with strong focus on clean architecture, performance, and production readiness.",
        image: "/assets/profile/last.png",
    },
    ctas: {
        resumeUrl: "/assets/me/OTAR DAVITASHVILI.pdf",
        projectsRoute: "/projects",
        contactRoute: "/contact",
    },
    skills: [],
    education: [],
    experience: [],
    certificates: [],
    projects: [],
    contact: {
        email: "otowork3@gmail.com",
        phone: "+995557282616",
        github: "https://github.com/WERSIT35",
        linkedin: "https://www.linkedin.com/in/otar-davitashvili/",
    },
    meta: {
        updatedAt: new Date().toISOString(),
    },
});
const defaultUsers = async () => {
    const now = new Date().toISOString();
    return [
        {
            id: uuid(),
            fullName: "Main Super Admin",
            email: "admin@portfolio.local",
            passwordHash: await hashPassword("Admin@12345"),
            role: "super_admin",
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: uuid(),
            fullName: "Content Editor",
            email: "editor@portfolio.local",
            passwordHash: await hashPassword("Editor@12345"),
            role: "editor",
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
    ];
};
const getDataPath = () => path.resolve(process.cwd(), config.dataFilePath);
export const ensureDb = async () => {
    const dbPath = getDataPath();
    const folder = path.dirname(dbPath);
    await mkdir(folder, { recursive: true });
    try {
        await readFile(dbPath, "utf-8");
    }
    catch {
        const seed = {
            users: await defaultUsers(),
            content: defaultContent(),
        };
        await writeFile(dbPath, JSON.stringify(seed, null, 2), "utf-8");
    }
};
export const readDb = async () => {
    const dbPath = getDataPath();
    const raw = await readFile(dbPath, "utf-8");
    return JSON.parse(raw);
};
export const writeDb = async (db) => {
    const dbPath = getDataPath();
    await writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");
};
