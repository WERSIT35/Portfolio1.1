import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { requireAuth, canWriteContent } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

const allowedMime = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.resolve(env.UPLOAD_DIR)),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      return cb(new HttpError(400, `Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

router.post('/', requireAuth, canWriteContent, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'No file uploaded');
    const url = `${env.PUBLIC_UPLOAD_PATH}/${req.file.filename}`;
    res.status(201).json({ url, filename: req.file.filename, size: req.file.size });
  } catch (err) {
    next(err);
  }
});

export default router;
