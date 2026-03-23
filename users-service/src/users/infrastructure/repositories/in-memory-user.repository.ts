import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import * as userRepositoryPort from '../../application/ports/user.repository.port';

@Injectable()
export class InMemoryUserRepository implements userRepositoryPort.UserRepositoryPort {
  private readonly store: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.store.values());
  }

  async save(user: User): Promise<User> {
    const id = user.id ?? Math.random().toString(36).slice(2);
    const saved = new User(id, user.email, user.name, user.password, user.role, user.createdAt);
    this.store.set(id, saved);
    return saved;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
