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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGatewayController = void 0;
const common_1 = require("@nestjs/common");
const orders_proxy_service_1 = require("../services/orders-proxy.service");
let OrdersGatewayController = class OrdersGatewayController {
    ordersProxy;
    constructor(ordersProxy) {
        this.ordersProxy = ordersProxy;
    }
    async getAll() {
        try {
            const orders = await this.ordersProxy.getAllOrders();
            return orders;
        }
        catch (err) {
            console.log('erreur dans getAll orders:', err.message);
            throw new common_1.HttpException('orders-service indisponible', common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getOne(id) {
        try {
            const order = await this.ordersProxy.getOrderById(id);
            return order;
        }
        catch (err) {
            const statusCode = err.response?.status ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = err.response?.data ?? err.message;
            throw new common_1.HttpException(message, statusCode);
        }
    }
    async create(body) {
        try {
            const nouvelleOrder = await this.ordersProxy.createOrder(body);
            return nouvelleOrder;
        }
        catch (err) {
            const statusCode = err.response?.status ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = err.response?.data ?? err.message;
            throw new common_1.HttpException(message, statusCode);
        }
    }
};
exports.OrdersGatewayController = OrdersGatewayController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "create", null);
exports.OrdersGatewayController = OrdersGatewayController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_proxy_service_1.OrdersProxyService])
], OrdersGatewayController);
//# sourceMappingURL=orders-gateway.controller.js.map