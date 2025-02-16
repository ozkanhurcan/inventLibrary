import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(100)
}); 