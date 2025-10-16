import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { customAlphabet } from 'nanoid';
import Url from '../models/Url';
import { auth, AuthedRequest } from '../middleware/auth';
import { createUrlValidator, updateUrlValidator } from '../validators/url.validators';

const router = Router();
const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

/**
 * GET /api/urls  (lista con paginación + búsqueda)
 */
router.get('/', auth, async (req: AuthedRequest, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const q = (req.query.q as string) || '';

  const filter: any = { ownerId: req.user!.sub };
  if (q) filter.longUrl = { $regex: q, $options: 'i' };

  const [items, total] = await Promise.all([
    Url.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Url.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

/**
 * POST /api/urls  (crear)
 */
router.post('/', auth, createUrlValidator, async (req: AuthedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { longUrl, customCode, expiresAt } = req.body as {
    longUrl: string;
    customCode?: string;
    expiresAt?: string;
  };

  const shortCode = customCode || nano();
  const exists = await Url.findOne({ shortCode });
  if (exists) return res.status(409).json({ message: 'shortCode en uso' });

  const doc = await Url.create({
    ownerId: req.user!.sub,
    longUrl,
    shortCode,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined
  });

  res.status(201).json(doc);
});

/**
 * GET /api/urls/:id  (detalle)
 */
router.get('/:id', auth, async (req: AuthedRequest, res: Response) => {
  const item = await Url.findOne({ _id: req.params.id, ownerId: req.user!.sub });
  if (!item) return res.status(404).end();
  res.json(item);
});

/**
 * PUT /api/urls/:id  (actualizar)
 */
router.put('/:id', auth, updateUrlValidator, async (req: AuthedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const updated = await Url.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user!.sub },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).end();
  res.json(updated);
});

/**
 * DELETE /api/urls/:id  (eliminar)
 */
router.delete('/:id', auth, async (req: AuthedRequest, res: Response) => {
  const del = await Url.findOneAndDelete({ _id: req.params.id, ownerId: req.user!.sub });
  if (!del) return res.status(404).end();
  res.status(204).end();
});

export default router;
