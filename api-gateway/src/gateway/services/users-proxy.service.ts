import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// ce service fait les appels HTTP vers le users-service
@Injectable()
export class UsersProxyService {

  // l'url du users-service, par defaut localhost:3001
  private usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3001';

  constructor(private httpService: HttpService) {}

  private authHeaders(token: string) {
    return { headers: { Authorization: token } };
  }

  async getAllUsers(token: string) {
    const reponse = await firstValueFrom(
      this.httpService.get(this.usersServiceUrl + '/users', this.authHeaders(token))
    );
    return reponse.data;
  }

  async getUserById(id: string, token: string) {
    const reponse = await firstValueFrom(
      this.httpService.get(this.usersServiceUrl + '/users/' + id, this.authHeaders(token))
    );
    return reponse.data;
  }

  async register(body: any) {
    const reponse = await firstValueFrom(
      this.httpService.post(this.usersServiceUrl + '/auth/register', body)
    );
    return reponse.data;
  }

  async login(body: any) {
    const reponse = await firstValueFrom(
      this.httpService.post(this.usersServiceUrl + '/auth/login', body)
    );
    return reponse.data;
  }

  async createUser(body: any, token: string) {
    const reponse = await firstValueFrom(
      this.httpService.post(this.usersServiceUrl + '/users', body, this.authHeaders(token))
    );
    return reponse.data;
  }
}
