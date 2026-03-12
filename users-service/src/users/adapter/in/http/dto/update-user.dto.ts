import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../../domain/entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'USER'])
  role?: UserRole;
}
