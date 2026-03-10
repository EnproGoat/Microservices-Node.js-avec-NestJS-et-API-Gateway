import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { InvalidStatusTransitionException } from '../../../domain/exceptions/invalid-status-transition.exception';
import { CreateOrderUseCase } from '../../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../../application/use-cases/list-orders.use-case';
import { UpdateOrderStatusUseCase } from '../../../application/use-cases/update-order-status.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
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

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    try {
      const order = await this.updateOrderStatus.execute(id, dto.status);
      return OrderResponseDto.fromEntity(order);
    } catch (e) {
      if (e instanceof OrderNotFoundException) throw new NotFoundException(e.message);
      if (e instanceof InvalidStatusTransitionException) throw new BadRequestException(e.message);
      throw e;
    }
  }
}
