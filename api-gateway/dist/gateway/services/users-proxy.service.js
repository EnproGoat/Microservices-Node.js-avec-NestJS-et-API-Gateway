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
exports.UsersProxyService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let UsersProxyService = class UsersProxyService {
    httpService;
    usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3001';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getAllUsers() {
        const reponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.usersServiceUrl + '/users'));
        return reponse.data;
    }
    async getUserById(id) {
        const reponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.usersServiceUrl + '/users/' + id));
        return reponse.data;
    }
    async createUser(body) {
        const reponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.usersServiceUrl + '/users', body));
        return reponse.data;
    }
};
exports.UsersProxyService = UsersProxyService;
exports.UsersProxyService = UsersProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UsersProxyService);
//# sourceMappingURL=users-proxy.service.js.map