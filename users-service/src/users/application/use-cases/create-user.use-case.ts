import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import * as userRepositoryPort from '../ports/user.repository.port';

export interface CreateUserCommand {
  email: string;
  name: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(userRepositoryPort.USER_REPOSITORY)
    private readonly userRepository: userRepositoryPort.UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new UserAlreadyExistsException(command.email);
    }
    const user = new User(randomUUID(), command.email, command.name, command.password, command.role);
    return this.userRepository.save(user);
  }
}
