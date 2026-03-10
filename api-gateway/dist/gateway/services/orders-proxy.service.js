"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersProxyService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let OrdersProxyService = class OrdersProxyService {
    httpService;
    ordersServiceUrl = process.env.ORDERS_SERVICE_URL || 'http://localhost:3002';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getAllOrders() {
        const reponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.ordersServiceUrl + '/orders'));
        return reponse.data;
    }
    async getOrderById(id) {
        const reponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.ordersServiceUrl + '/orders/' + id));
        return reponse.data;
    }
    async createOrder(body) {
        const reponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.ordersServiceUrl + '/orders', body));
        return reponse.data;
    }
};
exports.OrdersProxyService = OrdersProxyService;
exports.OrdersProxyService = OrdersProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], OrdersProxyService);
//# sourceMappingURL=orders-proxy.service.js.map