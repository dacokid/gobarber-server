import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

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
  token: string;
}

class AuthenticationUserService {
  public async execute({ email, password }: Request): Promise<UserResponse> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrent email/password combination');
    }

    const token = sign({}, '3d1f871ac137682b9fd182b94805839e', {
      subject: user.id,
      expiresIn: '1d'
    });

    return {
      user,
      token
    };
  }
}

export default AuthenticationUserService;
