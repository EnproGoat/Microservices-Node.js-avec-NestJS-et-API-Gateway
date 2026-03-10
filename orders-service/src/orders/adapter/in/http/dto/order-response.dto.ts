import { Order, OrderStatus } from '../../../../domain/entities/order.entity';

export class OrderResponseDto {
  id: string;
  userId: string;
  status: OrderStatus;
  items: { productId: string; quantity: number; unitPrice: number }[];
  createdAt: Date;

  static fromEntity(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items,
      createdAt: order.createdAt,
    };
  }
}
