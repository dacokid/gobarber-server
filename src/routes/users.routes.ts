import { Router } from 'express';
import User from '../models/User';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

interface UserResponse {
  name: string;
  email: string;
  password?: string;
}

export class UserMap {
  public static toDto(user: User): any {
    return {
      name: user.name,
      email: user.email,
    };
  }
}

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user: UserResponse = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
