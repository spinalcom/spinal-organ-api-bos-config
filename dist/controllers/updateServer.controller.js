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
exports.UpdateServerController = void 0;
const tsoa_1 = require("tsoa");
const express = require("express");
const child_process_1 = require("child_process");
const constant_1 = require("../constant");
const authentication_1 = require("../security/authentication");
let UpdateServerController = class UpdateServerController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async updateServer(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin) {
                this.setStatus(constant_1.HTTP_CODES.UNAUTHORIZED);
                return { message: 'Only admins can trigger a server update' };
            }
            const output = await runCommand('git stash && git pull && git stash pop; spinalcom-utils i && pm2 restart ecosystem.config.js');
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: 'Server update triggered successfully', output };
        }
        catch (error) {
            this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message || 'Update failed' };
        }
    }
};
exports.UpdateServerController = UpdateServerController;
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/update-server'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpdateServerController.prototype, "updateServer", null);
exports.UpdateServerController = UpdateServerController = __decorate([
    (0, tsoa_1.Route)('/api/v1'),
    (0, tsoa_1.Tags)('Server'),
    __metadata("design:paramtypes", [])
], UpdateServerController);
function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, { cwd: __dirname + '/../..' }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
                return;
            }
            resolve(stdout + (stderr ? '\n' + stderr : ''));
        });
    });
}
//# sourceMappingURL=updateServer.controller.js.map