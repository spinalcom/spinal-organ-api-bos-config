"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoginProxy = void 0;
const services_1 = require("../../services");
const constant_1 = require("../../constant");
function useLoginProxy(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authPlatformIsConnected = yield services_1.AuthentificationService.getInstance().authPlatformIsConnected;
            if (authPlatformIsConnected) {
                const url = getAuthServerUrl();
                res.redirect(url);
                return;
            }
            res.send({ status: constant_1.HTTP_CODES.BAD_REQUEST, message: "No Authentification server connected, use /admin endpoint to connect as admin" });
        }));
        app.post("/callback", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(req.body.data);
                const formatData = yield services_1.UserListService.getInstance().getUserDataFormatted(data);
                const profileId = formatData.profile.userProfileBosConfigId || data.profile.profileId;
                const token = formatData.token;
                const user = btoa(JSON.stringify(formatData.userInfo));
                res.cookie("profileId", profileId);
                res.cookie("token", token);
                res.cookie("user", user);
                const vue_client_uri = process.env.VUE_CLIENT_URI;
                res.redirect(vue_client_uri);
            }
            catch (error) {
                console.error(error.message);
            }
        }));
    });
}
exports.useLoginProxy = useLoginProxy;
function getAuthServerUrl() {
    let server_url = process.env.AUTH_SERVER_URL;
    let client_id = process.env.AUTH_CLIENT_ID;
    return server_url.endsWith("/") ? `${server_url}login/${client_id}` : `${server_url}/login/${client_id}`;
}
//# sourceMappingURL=index.js.map