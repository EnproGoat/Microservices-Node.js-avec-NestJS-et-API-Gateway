import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ahmed@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Ahmed Mezghiche' })
  name: string;

  @ApiProperty({ example: 'ahmedsamicedricforevers' })
  password: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'USER'], example: 'USER' })
  role?: string;
}
