import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './application/ports/order.repository.port';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory-order.repository';
import { OrdersController } from './adapter/in/http/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
    CreateOrderUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,
    UpdateOrderStatusUseCase,
  ],
})
export class OrdersModule {}
