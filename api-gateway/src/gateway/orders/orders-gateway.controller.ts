import { Body, Controller, Get, Param, Post, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersProxyService } from '../services/orders-proxy.service';

// ce controller redirige les requetes /orders vers le orders-service
@Controller('orders')
export class OrdersGatewayController {

  constructor(private ordersProxy: OrdersProxyService) {}

  // GET /orders -> recupere toutes les commandes
  @Get()
  async getAll() {
    try {
      const orders = await this.ordersProxy.getAllOrders();
      return orders;
    } catch (err) {
      console.log('erreur dans getAll orders:', err.message);
      throw new HttpException('orders-service indisponible', HttpStatus.BAD_GATEWAY);
    }
  }

  // GET /orders/:id -> recupere une commande par id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const order = await this.ordersProxy.getOrderById(id);
      return order;
    } catch (err) {
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }

  // POST /orders -> cree une commande
  @Post()
  async create(@Body() body: any) {
    try {
      const nouvelleOrder = await this.ordersProxy.createOrder(body);
      return nouvelleOrder;
    } catch (err) {
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }
}
