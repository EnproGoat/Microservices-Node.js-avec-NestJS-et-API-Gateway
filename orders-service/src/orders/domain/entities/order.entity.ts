export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly status: OrderStatus = 'PENDING',
    public readonly createdAt: Date = new Date(),
  ) {}
}
