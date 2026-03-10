import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import * as orderRepositoryPort from '../ports/order.repository.port';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(orderRepositoryPort.ORDER_REPOSITORY)
    private readonly orderRepository: orderRepositoryPort.OrderRepositoryPort,
  ) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
