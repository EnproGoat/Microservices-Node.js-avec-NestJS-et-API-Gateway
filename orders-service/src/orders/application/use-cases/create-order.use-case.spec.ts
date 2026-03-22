import { CreateOrderUseCase } from './create-order.use-case';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryPort } from '../ports/order.repository.port';

const mockRepo = (): jest.Mocked<OrderRepositoryPort> => ({
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
});

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let repo: jest.Mocked<OrderRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new CreateOrderUseCase(repo as any);
    (useCase as any).orderRepository = repo;
  });

  it('crée une commande avec statut CREATED', async () => {
    const items = [{ productId: 'prod-1', quantity: 2, unitPrice: 15 }];
    const saved = new Order('uuid-1', 'user-1', items, 'CREATED');
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute({ userId: 'user-1', items });

    expect(repo.save).toHaveBeenCalled();
    expect(result.userId).toBe('user-1');
    expect(result.status).toBe('CREATED');
    expect(result.items).toEqual(items);
  });

  it('génère un id unique pour chaque commande', async () => {
    const items = [{ productId: 'prod-1', quantity: 1, unitPrice: 10 }];
    repo.save.mockImplementation(async (o) => o);

    const r1 = await useCase.execute({ userId: 'user-1', items });
    const r2 = await useCase.execute({ userId: 'user-1', items });

    expect(r1.id).not.toBe(r2.id);
  });
});
