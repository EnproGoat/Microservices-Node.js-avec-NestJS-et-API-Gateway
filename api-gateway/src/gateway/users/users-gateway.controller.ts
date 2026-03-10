import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AxiosError } from 'axios';
import { UsersProxyService } from '../services/users-proxy.service';

@Controller('users')
export class UsersGatewayController {
  constructor(private readonly usersProxy: UsersProxyService) {}

  @Get()
  findAll() {
    return this.usersProxy.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersProxy.findOne(id);
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(err.response?.data ?? err.message, status);
    }
  }

  @Post()
  async create(@Body() body: unknown) {
    try {
      return await this.usersProxy.create(body);
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(err.response?.data ?? err.message, status);
    }
  }
}
