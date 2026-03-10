import { OrdersProxyService } from '../services/orders-proxy.service';
export declare class OrdersGatewayController {
    private ordersProxy;
    constructor(ordersProxy: OrdersProxyService);
    getAll(): Promise<any>;
    getOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
}
