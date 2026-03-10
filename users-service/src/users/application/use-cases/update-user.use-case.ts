import { Inject, Injectable } from '@nestjs/common';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports/user.repository.port';

export interface UpdateUserCommand {
  id: string;
  name?: string;
  role?: UserRole;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const existing = await this.userRepository.findById(command.id);
    if (!existing) throw new UserNotFoundException(command.id);

    const updated = new User(
      existing.id,
      existing.email,
      command.name ?? existing.name,
      command.role ?? existing.role,
      existing.createdAt,
    );
    return this.userRepository.save(updated);
  }
}
