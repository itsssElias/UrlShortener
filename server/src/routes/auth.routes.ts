import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import User from '../models/User';
import { registerValidator, loginValidator } from '../validators/auth.validators';
import { env } from '../config/env';
import { auth, AuthedRequest } from '../middleware/auth';

const router = Router();

/**
 * Registro de usuario
 */
router.post('/register', registerValidator, async (req: Request, res: Response) => {
  try {
    console.log('🧠 Body recibido en /register:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('❌ Validación falló:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body as {
      name?: string;
      email: string;
      password: string;
    };

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    console.log(`✅ Usuario registrado: ${user.email}`);
    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err: any) {
    console.error('💥 Error en /register:', err.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * Inicio de sesión
 */
router.post('/login', loginValidator, async (req: Request, res: Response) => {
  try {
    console.log('🔑 Login body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('❌ Validación falló (login):', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, {
      expiresIn: '7d',
    });

    console.log(`✅ Login exitoso: ${email}`);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err: any) {
    console.error('💥 Error en /login:', err.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * Obtener perfil de usuario (requiere token)
 */
router.get('/me', auth, async (req: AuthedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.sub).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json(user);
  } catch (err: any) {
    console.error('💥 Error en /me:', err.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
