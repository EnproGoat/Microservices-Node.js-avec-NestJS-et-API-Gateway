import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { OrdersController } from '../src/orders/adapter/in/http/orders.controller';
import { CreateOrderUseCase } from '../src/orders/application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../src/orders/application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../src/orders/application/use-cases/list-orders.use-case';
import { UpdateOrderStatusUseCase } from '../src/orders/application/use-cases/update-order-status.use-case';
import { InMemoryOrderRepository } from '../src/orders/infrastructure/repositories/in-memory-order.repository';
import { ORDER_REPOSITORY } from '../src/orders/application/ports/order.repository.port';

const validItem = { productId: 'prod-1', quantity: 2, unitPrice: 15.5 };
const userId1 = 'a0000000-0000-4000-8000-000000000001';
const userId2 = 'a0000000-0000-4000-8000-000000000002';
const userId3 = 'a0000000-0000-4000-8000-000000000003';
const userId4 = 'a0000000-0000-4000-8000-000000000004';
const userId5 = 'a0000000-0000-4000-8000-000000000005';
const userId6 = 'a0000000-0000-4000-8000-000000000006';

describe('Orders Service (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
        CreateOrderUseCase,
        GetOrderUseCase,
        ListOrdersUseCase,
        UpdateOrderStatusUseCase,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ─── Création de commandes ───────────────────────────────────────────────────

  describe('POST /orders', () => {
    it('cree une commande et retourne 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId1, items: [validItem] });

      if (res.status !== 201) console.error('DEBUG body:', JSON.stringify(res.body));
      expect(res.status).toBe(201);
      expect(res.body.userId).toBe(userId1);
      expect(res.body.status).toBe('CREATED');
      expect(res.body.id).toBeDefined();
      expect(res.body.items).toHaveLength(1);
    });

    it('retourne 400 si items est vide', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId1, items: [] });

      expect(res.status).toBe(400);
    });

    it('retourne 400 si userId est manquant', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .send({ items: [validItem] });

      expect(res.status).toBe(400);
    });
  });

  // ─── Récupération de commandes ───────────────────────────────────────────────

  describe('GET /orders', () => {
    it('retourne la liste des commandes', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId1, items: [validItem] });

      const res = await request(app.getHttpServer()).get('/orders');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /orders/:id', () => {
    it('retourne la commande par son id', async () => {
      const created = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId2, items: [validItem] });

      const id = created.body.id;
      const res = await request(app.getHttpServer()).get(`/orders/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.userId).toBe(userId2);
    });

    it('retourne 404 si la commande n\'existe pas', async () => {
      const res = await request(app.getHttpServer()).get('/orders/id-inexistant');
      expect(res.status).toBe(404);
    });
  });

  // ─── Mise à jour du statut ───────────────────────────────────────────────────

  describe('PATCH /orders/:id/status', () => {
    it('passe le statut de CREATED à PAID', async () => {
      const created = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId3, items: [validItem] });

      const id = created.body.id;
      const res = await request(app.getHttpServer())
        .patch(`/orders/${id}/status`)
        .send({ status: 'PAID' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('PAID');
    });

    it('passe le statut de PAID à SHIPPED', async () => {
      const created = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId4, items: [validItem] });

      const id = created.body.id;
      await request(app.getHttpServer())
        .patch(`/orders/${id}/status`)
        .send({ status: 'PAID' });

      const res = await request(app.getHttpServer())
        .patch(`/orders/${id}/status`)
        .send({ status: 'SHIPPED' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SHIPPED');
    });

    it('retourne 400 si la transition CREATED → SHIPPED est invalide', async () => {
      const created = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId5, items: [validItem] });

      const id = created.body.id;
      const res = await request(app.getHttpServer())
        .patch(`/orders/${id}/status`)
        .send({ status: 'SHIPPED' });

      expect(res.status).toBe(400);
    });

    it('retourne 404 si la commande n\'existe pas', async () => {
      const res = await request(app.getHttpServer())
        .patch('/orders/id-inexistant/status')
        .send({ status: 'PAID' });

      expect(res.status).toBe(404);
    });

    it('retourne 400 si le statut est invalide', async () => {
      const created = await request(app.getHttpServer())
        .post('/orders')
        .send({ userId: userId6, items: [validItem] });

      const id = created.body.id;
      const res = await request(app.getHttpServer())
        .patch(`/orders/${id}/status`)
        .send({ status: 'ANNULE' });

      expect(res.status).toBe(400);
    });
  });
});
