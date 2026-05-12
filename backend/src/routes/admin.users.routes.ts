import { Router } from 'express';
import { requireAuth, isSuperAdmin, type AuthedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/auth.schemas.js';
import { User } from '../models/User.js';
import { hashPassword } from '../services/auth.service.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

router.use(requireAuth, isSuperAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map((u) => u.toJSON()));
  } catch (err) {
    next(err);
  }
});

router.post('/', validateBody(createUserSchema), async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) throw new HttpError(409, 'Email already in use');

    const passwordHash = await hashPassword(req.body.password);
    const user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email.toLowerCase(),
      role: req.body.role,
      passwordHash,
    });
    res.status(201).json(user.toJSON());
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validateBody(updateUserSchema), async (req: AuthedRequest, res, next) => {
  try {
    const update: Record<string, unknown> = {};
    if (req.body.fullName !== undefined) update.fullName = req.body.fullName;
    if (req.body.role !== undefined) update.role = req.body.role;
    if (req.body.isActive !== undefined) update.isActive = req.body.isActive;
    if (req.body.password) update.passwordHash = await hashPassword(req.body.password);

    if (req.user!.sub === req.params.id && req.body.role && req.body.role !== 'super_admin') {
      throw new HttpError(400, 'Cannot demote yourself');
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) throw new HttpError(404, 'User not found');
    res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: AuthedRequest, res, next) => {
  try {
    if (req.user!.sub === req.params.id) {
      throw new HttpError(400, 'Cannot delete yourself');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
