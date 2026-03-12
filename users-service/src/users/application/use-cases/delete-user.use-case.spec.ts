import { DeleteUserUseCase } from './delete-user.use-case';
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

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new DeleteUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it('supprime l'utilisateur s'il existe', async () => {
    const user = new User('uuid-1', 'alice@test.com', 'Alice', 'pass');
    repo.findById.mockResolvedValue(user);
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute('uuid-1');

    expect(repo.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('lève UserNotFoundException si l'utilisateur n'existe pas', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(UserNotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
