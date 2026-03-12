import { GetOrderUseCase } from './get-order.use-case';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryPort } from '../ports/order.repository.port';

const mockRepo = (): jest.Mocked<OrderRepositoryPort> => ({
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
});

describe('GetOrderUseCase', () => {
  let useCase: GetOrderUseCase;
  let repo: jest.Mocked<OrderRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new GetOrderUseCase(repo as any);
    (useCase as any).orderRepository = repo;
  });

  it('retourne la commande si trouvée', async () => {
    const order = new Order('uuid-1', 'user-1', [{ productId: 'p1', quantity: 1, unitPrice: 10 }]);
    repo.findById.mockResolvedValue(order);

    const result = await useCase.execute('uuid-1');

    expect(repo.findById).toHaveBeenCalledWith('uuid-1');
    expect(result).toBe(order);
  });

  it('lève OrderNotFoundException si la commande n'existe pas', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(OrderNotFoundException);
  });
});
