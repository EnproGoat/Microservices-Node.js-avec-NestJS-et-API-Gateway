import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UsersProxyService } from './services/users-proxy.service';
import { OrdersProxyService } from './services/orders-proxy.service';
import { UsersGatewayController } from './users/users-gateway.controller';
import { OrdersGatewayController } from './orders/orders-gateway.controller';

@Module({
  imports: [HttpModule],
  controllers: [UsersGatewayController, OrdersGatewayController],
  providers: [UsersProxyService, OrdersProxyService],
})
export class GatewayModule {}
