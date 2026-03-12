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
exports.UsersGatewayController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const users_proxy_service_1 = require("../services/users-proxy.service");
let UsersGatewayController = class UsersGatewayController {
    usersProxy;
    constructor(usersProxy) {
        this.usersProxy = usersProxy;
    }
    async getAll() {
        try {
            const users = await this.usersProxy.getAllUsers();
            return users;
        }
        catch (err) {
            console.log('erreur dans getAll users:', err.message);
            throw new common_1.HttpException('users-service indisponible', common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getOne(id) {
        try {
            const user = await this.usersProxy.getUserById(id);
            return user;
        }
        catch (err) {
            const statusCode = err.response?.status ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = err.response?.data ?? err.message;
            throw new common_1.HttpException(message, statusCode);
        }
    }
    async create(body) {
        try {
            const nouveauUser = await this.usersProxy.createUser(body);
            return nouveauUser;
        }
        catch (err) {
            const statusCode = err.response?.status ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = err.response?.data ?? err.message;
            throw new common_1.HttpException(message, statusCode);
        }
    }
};
exports.UsersGatewayController = UsersGatewayController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersGatewayController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersGatewayController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersGatewayController.prototype, "create", null);
exports.UsersGatewayController = UsersGatewayController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_proxy_service_1.UsersProxyService])
], UsersGatewayController);
//# sourceMappingURL=users-gateway.controller.js.map