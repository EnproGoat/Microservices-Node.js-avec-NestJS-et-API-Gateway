import { Body, Controller, Get, Param, Post, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersProxyService } from '../services/users-proxy.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// ce controller redirige les requetes /users vers le users-service
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersGatewayController {

  constructor(private usersProxy: UsersProxyService) {}

  // GET /users -> recupere tous les users
  @Get()
  @ApiOperation({ summary: 'Recuperer tous les utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  @ApiResponse({ status: 502, description: 'users-service indisponible' })
  async getAll(@Req() req) {
    try {
      const users = await this.usersProxy.getAllUsers(req.headers.authorization);
      return users;
    } catch (err) {
      console.log('erreur dans getAll users:', err.message);
      throw new HttpException('users-service indisponible', HttpStatus.BAD_GATEWAY);
    }
  }

  // GET /users/:id -> recupere un user par son id
  @Get(':id')
  @ApiOperation({ summary: 'Recuperer un utilisateur par son ID' })
  @ApiParam({ name: 'id', description: 'ID du user', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouve' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouve' })
  async getOne(@Param('id') id: string, @Req() req) {
    try {
      const user = await this.usersProxy.getUserById(id, req.headers.authorization);
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
  @ApiOperation({ summary: 'Creer un nouvel utilisateur' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Utilisateur cree avec succes' })
  async create(@Body() body: CreateUserDto, @Req() req) {
    try {
      const nouveauUser = await this.usersProxy.createUser(body, req.headers.authorization);
      return nouveauUser;
    } catch (err) {
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }
}
