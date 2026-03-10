import { Inject, Injectable } from '@nestjs/common';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { InvalidStatusTransitionException } from '../../domain/exceptions/invalid-status-transition.exception';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import * as orderRepositoryPort from '../ports/order.repository.port';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(orderRepositoryPort.ORDER_REPOSITORY)
    private readonly orderRepository: orderRepositoryPort.OrderRepositoryPort,
  ) {}

  async execute(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new OrderNotFoundException(id);

    if (newStatus === 'SHIPPED' && order.status !== 'PAID') {
      throw new InvalidStatusTransitionException(order.status, 'SHIPPED');
    }

    const updated = new Order(order.id, order.userId, order.items, newStatus, order.createdAt);
    return this.orderRepository.save(updated);
  }
}
