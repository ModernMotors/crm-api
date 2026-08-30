import Joi from 'joi';

const settingSchema = Joi.object({
  key: Joi.string()
    .pattern(/^[a-z0-9_]+$/)
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'Setting key must contain only lowercase letters, numbers, and underscores',
      'any.required': 'Setting key is required'
    }),
  value: Joi.string().allow('').allow(null),
  value_type: Joi.string()
    .valid('string', 'number', 'boolean', 'json', 'date')
    .default('string')
    .messages({
      'any.only': 'Value type must be one of: string, number, boolean, json, date'
    }),
  category: Joi.string()
    .valid('general', 'branch', 'vehicle', 'appointment', 'contact', 'helpdesk', 'system', 'notification')
    .default('general')
    .messages({
      'any.only': 'Category must be one of: general, branch, vehicle, appointment, contact, helpdesk, system, notification'
    }),
  description: Joi.string().allow('').allow(null),
  is_public: Joi.boolean().default(false),
  is_editable: Joi.boolean().default(true)
});

const updateSettingSchema = Joi.object({
  value: Joi.string().allow('').allow(null).required(),
  value_type: Joi.string()
    .valid('string', 'number', 'boolean', 'json', 'date')
    .optional()
    .messages({
      'any.only': 'Value type must be one of: string, number, boolean, json, date'
    }),
  description: Joi.string().allow('').allow(null).optional(),
  is_public: Joi.boolean().optional(),
  is_editable: Joi.boolean().optional()
});

const bulkUpdateSchema = Joi.object({
  settings: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().allow('').allow(null).required()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one setting must be provided',
      'any.required': 'Settings array is required'
    })
});

export const validateSetting = (req, res, next) => {
  const { error, value } = settingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  req.validatedData = value;
  next();
};

export const validateUpdateSetting = (req, res, next) => {
  const { error, value } = updateSettingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  req.validatedData = value;
  next();
};

export const validateBulkUpdate = (req, res, next) => {
  const { error, value } = bulkUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  req.validatedData = value;
  next();
};
