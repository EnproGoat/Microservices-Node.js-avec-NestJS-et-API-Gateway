import { Module } from '@nestjs/common';
import * as userRepositoryPort from './application/ports/user.repository.port';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { UsersController } from './adapter/in/http/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: userRepositoryPort.USER_REPOSITORY, useClass: InMemoryUserRepository },
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
