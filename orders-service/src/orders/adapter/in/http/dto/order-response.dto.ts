import { Order, OrderItem, OrderStatus } from '../../../../domain/entities/order.entity';

export class OrderItemResponseDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class OrderResponseDto {
  id: string;
  userId: string;
  items: OrderItemResponseDto[];
  status: OrderStatus;
  total: number;
  createdAt: Date;

  static fromEntity(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = order.id;
    dto.userId = order.userId;
    dto.status = order.status;
    dto.createdAt = order.createdAt;
    dto.items = order.items.map((item: OrderItem) => {
      const itemDto = new OrderItemResponseDto();
      itemDto.productId = item.productId;
      itemDto.quantity = item.quantity;
      itemDto.unitPrice = item.unitPrice;
      itemDto.total = item.quantity * item.unitPrice;
      return itemDto;
    });
    dto.total = dto.items.reduce((sum, item) => sum + item.total, 0);
    return dto;
  }
}
