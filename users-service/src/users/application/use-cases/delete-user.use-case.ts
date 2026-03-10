import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import * as userRepositoryPort from '../ports/user.repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(userRepositoryPort.USER_REPOSITORY)
    private readonly userRepository: userRepositoryPort.UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new UserNotFoundException(id);
    await this.userRepository.delete(id);
  }
}
