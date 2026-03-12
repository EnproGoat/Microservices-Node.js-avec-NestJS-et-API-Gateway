import { UpdateUserUseCase } from './update-user.use-case';
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

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockRepo();
    useCase = new UpdateUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it('met à jour le nom de l'utilisateur', async () => {
    const existing = new User('uuid-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.findById.mockResolvedValue(existing);
    const updated = new User('uuid-1', 'alice@test.com', 'Alice Dupont', 'pass', 'USER', existing.createdAt);
    repo.save.mockResolvedValue(updated);

    const result = await useCase.execute({ id: 'uuid-1', name: 'Alice Dupont' });

    expect(repo.save).toHaveBeenCalled();
    expect(result.name).toBe('Alice Dupont');
  });

  it('met à jour le rôle de l'utilisateur', async () => {
    const existing = new User('uuid-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.findById.mockResolvedValue(existing);
    const updated = new User('uuid-1', 'alice@test.com', 'Alice', 'pass', 'ADMIN', existing.createdAt);
    repo.save.mockResolvedValue(updated);

    const result = await useCase.execute({ id: 'uuid-1', role: 'ADMIN' });

    expect(result.role).toBe('ADMIN');
  });

  it('conserve les champs non modifiés', async () => {
    const existing = new User('uuid-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.findById.mockResolvedValue(existing);
    repo.save.mockImplementation(async (u) => u);

    const result = await useCase.execute({ id: 'uuid-1', name: 'Alice Nouveau' });

    const savedArg: User = repo.save.mock.calls[0][0];
    expect(savedArg.email).toBe('alice@test.com');
    expect(savedArg.password).toBe('pass');
    expect(savedArg.role).toBe('USER');
  });

  it('lève UserNotFoundException si l'utilisateur n'existe pas', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'unknown-id', name: 'X' })).rejects.toThrow(UserNotFoundException);
  });
});
