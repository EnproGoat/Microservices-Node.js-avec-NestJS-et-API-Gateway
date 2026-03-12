import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as userRepositoryPort from './application/ports/user.repository.port';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { MongoUserRepository } from './infrastructure/repositories/mongo-user.repository';
import { UserDocument, UserSchema } from './infrastructure/schemas/user.schema';
import { UsersController } from './adapter/in/http/users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    { provide: userRepositoryPort.USER_REPOSITORY, useClass: MongoUserRepository },
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [userRepositoryPort.USER_REPOSITORY],
})
export class UsersModule {}
