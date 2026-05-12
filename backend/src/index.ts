import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import adminContentRoutes from './routes/admin.content.routes.js';
import adminUsersRoutes from './routes/admin.users.routes.js';
import adminUploadsRoutes from './routes/admin.uploads.routes.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use(env.PUBLIC_UPLOAD_PATH, express.static(path.resolve(env.UPLOAD_DIR)));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin/content', adminContentRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/uploads', adminUploadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`[api] listening on :${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('[db] connection failed:', err);
    process.exit(1);
  });
