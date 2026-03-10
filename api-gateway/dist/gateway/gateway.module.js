"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const users_proxy_service_1 = require("./services/users-proxy.service");
const orders_proxy_service_1 = require("./services/orders-proxy.service");
const users_gateway_controller_1 = require("./users/users-gateway.controller");
const orders_gateway_controller_1 = require("./orders/orders-gateway.controller");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [users_gateway_controller_1.UsersGatewayController, orders_gateway_controller_1.OrdersGatewayController],
        providers: [users_proxy_service_1.UsersProxyService, orders_proxy_service_1.OrdersProxyService],
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map