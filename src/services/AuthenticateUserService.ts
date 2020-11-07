import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface UserResponse {
  user: {
    email: string;
    password?: string;
  };
}

class AuthenticationUserService {
  public async execute({ email, password }: Request): Promise<UserResponse> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email/password combination');
    }

    // user.password - Senha criptografada
    // password = - Senha nào-criptografada

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrent email/password combination');
    }

    //  Usuário autenticado

    return {
      user,
    };
  }
}

export default AuthenticationUserService;
