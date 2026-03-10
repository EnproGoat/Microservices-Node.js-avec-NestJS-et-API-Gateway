import { Type } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsNumber, IsPositive, IsUUID, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
