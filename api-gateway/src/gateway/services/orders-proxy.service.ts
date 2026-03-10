import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersProxyService {
  private readonly baseUrl =
    process.env.ORDERS_SERVICE_URL ?? 'http://localhost:3002';

  constructor(private readonly http: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/orders`),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/orders/${id}`),
    );
    return data;
  }

  async create(body: unknown) {
    const { data } = await firstValueFrom(
      this.http.post(`${this.baseUrl}/orders`, body),
    );
    return data;
  }
}
