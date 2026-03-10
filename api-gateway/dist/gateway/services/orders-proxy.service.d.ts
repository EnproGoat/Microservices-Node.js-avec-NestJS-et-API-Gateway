import { HttpService } from '@nestjs/axios';
export declare class OrdersProxyService {
    private httpService;
    private ordersServiceUrl;
    constructor(httpService: HttpService);
    getAllOrders(): Promise<any>;
    getOrderById(id: string): Promise<any>;
    createOrder(body: any): Promise<any>;
}
