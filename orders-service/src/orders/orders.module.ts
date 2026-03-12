import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as orderRepositoryPort from './application/ports/order.repository.port';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { MongoOrderRepository } from './infrastructure/repositories/mongo-order.repository';
import { OrderDocument, OrderSchema } from './infrastructure/schemas/order.schema';
import { OrdersController } from './adapter/in/http/orders.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: OrderDocument.name, schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [
    { provide: orderRepositoryPort.ORDER_REPOSITORY, useClass: MongoOrderRepository },
    CreateOrderUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,
    UpdateOrderStatusUseCase,
  ],
})
export class OrdersModule {}
