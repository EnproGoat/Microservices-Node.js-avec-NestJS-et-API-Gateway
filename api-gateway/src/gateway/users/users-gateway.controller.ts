import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { UsersProxyService } from '../services/users-proxy.service';

@Controller('users')
export class UsersGatewayController {
  constructor(private readonly usersProxy: UsersProxyService) {}

  @Get()
  async findAll() {
    return this.usersProxy.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersProxy.findOne(id);
    } catch (e) {
      this.rethrow(e);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: unknown) {
    try {
      return await this.usersProxy.create(body);
    } catch (e) {
      this.rethrow(e);
    }
  }

  private rethrow(e: unknown): never {
    const err = e as AxiosError;
    const status = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (err.response?.data as { message?: string })?.message ?? err.message;
    throw new HttpException(message, status);
  }
}
