import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import { ORDER_REPOSITORY, OrderRepositoryPort } from '../ports/order.repository.port';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    return order;
  }
}
