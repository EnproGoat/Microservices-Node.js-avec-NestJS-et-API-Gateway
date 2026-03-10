import { User } from '../../../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;

  static fromEntity(user: User): UserResponseDto {
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  }
}
