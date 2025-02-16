import Joi from 'joi';

export const createBookSchema = Joi.object({
  name: Joi.string().required().min(1).max(200)
});

export const returnBookSchema = Joi.object({
  score: Joi.number().min(0).max(10).required()
}); 