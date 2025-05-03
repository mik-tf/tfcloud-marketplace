import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

/**
 * Validate request middleware
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array()
    });
  }
  
  next();
};

/**
 * Deployment validation rules
 */
export const deploymentValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('resources.cpu')
    .notEmpty().withMessage('CPU count is required')
    .isInt({ min: 1, max: 64 }).withMessage('CPU count must be between 1 and 64'),
  
  body('resources.memory')
    .notEmpty().withMessage('Memory is required')
    .isInt({ min: 1, max: 256 }).withMessage('Memory must be between 1 and 256 GB'),
  
  body('resources.storage')
    .notEmpty().withMessage('Storage is required')
    .isInt({ min: 10, max: 10000 }).withMessage('Storage must be between 10 and 10000 GB'),
  
  body('billing.planId')
    .notEmpty().withMessage('Plan ID is required')
    .isString().withMessage('Plan ID must be a string'),
  
  body('billing.amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  
  body('billing.currency')
    .notEmpty().withMessage('Currency is required')
    .isString().withMessage('Currency must be a string')
    .isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  
  body('billing.interval')
    .notEmpty().withMessage('Billing interval is required')
    .isIn(['hourly', 'daily', 'monthly']).withMessage('Billing interval must be hourly, daily, or monthly'),
  
  validate
];

/**
 * Provider request validation rules
 */
export const providerRequestValidationRules = [
  body('nodeDetails.location')
    .notEmpty().withMessage('Location is required')
    .isString().withMessage('Location must be a string'),
  
  body('nodeDetails.resources.cpu')
    .notEmpty().withMessage('CPU count is required')
    .isInt({ min: 1 }).withMessage('CPU count must be at least 1'),
  
  body('nodeDetails.resources.memory')
    .notEmpty().withMessage('Memory is required')
    .isInt({ min: 1 }).withMessage('Memory must be at least 1 GB'),
  
  body('nodeDetails.resources.storage')
    .notEmpty().withMessage('Storage is required')
    .isInt({ min: 10 }).withMessage('Storage must be at least 10 GB'),
  
  body('contactInfo.email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  body('contactInfo.phone')
    .optional()
    .isMobilePhone('any').withMessage('Phone number must be valid'),
  
  validate
];

/**
 * Payment intent validation rules
 */
export const paymentIntentValidationRules = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.5 }).withMessage('Amount must be at least 0.5'),
  
  body('currency')
    .notEmpty().withMessage('Currency is required')
    .isString().withMessage('Currency must be a string')
    .isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 255 }).withMessage('Description cannot exceed 255 characters'),
  
  validate
];

/**
 * ID parameter validation rule
 */
export const idParamValidationRule = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isString().withMessage('ID must be a string'),
  
  validate
];

/**
 * Pagination query validation rules
 */
export const paginationValidationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  validate
];