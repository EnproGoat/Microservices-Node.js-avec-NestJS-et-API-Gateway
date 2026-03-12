export type UserRole = 'ADMIN' | 'USER';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly role: UserRole = 'USER',
    public readonly createdAt: Date = new Date(),
  ) {}
}
