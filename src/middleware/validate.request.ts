import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '@middleware/error.handler';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      throw new AppError(400, error.details[0].message);
    }
    
    next();
  };
}; 