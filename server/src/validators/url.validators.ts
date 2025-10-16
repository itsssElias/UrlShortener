import { body } from 'express-validator';

export const createUrlValidator = [
  body('longUrl')
    .isURL({ protocols: ['http','https'], require_protocol: true })
    .withMessage('URL inválida. Debe empezar por http(s)://'),
  body('customCode')
    .optional()
    .matches(/^[0-9a-zA-Z_-]{3,30}$/)
    .withMessage('customCode inválido (3-30 alfanumérico, - y _)'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('expiresAt debe ser fecha ISO válida')
];

export const updateUrlValidator = [
  body('longUrl')
    .optional()
    .isURL({ protocols: ['http','https'], require_protocol: true })
    .withMessage('URL inválida'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser booleano'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('expiresAt debe ser fecha ISO válida')
];
