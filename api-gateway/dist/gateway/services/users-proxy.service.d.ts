import { HttpService } from '@nestjs/axios';
export declare class UsersProxyService {
    private httpService;
    private usersServiceUrl;
    constructor(httpService: HttpService);
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    createUser(body: any): Promise<any>;
}
