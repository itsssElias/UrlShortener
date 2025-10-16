import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import urlRoutes from './routes/url.routes';   // 👈

const app = express();

app.use(express.json());
app.use(cors({ origin: env.corsOrigin, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);               // 👈 MONTA AQUÍ

// Ruta pública para redirección corta (opcional, pero útil)
import Url from './models/Url';
app.get('/:code', async (req, res) => {
  try {
    const doc = await Url.findOne({ shortCode: req.params.code, isActive: true });
    if (!doc) return res.status(404).send('Short URL not found');
    if (doc.expiresAt && doc.expiresAt < new Date()) return res.status(410).send('Short URL expired');
    await Url.updateOne({ _id: doc._id }, { $inc: { clicks: 1 } });
    return res.redirect(302, doc.longUrl);
  } catch {
    return res.status(500).send('Server error');
  }
});

async function main() {
  await mongoose.connect(env.mongoUri);
  console.log('✅ MongoDB conectado');
  app.listen(env.port, () => console.log(`🚀 API en :${env.port}`));
}
main().catch(err => console.error('❌ Error al iniciar:', err));
