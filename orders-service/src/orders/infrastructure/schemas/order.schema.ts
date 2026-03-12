import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderItem, OrderStatus } from '../../domain/entities/order.entity';

@Schema({ collection: 'orders' })
export class OrderDocument {
  @Prop({ required: true, unique: true })
  orderId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ productId: String, quantity: Number, unitPrice: Number }] })
  items: OrderItem[];

  @Prop({ default: 'CREATED' })
  status: OrderStatus;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export type OrderDoc = HydratedDocument<OrderDocument>;
export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
