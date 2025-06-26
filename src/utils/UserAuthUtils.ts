import axios from "axios"
import { IBosCredential } from "../interfaces"
import { AuthentificationService, TokenService } from "../services"
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service"
import { CONTEXT_TO_ADMIN_USER_RELATION, CONTEXT_TO_USER_RELATION_NAME, PTR_LST_TYPE, TOKEN_RELATION_NAME } from "../constant"
import * as bcrypt from "bcrypt"

export async function _addUserToContext(context: SpinalContext, info: { [key: string]: any }, element?: spinal.Model, isAdmin: boolean = false): Promise<SpinalNode> {
    const users = await context.getChildrenInContext();

    const found = users.find((el) => el.info.userName?.get() === info.userName);
    if (found) return found;

    const nodeId = SpinalGraphService.createNode(info, element);
    const node = SpinalGraphService.getRealNode(nodeId);
    const relationName = isAdmin ? CONTEXT_TO_ADMIN_USER_RELATION : CONTEXT_TO_USER_RELATION_NAME;
    return context.addChildInContext(node, relationName, PTR_LST_TYPE, context);
}

export function _hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hashSync(password, saltRounds);
}

export function _comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function _generateString(length = 10): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
    let text = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        text += charset.charAt(Math.floor(Math.random() * n));
    }
    return text;
}

export async function _deleteUserToken(userNode: SpinalNode) {
    const tokens = await userNode.getChildren(TOKEN_RELATION_NAME);
    const promises = tokens.map((token) => TokenService.getInstance().deleteToken(token));
    return Promise.all(promises);
}

export function _getUserProfileInfo(userToken: string, adminCredential: IBosCredential, isUser: boolean = true) {
    let urlAdmin = adminCredential.urlAdmin;
    let endpoint = "/tokens/getUserProfileByToken";
    return axios
        .post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken,
        })
        .then((result) => {
            if (!result.data) return;
            const data = result.data;
            delete data.password;
            return data;
        })
        .catch((err) => {
            return {};
        });
}

export function _getUserInfo(userId: string, adminCredential: IBosCredential, userToken: string) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": userToken,
        }
    };
    return axios.get(`${adminCredential.urlAdmin}/users/${userId}`, config)
        .then((result) => {
            return result.data;
        })
        .catch((err) => {
            console.error(err);
        });
}

export async function _getAuthPlateformInfo() {
    const adminCredential = await AuthentificationService.getInstance().getBosToAdminCredential();
    if (!adminCredential) throw new Error("No authentication platform is registered");
    return adminCredential;
}

export function getUserInfoByToken(adminCredential: IBosCredential, userToken: string) {
    const data = { token: userToken }
    return axios.post(`${adminCredential.urlAdmin}/users/userInfo`, data).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    })
}