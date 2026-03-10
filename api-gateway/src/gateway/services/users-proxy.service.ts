import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// ce service fait les appels HTTP vers le users-service
@Injectable()
export class UsersProxyService {

  // l'url du users-service, par defaut localhost:3001
  private usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3001';

  constructor(private httpService: HttpService) {}

  async getAllUsers() {
    const reponse = await firstValueFrom(
      this.httpService.get(this.usersServiceUrl + '/users')
    );
    return reponse.data;
  }

  async getUserById(id: string) {
    const reponse = await firstValueFrom(
      this.httpService.get(this.usersServiceUrl + '/users/' + id)
    );
    return reponse.data;
  }

  async createUser(body: any) {
    const reponse = await firstValueFrom(
      this.httpService.post(this.usersServiceUrl + '/users', body)
    );
    return reponse.data;
  }
}
