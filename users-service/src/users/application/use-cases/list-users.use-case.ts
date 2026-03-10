import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import * as userRepositoryPort from '../ports/user.repository.port';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(userRepositoryPort.USER_REPOSITORY)
    private readonly userRepository: userRepositoryPort.UserRepositoryPort,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
