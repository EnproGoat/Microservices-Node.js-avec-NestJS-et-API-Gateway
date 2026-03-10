import { Body, Controller, Get, Param, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersProxyService } from '../services/users-proxy.service';

// ce controller redirige les requetes /users vers le users-service
@Controller('users')
export class UsersGatewayController {

  constructor(private usersProxy: UsersProxyService) {}

  // GET /users -> recupere tous les users
  @Get()
  async getAll() {
    try {
      const users = await this.usersProxy.getAllUsers();
      return users;
    } catch (err) {
      console.log('erreur dans getAll users:', err.message);
      throw new HttpException('users-service indisponible', HttpStatus.BAD_GATEWAY);
    }
  }

  // GET /users/:id -> recupere un user par son id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const user = await this.usersProxy.getUserById(id);
      return user;
    } catch (err) {
      // si le service renvoie une erreur on la transfere
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }

  // POST /users -> cree un user
  @Post()
  async create(@Body() body: any) {
    try {
      const nouveauUser = await this.usersProxy.createUser(body);
      return nouveauUser;
    } catch (err) {
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }
}
