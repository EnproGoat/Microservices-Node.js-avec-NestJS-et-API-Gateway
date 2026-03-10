import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      return await this.createUser.execute(dto);
    } catch (e) {
      if (e instanceof UserAlreadyExistsException) throw new ConflictException(e.message);
      throw e;
    }
  }

  @Get()
  async findAll() {
    return this.listUsers.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.getUser.execute(id);
    } catch (e) {
      if (e instanceof UserNotFoundException) throw new NotFoundException(e.message);
      throw e;
    }
  }
}
