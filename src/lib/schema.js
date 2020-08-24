const Joi = require('joi');
const { errors } = require('./routesUtil');

const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  userName: Joi.string().required(),
});

const validateSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const itemIdSchema = Joi.object().keys({
  id: Joi.number().required(),
});

const googleLoginSchema = Joi.object().keys({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
});

/**
 * Validate Joi schema against data
 * @param {Object} data Data
 * @param {Object} schema Joi schema
 */
async function validateJoi(data, schema) {
  try {
    await schema.validateAsync(data);
    return;
  } catch (err) {
    throw errors.badRequest('VALIDATION_ERROR', {
      details: err.details,
    });
  }
}

module.exports = {
  loginSchema,
  userSchema,
  validateSchema,
  itemIdSchema,
  googleLoginSchema,

  validateJoi,
}