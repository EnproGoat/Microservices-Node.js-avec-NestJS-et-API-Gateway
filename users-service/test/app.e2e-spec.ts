import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersController } from '../src/users/adapter/in/http/users.controller';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserUseCase } from '../src/users/application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../src/users/application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../src/users/application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../src/users/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../src/users/application/use-cases/delete-user.use-case';
import { InMemoryUserRepository } from '../src/users/infrastructure/repositories/in-memory-user.repository';
import { USER_REPOSITORY } from '../src/users/application/ports/user.repository.port';

describe('Users Service (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' }, global: true }),
      ],
      controllers: [UsersController, AuthController],
      providers: [
        { provide: USER_REPOSITORY, useClass: InMemoryUserRepository },
        CreateUserUseCase,
        GetUserUseCase,
        ListUsersUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        AuthService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ─── Création d'utilisateurs ────────────────────────────────────────────────

  describe('POST /users', () => {
    it('crée un utilisateur et retourne 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'alice@test.com', name: 'Alice', password: 'secret' });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('alice@test.com');
      expect(res.body.name).toBe('Alice');
      expect(res.body.role).toBe('USER');
      expect(res.body.id).toBeDefined();
      expect(res.body.password).toBeUndefined();
    });

    it('retourne 409 si l\'email est déjà utilisé', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'alice@test.com', name: 'Alice', password: 'secret' });

      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'alice@test.com', name: 'Alice 2', password: 'secret2' });

      expect(res.status).toBe(409);
    });

    it('retourne 400 si le body est invalide (email manquant)', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Alice', password: 'secret' });

      expect(res.status).toBe(400);
    });
  });

  // ─── Récupération d'utilisateurs ────────────────────────────────────────────

  describe('GET /users', () => {
    it('retourne la liste des utilisateurs', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'bob@test.com', name: 'Bob', password: 'pass' });

      const res = await request(app.getHttpServer()).get('/users');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /users/:id', () => {
    it('retourne l\'utilisateur par son id', async () => {
      const created = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'carol@test.com', name: 'Carol', password: 'pass' });

      const id = created.body.id;
      const res = await request(app.getHttpServer()).get(`/users/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.email).toBe('carol@test.com');
    });

    it('retourne 404 si l\'utilisateur n\'existe pas', async () => {
      const res = await request(app.getHttpServer()).get('/users/id-inexistant');
      expect(res.status).toBe(404);
    });
  });

  // ─── Mise à jour d'utilisateur ───────────────────────────────────────────────

  describe('PUT /users/:id', () => {
    it('met à jour le nom de l\'utilisateur', async () => {
      const created = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'dave@test.com', name: 'Dave', password: 'pass' });

      const id = created.body.id;
      const res = await request(app.getHttpServer())
        .put(`/users/${id}`)
        .send({ name: 'Dave Nouveau' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Dave Nouveau');
    });

    it('retourne 404 si l\'utilisateur n\'existe pas', async () => {
      const res = await request(app.getHttpServer())
        .put('/users/id-inexistant')
        .send({ name: 'X' });

      expect(res.status).toBe(404);
    });
  });

  // ─── Suppression d'utilisateur ───────────────────────────────────────────────

  describe('DELETE /users/:id', () => {
    it('supprime l\'utilisateur et retourne 204', async () => {
      const created = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'eve@test.com', name: 'Eve', password: 'pass' });

      const id = created.body.id;
      const res = await request(app.getHttpServer()).delete(`/users/${id}`);

      expect(res.status).toBe(204);
    });

    it('retourne 404 si l\'utilisateur n\'existe pas', async () => {
      const res = await request(app.getHttpServer()).delete('/users/id-inexistant');
      expect(res.status).toBe(404);
    });
  });

  // ─── Authentification JWT ────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('retourne un access_token JWT après login valide', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'frank@test.com', name: 'Frank', password: 'monpassword' });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'frank@test.com', password: 'monpassword' });

      expect(res.status).toBe(201);
      expect(res.body.access_token).toBeDefined();
    });

    it('le token JWT contient les bonnes informations', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'grace@test.com', name: 'Grace', password: 'pass123' });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'grace@test.com', password: 'pass123' });

      const jwtService = app.get(JwtService);
      const payload = jwtService.decode(loginRes.body.access_token) as any;

      expect(payload.email).toBe('grace@test.com');
      expect(payload.role).toBe('USER');
      expect(payload.sub).toBeDefined();
    });

    it('retourne 401 si le mot de passe est incorrect', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'henry@test.com', name: 'Henry', password: 'correct' });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'henry@test.com', password: 'mauvais' });

      expect(res.status).toBe(401);
    });

    it('retourne 401 si l\'email n\'existe pas', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'inexistant@test.com', password: 'pass' });

      expect(res.status).toBe(401);
    });
  });
});
