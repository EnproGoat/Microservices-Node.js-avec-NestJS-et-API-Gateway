import { GetUserUseCase } from './get-user.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserRepositoryPort } from '../ports/user.repository.port';

const makeRepo = (): jest.Mocked<UserRepositoryPort> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('GetUserUseCase', () => {
  let repo: jest.Mocked<UserRepositoryPort>;
  let useCase: GetUserUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it("retourne l'utilisateur si trouvé", async () => {
    const user = new User('id-1', 'alice@test.com', 'Alice', 'pass');
    repo.findById.mockResolvedValue(user);

    const result = await useCase.execute('id-1');

    expect(repo.findById).toHaveBeenCalledWith('id-1');
    expect(result).toBe(user);
  });

  it('lève UserNotFoundException si introuvable', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('inconnu')).rejects.toThrow(UserNotFoundException);
  });
});
