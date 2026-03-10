import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersProxyService {
  private readonly baseUrl =
    process.env.USERS_SERVICE_URL ?? 'http://localhost:3001';

  constructor(private readonly http: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/users`),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/users/${id}`),
    );
    return data;
  }

  async create(body: unknown) {
    const { data } = await firstValueFrom(
      this.http.post(`${this.baseUrl}/users`, body),
    );
    return data;
  }
}
