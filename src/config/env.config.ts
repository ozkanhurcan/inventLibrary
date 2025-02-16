import Joi from 'joi';
import { AppError } from '@middleware/error.handler';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().required(),
}).unknown();

const validateEnv = (): void => {
  const { error, value } = envSchema.validate(process.env);

  if (error) {
    throw new AppError(500, `Environment validation error: ${error.message}`);
  }

  process.env = { ...process.env, ...value };
};

export default validateEnv; 