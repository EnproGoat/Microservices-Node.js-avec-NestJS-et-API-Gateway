import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { UsersGatewayController } from '../src/gateway/users/users-gateway.controller';
import { OrdersGatewayController } from '../src/gateway/orders/orders-gateway.controller';
import { UsersProxyService } from '../src/gateway/services/users-proxy.service';
import { OrdersProxyService } from '../src/gateway/services/orders-proxy.service';

// Données de mock
const mockUser = { id: 'user-1', email: 'alice@test.com', name: 'Alice', role: 'USER', createdAt: new Date().toISOString() };
const mockOrder = { id: 'order-1', userId: 'user-1', status: 'CREATED', items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }], createdAt: new Date().toISOString() };

describe('API Gateway (e2e)', () => {
  let app: INestApplication;
  let usersProxy: jest.Mocked<UsersProxyService>;
  let ordersProxy: jest.Mocked<OrdersProxyService>;

  beforeEach(async () => {
    usersProxy = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
    } as any;

    ordersProxy = {
      getAllOrders: jest.fn(),
      getOrderById: jest.fn(),
      createOrder: jest.fn(),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersGatewayController, OrdersGatewayController],
      providers: [
        { provide: UsersProxyService, useValue: usersProxy },
        { provide: OrdersProxyService, useValue: ordersProxy },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ─── Proxy Users ─────────────────────────────────────────────────────────────

  describe('GET /users', () => {
    it('retourne la liste des utilisateurs depuis le users-service', async () => {
      usersProxy.getAllUsers.mockResolvedValue([mockUser]);

      const res = await request(app.getHttpServer()).get('/users');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockUser]);
      expect(usersProxy.getAllUsers).toHaveBeenCalled();
    });

    it('retourne 502 si le users-service est indisponible', async () => {
      usersProxy.getAllUsers.mockRejectedValue(new Error('connexion refusée'));

      const res = await request(app.getHttpServer()).get('/users');

      expect(res.status).toBe(HttpStatus.BAD_GATEWAY);
    });
  });

  describe('GET /users/:id', () => {
    it('retourne un utilisateur par id', async () => {
      usersProxy.getUserById.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer()).get('/users/user-1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(usersProxy.getUserById).toHaveBeenCalledWith('user-1');
    });

    it('propage l\'erreur 404 du users-service', async () => {
      const err: any = new Error('Not Found');
      err.response = { status: 404, data: { message: 'Not Found' } };
      usersProxy.getUserById.mockRejectedValue(err);

      const res = await request(app.getHttpServer()).get('/users/id-inexistant');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('crée un utilisateur via le users-service', async () => {
      usersProxy.createUser.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'alice@test.com', name: 'Alice', password: 'pass' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
      expect(usersProxy.createUser).toHaveBeenCalledWith({ email: 'alice@test.com', name: 'Alice', password: 'pass' });
    });

    it('propage l\'erreur 409 du users-service', async () => {
      const err: any = new Error('Conflict');
      err.response = { status: 409, data: { message: 'Conflict' } };
      usersProxy.createUser.mockRejectedValue(err);

      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'alice@test.com', name: 'Alice', password: 'pass' });

      expect(res.status).toBe(409);
    });
  });

  // ─── Proxy Orders ─────────────────────────────────────────────────────────────

  describe('GET /orders', () => {
    it('retourne la liste des commandes depuis le orders-service', async () => {
      ordersProxy.getAllOrders.mockResolvedValue([mockOrder]);

      const res = await request(app.getHttpServer()).get('/orders');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockOrder]);
      expect(ordersProxy.getAllOrders).toHaveBeenCalled();
    });

    it('retourne 502 si le orders-service est indisponible', async () => {
      ordersProxy.getAllOrders.mockRejectedValue(new Error('connexion refusée'));

      const res = await request(app.getHttpServer()).get('/orders');

      expect(res.status).toBe(HttpStatus.BAD_GATEWAY);
    });
  });

  describe('GET /orders/:id', () => {
    it('retourne une commande par id', async () => {
      ordersProxy.getOrderById.mockResolvedValue(mockOrder);

      const res = await request(app.getHttpServer()).get('/orders/order-1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
      expect(ordersProxy.getOrderById).toHaveBeenCalledWith('order-1');
    });

    it('propage l\'erreur 404 du orders-service', async () => {
      const err: any = new Error('Not Found');
      err.response = { status: 404, data: { message: 'Not Found' } };
      ordersProxy.getOrderById.mockRejectedValue(err);

      const res = await request(app.getHttpServer()).get('/orders/id-inexistant');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /orders', () => {
    it('crée une commande via le orders-service', async () => {
      ordersProxy.createOrder.mockResolvedValue(mockOrder);

      const body = { userId: 'user-1', items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }] };
      const res = await request(app.getHttpServer()).post('/orders').send(body);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockOrder);
      expect(ordersProxy.createOrder).toHaveBeenCalledWith(body);
    });
  });
});
