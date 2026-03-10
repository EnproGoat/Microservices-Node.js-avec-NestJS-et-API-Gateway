import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import * as orderRepositoryPort from '../ports/order.repository.port';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(orderRepositoryPort.ORDER_REPOSITORY)
    private readonly orderRepository: orderRepositoryPort.OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    return order;
  }
}
