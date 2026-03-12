import { CreateUserUseCase } from './create-user.use-case';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../ports/user.repository.port';

const mockRepo = (): jest.Mocked<UserRepositoryPort> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new CreateUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it('crée un utilisateur quand l'email n'existe pas', async () => {
    repo.findByEmail.mockResolvedValue(null);
    const saved = new User('uuid-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute({ email: 'alice@test.com', name: 'Alice', password: 'pass' });

    expect(repo.findByEmail).toHaveBeenCalledWith('alice@test.com');
    expect(repo.save).toHaveBeenCalled();
    expect(result.email).toBe('alice@test.com');
    expect(result.name).toBe('Alice');
    expect(result.role).toBe('USER');
  });

  it('crée un utilisateur avec le rôle ADMIN si spécifié', async () => {
    repo.findByEmail.mockResolvedValue(null);
    const saved = new User('uuid-2', 'admin@test.com', 'Admin', 'pass', 'ADMIN');
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute({ email: 'admin@test.com', name: 'Admin', password: 'pass', role: 'ADMIN' });

    expect(result.role).toBe('ADMIN');
  });

  it('lève UserAlreadyExistsException si l'email est déjà utilisé', async () => {
    const existing = new User('uuid-3', 'alice@test.com', 'Alice', 'pass');
    repo.findByEmail.mockResolvedValue(existing);

    await expect(
      useCase.execute({ email: 'alice@test.com', name: 'Alice', password: 'pass' }),
    ).rejects.toThrow(UserAlreadyExistsException);

    expect(repo.save).not.toHaveBeenCalled();
  });
});
