require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const Joi = require('joi');

// Validated once at boot so a missing/malformed env var fails loudly and
// immediately, instead of surfacing later as a cryptic runtime error
// (e.g. jwt.sign() throwing because JWT_SECRET was undefined).
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().integer().default(5000),
  POSTGRES_URI: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  JWT_SECRET: Joi.string().min(16).required(),
  REFRESH_SECRET: Joi.string().min(16).required(),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),
  CORS_ORIGIN: Joi.string().uri().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Invalid/missing environment variables: ${error.message}`);
}

module.exports = {
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,
  POSTGRES_URI: value.POSTGRES_URI,
  JWT_SECRET: value.JWT_SECRET,
  REFRESH_SECRET: value.REFRESH_SECRET,
  EMAIL_USER: value.EMAIL_USER,
  EMAIL_PASS: value.EMAIL_PASS,
  CORS_ORIGIN: value.CORS_ORIGIN,
  isProduction: value.NODE_ENV === 'production',
};
