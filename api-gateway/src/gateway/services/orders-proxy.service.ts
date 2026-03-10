import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// ce service fait les appels HTTP vers le orders-service
@Injectable()
export class OrdersProxyService {

  // l'url du orders-service, par defaut localhost:3002
  private ordersServiceUrl = process.env.ORDERS_SERVICE_URL || 'http://localhost:3002';

  constructor(private httpService: HttpService) {}

  async getAllOrders() {
    const reponse = await firstValueFrom(
      this.httpService.get(this.ordersServiceUrl + '/orders')
    );
    return reponse.data;
  }

  async getOrderById(id: string) {
    const reponse = await firstValueFrom(
      this.httpService.get(this.ordersServiceUrl + '/orders/' + id)
    );
    return reponse.data;
  }

  async createOrder(body: any) {
    const reponse = await firstValueFrom(
      this.httpService.post(this.ordersServiceUrl + '/orders', body)
    );
    return reponse.data;
  }
}
