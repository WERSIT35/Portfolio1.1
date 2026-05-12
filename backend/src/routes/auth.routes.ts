import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validate.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { loginSchema } from '../schemas/auth.schemas.js';
import { login } from '../services/auth.service.js';
import { User } from '../models/User.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.sub);
    if (!user) throw new HttpError(404, 'User not found');
    res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
});

export default router;
