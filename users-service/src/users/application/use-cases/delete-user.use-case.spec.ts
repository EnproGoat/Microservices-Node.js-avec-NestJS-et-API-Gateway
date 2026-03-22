import { DeleteUserUseCase } from './delete-user.use-case';
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

describe('DeleteUserUseCase', () => {
  let repo: jest.Mocked<UserRepositoryPort>;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it("supprime l'utilisateur s'il existe", async () => {
    repo.findById.mockResolvedValue(new User('id-1', 'alice@test.com', 'Alice', 'pass'));
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute('id-1');

    expect(repo.delete).toHaveBeenCalledWith('id-1');
  });

  it('lève UserNotFoundException si introuvable', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('inconnu')).rejects.toThrow(UserNotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
