import { body } from 'express-validator';

export const registerValidator = [
  body('name').optional().isString().trim().isLength({ min: 1 }).withMessage('Nombre inválido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password inválido')
];
