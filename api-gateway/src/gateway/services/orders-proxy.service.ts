import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// ce service fait les appels HTTP vers le orders-service
@Injectable()
export class OrdersProxyService {

  // l'url du orders-service, par defaut localhost:3002
  private ordersServiceUrl = process.env.ORDERS_SERVICE_URL || 'http://localhost:3002';

  constructor(private httpService: HttpService) {}

  private authHeaders(token: string) {
    return { headers: { Authorization: token } };
  }

  async getAllOrders(token: string) {
    const reponse = await firstValueFrom(
      this.httpService.get(this.ordersServiceUrl + '/orders', this.authHeaders(token))
    );
    return reponse.data;
  }

  async getOrderById(id: string, token: string) {
    const reponse = await firstValueFrom(
      this.httpService.get(this.ordersServiceUrl + '/orders/' + id, this.authHeaders(token))
    );
    return reponse.data;
  }

  async createOrder(body: any, token: string) {
    const reponse = await firstValueFrom(
      this.httpService.post(this.ordersServiceUrl + '/orders', body, this.authHeaders(token))
    );
    return reponse.data;
  }
}
