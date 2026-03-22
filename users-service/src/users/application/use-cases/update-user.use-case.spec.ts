import { UpdateUserUseCase } from './update-user.use-case';
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

describe('UpdateUserUseCase', () => {
  let repo: jest.Mocked<UserRepositoryPort>;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateUserUseCase(repo as any);
    (useCase as any).userRepository = repo;
  });

  it('met à jour le nom et conserve les autres champs', async () => {
    const existing = new User('id-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.findById.mockResolvedValue(existing);
    repo.save.mockImplementation(async (u) => u);

    const result = await useCase.execute({ id: 'id-1', name: 'Alice Nouveau' });

    expect(result.name).toBe('Alice Nouveau');
    expect(result.email).toBe('alice@test.com');
    expect(result.role).toBe('USER');
  });

  it('met à jour le rôle', async () => {
    const existing = new User('id-1', 'alice@test.com', 'Alice', 'pass', 'USER');
    repo.findById.mockResolvedValue(existing);
    repo.save.mockImplementation(async (u) => u);

    const result = await useCase.execute({ id: 'id-1', role: 'ADMIN' });

    expect(result.role).toBe('ADMIN');
  });

  it('lève UserNotFoundException si introuvable', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inconnu', name: 'X' })).rejects.toThrow(UserNotFoundException);
  });
});
