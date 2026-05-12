import { Router } from 'express';
import { isSectionKey } from '../schemas/content.schemas.js';
import { readSection } from '../services/content.service.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

router.get('/:section', async (req, res, next) => {
  try {
    const section = req.params.section;
    if (!isSectionKey(section)) throw new HttpError(404, 'Unknown section');
    const data = await readSection(section);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
