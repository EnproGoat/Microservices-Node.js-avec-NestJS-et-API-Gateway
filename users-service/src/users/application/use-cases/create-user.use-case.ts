import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports/user.repository.port';

export interface CreateUserCommand {
  email: string;
  name: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new UserAlreadyExistsException(command.email);
    }
    const user = new User(randomUUID(), command.email, command.name);
    return this.userRepository.save(user);
  }
}
