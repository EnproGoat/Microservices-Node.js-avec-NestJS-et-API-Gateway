import { GetUserUseCase } from './get-user.use-case';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../ports/user.repository.port';

const mockRepo = (): jest.Mocked<UserRepositoryPort> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new GetUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it('retourne l'utilisateur si trouvé', async () => {
    const user = new User('uuid-1', 'alice@test.com', 'Alice', 'pass');
    repo.findById.mockResolvedValue(user);

    const result = await useCase.execute('uuid-1');

    expect(repo.findById).toHaveBeenCalledWith('uuid-1');
    expect(result).toBe(user);
  });

  it('lève UserNotFoundException si l'utilisateur n'existe pas', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(UserNotFoundException);
  });
});
