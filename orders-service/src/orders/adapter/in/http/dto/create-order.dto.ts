import { OrderItem } from '../../../domain/entities/order.entity';

export class CreateOrderDto {
  userId: string;
  items: OrderItem[];
}
