import { UpdateOrderStatusUseCase } from './update-order-status.use-case';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import { InvalidStatusTransitionException } from '../../domain/exceptions/invalid-status-transition.exception';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryPort } from '../ports/order.repository.port';

const mockRepo = (): jest.Mocked<OrderRepositoryPort> => ({
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
});

const items = [{ productId: 'p1', quantity: 1, unitPrice: 10 }];

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let repo: jest.Mocked<OrderRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new UpdateOrderStatusUseCase(repo as any);
    (useCase as any).orderRepository = repo;
  });

  it('passe le statut de CREATED à PAID', async () => {
    const order = new Order('uuid-1', 'user-1', items, 'CREATED');
    repo.findById.mockResolvedValue(order);
    repo.save.mockImplementation(async (o) => o);

    const result = await useCase.execute('uuid-1', 'PAID');

    expect(result.status).toBe('PAID');
  });

  it('passe le statut de PAID à SHIPPED', async () => {
    const order = new Order('uuid-1', 'user-1', items, 'PAID');
    repo.findById.mockResolvedValue(order);
    repo.save.mockImplementation(async (o) => o);

    const result = await useCase.execute('uuid-1', 'SHIPPED');

    expect(result.status).toBe('SHIPPED');
  });

  it('lève InvalidStatusTransitionException si CREATED → SHIPPED', async () => {
    const order = new Order('uuid-1', 'user-1', items, 'CREATED');
    repo.findById.mockResolvedValue(order);

    await expect(useCase.execute('uuid-1', 'SHIPPED')).rejects.toThrow(InvalidStatusTransitionException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('lève OrderNotFoundException si la commande n'existe pas', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id', 'PAID')).rejects.toThrow(OrderNotFoundException);
  });
});
