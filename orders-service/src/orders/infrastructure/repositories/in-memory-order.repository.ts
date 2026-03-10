import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryPort } from '../../application/ports/order.repository.port';

@Injectable()
export class InMemoryOrderRepository implements OrderRepositoryPort {
  private readonly store: Map<string, Order> = new Map();

  async findById(id: string): Promise<Order | null> {
    return this.store.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.store.values()).filter((o) => o.userId === userId);
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.store.values());
  }

  async save(order: Order): Promise<Order> {
    this.store.set(order.id, order);
    return order;
  }
}
