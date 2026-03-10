import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY, OrderRepositoryPort } from '../ports/order.repository.port';

export interface CreateOrderCommand {
  userId: string;
  items: OrderItem[];
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const order = new Order(randomUUID(), command.userId, command.items);
    return this.orderRepository.save(order);
  }
}
