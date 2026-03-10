import { UsersProxyService } from '../services/users-proxy.service';
export declare class UsersGatewayController {
    private usersProxy;
    constructor(usersProxy: UsersProxyService);
    getAll(): Promise<any>;
    getOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
}
