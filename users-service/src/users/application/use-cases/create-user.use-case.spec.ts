import { CreateUserUseCase } from './create-user.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserRepositoryPort } from '../ports/user.repository.port';

const makeRepo = (): jest.Mocked<UserRepositoryPort> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('CreateUserUseCase', () => {
  let repo: jest.Mocked<UserRepositoryPort>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it('crée et retourne un utilisateur si email libre', async () => {
    repo.findByEmail.mockResolvedValue(null);
    const user = new User('id-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.save.mockResolvedValue(user);

    const result = await useCase.execute({ email: 'alice@test.com', name: 'Alice', password: 'pass' });

    expect(repo.findByEmail).toHaveBeenCalledWith('alice@test.com');
    expect(repo.save).toHaveBeenCalled();
    expect(result.email).toBe('alice@test.com');
    expect(result.role).toBe('USER');
  });

  it("lance UserAlreadyExistsException si l'email est déjà pris", async () => {
    repo.findByEmail.mockResolvedValue(new User('id-1', 'alice@test.com', 'Alice', 'pass'));

    await expect(
      useCase.execute({ email: 'alice@test.com', name: 'Alice', password: 'pass' }),
    ).rejects.toThrow(UserAlreadyExistsException);

    expect(repo.save).not.toHaveBeenCalled();
  });
});
