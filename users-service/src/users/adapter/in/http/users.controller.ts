import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.createUser.execute(dto);
      return UserResponseDto.fromEntity(user);
    } catch (e) {
      if (e instanceof UserAlreadyExistsException) throw new ConflictException(e.message);
      throw e;
    }
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.listUsers.execute();
    return users.map(UserResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.getUser.execute(id);
      return UserResponseDto.fromEntity(user);
    } catch (e) {
      if (e instanceof UserNotFoundException) throw new NotFoundException(e.message);
      throw e;
    }
  }
}
