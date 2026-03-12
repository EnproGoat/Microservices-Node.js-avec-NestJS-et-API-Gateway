import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../domain/entities/order.entity';
import * as orderRepositoryPort from '../../application/ports/order.repository.port';
import { OrderDocument } from '../schemas/order.schema';

@Injectable()
export class MongoOrderRepository implements orderRepositoryPort.OrderRepositoryPort {
  constructor(@InjectModel(OrderDocument.name) private orderModel: Model<OrderDocument>) {}

  private toEntity(doc: OrderDocument): Order {
    return new Order(doc.orderId, doc.userId, doc.items, doc.status, doc.createdAt);
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await this.orderModel.findOne({ orderId: id });
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const docs = await this.orderModel.find({ userId });
    return docs.map((d) => this.toEntity(d));
  }

  async findAll(): Promise<Order[]> {
    const docs = await this.orderModel.find();
    return docs.map((d) => this.toEntity(d));
  }

  async save(order: Order): Promise<Order> {
    await this.orderModel.findOneAndUpdate(
      { orderId: order.id },
      { orderId: order.id, userId: order.userId, items: order.items, status: order.status, createdAt: order.createdAt },
      { upsert: true, new: true },
    );
    return order;
  }
}
