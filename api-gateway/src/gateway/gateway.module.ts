import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersProxyService } from './services/users-proxy.service';
import { OrdersProxyService } from './services/orders-proxy.service';
import { UsersGatewayController } from './users/users-gateway.controller';
import { OrdersGatewayController } from './orders/orders-gateway.controller';
import { AuthGatewayController } from './auth/auth-gateway.controller';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [AuthGatewayController, UsersGatewayController, OrdersGatewayController],
  providers: [UsersProxyService, OrdersProxyService],
})
export class GatewayModule {}
