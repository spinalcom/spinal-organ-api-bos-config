import axios from 'axios';
import { IAppCredential, IApplicationToken, IOAuth2Credential } from '../interfaces';
import { CONTEXT_TO_APP_RELATION_NAME, HTTP_CODES, PTR_LST_TYPE, USER_TYPES } from '../constant';
import { TokenService } from '../services';
import { SpinalContext, SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';
import { AuthError } from '../security/AuthError';


export function authenticateApplication(urlAdmin: string, idPlateform: string, application: IAppCredential | IOAuth2Credential, context: SpinalContext): Promise<{ code: number; data: string | IApplicationToken }> {

    throw new AuthError(`This authentication method is deprecated. Please use the new authentication method.`);


    // const url = `${urlAdmin}/applications/login`;

    // return axios.post(url, application)
    //     .then(async (result) => {
    //         const data = result.data;
    //         data.profile = await _getProfileInfo(data.token, urlAdmin, idPlateform);
    //         data.userInfo = await _getApplicationInfo(data.applicationId, urlAdmin, data.token);

    //         const type = USER_TYPES.APP;
    //         const info = { clientId: application.clientId, type, userType: type };

    //         const node = await _addUserToContext(context, info);
    //         await TokenService.getInstance().(node, data.token, data);

    //         return {
    //             code: HTTP_CODES.OK,
    //             data,
    //         };
    //     })
    //     .catch((err) => {
    //         return {
    //             code: HTTP_CODES.UNAUTHORIZED,
    //             data: "bad credential",
    //         };
    //     });
}

export function _getProfileInfo(userToken: string, urlAdmin: string, idPlateform: string) {
    let endpoint = "/tokens/getAppProfileByToken";
    return axios
        .post(urlAdmin + endpoint, {
            platformId: idPlateform,
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

function _getApplicationInfo(applicationId: string, adminUrl: string, userToken: string) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            // "x-access-token": adminCredential.tokenBosAdmin
            "x-access-token": userToken,
        },
    };
    return axios.get(`${adminUrl}/applications/${applicationId}`, config)
        .then((result) => {
            return result.data;
        })
        .catch((err) => {
            console.error(err);
        });
}

export async function _addUserToContext(context: SpinalContext, info: { [key: string]: any }, element?: spinal.Model): Promise<SpinalNode> {
    const users = await context.getChildrenInContext();

    const found = users.find((el) => el.info.clientId?.get() === info.clientId);
    if (found) return found;

    const nodeId = SpinalGraphService.createNode(info, element);
    const node = SpinalGraphService.getRealNode(nodeId);
    return context.addChildInContext(node, CONTEXT_TO_APP_RELATION_NAME, PTR_LST_TYPE, context);
}