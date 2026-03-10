export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPED';

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
    public readonly status: OrderStatus = 'CREATED',
    public readonly createdAt: Date = new Date(),
  ) {}
}
