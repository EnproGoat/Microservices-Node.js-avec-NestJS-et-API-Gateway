import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.updateUser.execute({ id, ...dto });
      return UserResponseDto.fromEntity(user);
    } catch (e) {
      if (e instanceof UserNotFoundException) throw new NotFoundException(e.message);
      throw e;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteUser.execute(id);
    } catch (e) {
      if (e instanceof UserNotFoundException) throw new NotFoundException(e.message);
      throw e;
    }
  }
}
