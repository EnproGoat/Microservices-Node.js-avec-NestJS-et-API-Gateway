import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AxiosError } from 'axios';
import { OrdersProxyService } from '../services/orders-proxy.service';

@Controller('orders')
export class OrdersGatewayController {
  constructor(private readonly ordersProxy: OrdersProxyService) {}

  @Get()
  findAll() {
    return this.ordersProxy.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.ordersProxy.findOne(id);
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(err.response?.data ?? err.message, status);
    }
  }

  @Post()
  async create(@Body() body: unknown) {
    try {
      return await this.ordersProxy.create(body);
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(err.response?.data ?? err.message, status);
    }
  }
}
