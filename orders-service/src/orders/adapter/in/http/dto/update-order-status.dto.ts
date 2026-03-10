import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../domain/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(['CREATED', 'PAID', 'SHIPPED'])
  status: OrderStatus;
}
