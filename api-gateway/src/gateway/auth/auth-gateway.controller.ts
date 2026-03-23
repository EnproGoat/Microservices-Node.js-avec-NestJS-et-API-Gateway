import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersProxyService } from '../services/users-proxy.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthGatewayController {

  constructor(private usersProxy: UsersProxyService) {}

  // POST /auth/register -> proxy vers users-service /auth/register
  @Post('register')
  @ApiOperation({ summary: "Creer un compte et obtenir un token JWT" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Compte cree, token JWT retourne' })
  @ApiResponse({ status: 409, description: 'Un compte avec cet email existe deja' })
  async register(@Body() body: RegisterDto) {
    try {
      return await this.usersProxy.register(body);
    } catch (err) {
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }

  // POST /auth/login -> proxy vers users-service /auth/login
  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Token JWT retourne' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  async login(@Body() body: LoginDto) {
    try {
      return await this.usersProxy.login(body);
    } catch (err) {
      const statusCode = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data ?? err.message;
      throw new HttpException(message, statusCode);
    }
  }
}
