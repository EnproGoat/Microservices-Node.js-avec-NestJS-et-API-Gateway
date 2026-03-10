import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { CreateOrderUseCase } from '../../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../../application/use-cases/list-orders.use-case';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return this.createOrder.execute(dto);
  }

  @Get()
  async findAll() {
    return this.listOrders.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.getOrder.execute(id);
    } catch (e) {
      if (e instanceof OrderNotFoundException) throw new NotFoundException(e.message);
      throw e;
    }
  }
}
