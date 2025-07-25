import axios from "axios";
import { CODE_USED_LIST_CONTEXT_NAME, CODE_USED_LIST_CONTEXT_TYPE, CONTEXT_TO_CODE_RELATION_NAME, HTTP_CODES, PTR_LST_TYPE } from "../constant";
import { OtherError } from "../security/AuthError";
import { AuthentificationService } from "./authentification.service";
import { IBosCredential } from "../interfaces";
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { TokenService } from "./token.service";


export class SpinalCodeUniqueService {
    static instance: SpinalCodeUniqueService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): SpinalCodeUniqueService {
        if (!this.instance) this.instance = new SpinalCodeUniqueService();
        return this.instance;
    }

    async init() {
        this.context = await configServiceInstance.getContext(CODE_USED_LIST_CONTEXT_NAME);
        if (!this.context) {
            this.context = await configServiceInstance.addContext(CODE_USED_LIST_CONTEXT_NAME, CODE_USED_LIST_CONTEXT_TYPE);
        }

        return this.context;
    }


    public async consumeCode(code: string) {
        const bosCredential = await AuthentificationService.getInstance().getBosToAdminCredential();
        if (!bosCredential) throw new OtherError(HTTP_CODES.NOT_FOUND, `No auth found for code ${code}`);

        return axios.post(`${bosCredential.urlAdmin}/codes/consume/${code}`,
            {},
            { headers: { 'Content-Type': 'application/json' } })
            .then(async (result) => {
                let data = result.data;
                data.profile = await this._getProfileInfo(data.token, bosCredential);
                data.userInfo = await this._getCodeInfo(code, bosCredential, data.token);

                const type = "code";
                const info = { name: data.userInfo?.name || code, applicationId: data.userInfo?.applicationId, userId: data.userInfo?.userId, type, userType: type }

                const node = await this._addUserToContext(info);
                await TokenService.getInstance().addTokenToContext(data.token, data);

                return data;
            })


    }


    private _getProfileInfo(userToken: string, adminCredential: IBosCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getCodeProfileByToken";
        return axios.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken
        }).then((result) => {
            if (!result.data) return;
            const data = result.data;
            return data;
        }).catch(err => {
            return {};
        })
    }

    private _getCodeInfo(code: string, adminCredential: IBosCredential, userToken: string) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        }
        return axios.get(`${adminCredential.urlAdmin}/codes/getcode/${code}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        })
    }

    private async _addUserToContext(info: { [key: string]: any }, element?: spinal.Model): Promise<SpinalNode> {

        const nodeId = SpinalGraphService.createNode(info, element);
        const node = SpinalGraphService.getRealNode(nodeId);
        return this.context.addChildInContext(node, CONTEXT_TO_CODE_RELATION_NAME, PTR_LST_TYPE, this.context);
    }


}