import { Router } from 'express';
import { requireAuth, canWriteContent } from '../middleware/auth.js';
import { isSectionKey } from '../schemas/content.schemas.js';
import { writeSection } from '../services/content.service.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

router.put('/:section', requireAuth, canWriteContent, async (req, res, next) => {
  try {
    const section = req.params.section;
    if (!isSectionKey(section)) throw new HttpError(404, 'Unknown section');
    const updated = await writeSection(section, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
