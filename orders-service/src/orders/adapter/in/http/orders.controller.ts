import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { CreateOrderUseCase } from '../../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../../application/use-cases/list-orders.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.createOrder.execute(dto);
    return OrderResponseDto.fromEntity(order);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.listOrders.execute();
    return orders.map(OrderResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    try {
      const order = await this.getOrder.execute(id);
      return OrderResponseDto.fromEntity(order);
    } catch (e) {
      if (e instanceof OrderNotFoundException) throw new NotFoundException(e.message);
      throw e;
    }
  }
}
