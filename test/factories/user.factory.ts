import { User } from '@entities/User.entity';
import { AppDataSource } from '@config/database';
import { EntityManager } from 'typeorm';

export const createUser = async (data: Partial<User> = {}, transactionalEntityManager?: EntityManager): Promise<User> => {
  const userRepository = transactionalEntityManager ? transactionalEntityManager.getRepository(User) : AppDataSource.getRepository(User);
  
  const user = userRepository.create({
    name: `Test User ${Date.now()}`,
    ...data
  });

  return await userRepository.save(user);
}; 