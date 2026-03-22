import { Body, Controller, Get, Param, Post, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { OrdersProxyService } from '../services/orders-proxy.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// ce controller redirige les requetes /orders vers le orders-service
@ApiTags('Orders')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersGatewayController {

  constructor(private ordersProxy: OrdersProxyService) {}

  // GET /orders -> recupere toutes les commandes
  @Get()
  @ApiOperation({ summary: 'Recuperer toutes les commandes' })
  @ApiResponse({ status: 200, description: 'Liste des commandes' })
  @ApiResponse({ status: 502, description: 'orders-service indisponible' })
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
  @ApiOperation({ summary: 'Recuperer une commande par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la commande', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Commande trouvee' })
  @ApiResponse({ status: 404, description: 'Commande non trouvee' })
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
  @ApiOperation({ summary: 'Creer une nouvelle commande' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Commande creee avec succes' })
  async create(@Body() body: CreateOrderDto) {
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
