/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { HTTP_CODES, SECURITY_NAME } from "../constant";
import { IProfile, IProfileAuthEdit, IProfileData } from "../interfaces";
import { AppProfileService } from "../services";
import { Route, Tags, Controller, Post, Get, Put, Delete, Body, Path, Security, Query } from "tsoa";
import { _formatProfile, _getNodeListInfo } from '../utils/profileUtils'
const serviceInstance = AppProfileService.getInstance();

@Route("/api/v2/app_profile")
@Tags("App Profiles")
export class AppProfileController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.admin)
    @Post("/create_profile")
    public async createAppProfile(@Body() data: IProfile): Promise<IProfileData | { message: string }> {
        try {

            if (!data.name) {
                this.setStatus(HTTP_CODES.BAD_REQUEST)
                return { message: "The profile name is required" };
            }

            const profile = await serviceInstance.createAppProfile(data);
            this.setStatus(HTTP_CODES.CREATED)
            return _formatProfile(profile);

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.profile)
    @Get("/get_profile/{id}")
    public async getAppProfile(@Path() id: string): Promise<IProfileData | { message: string }> {
        try {
            const data = await serviceInstance.getAppProfile(id);
            if (data) {
                this.setStatus(HTTP_CODES.OK)
                return _formatProfile(data);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${id}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_all_profile")
    public async getAllAppProfile(): Promise<IProfileData[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAllAppProfile() || [];
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => _formatProfile(el));
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Put("/edit_profile/{id}")
    public async updateAppProfile(@Path() id: string, @Body() data: IProfileAuthEdit): Promise<IProfileData | { message: string }> {
        try {
            const node = await serviceInstance.updateAppProfile(id, data);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return _formatProfile(node);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Delete("/delete_profile/{id}")
    public async deleteAppProfile(@Path() id: string): Promise<{ message: string }> {
        try {

            await serviceInstance.deleteAppProfile(id);
            this.setStatus(HTTP_CODES.OK);
            return { message: "user profile deleted" };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    //////////////////////////////////////////////////////////////////////////

    @Security(SECURITY_NAME.admin)
    @Post("/authorize_profile_to_access_contexts/{profileId}")
    public async authorizeProfileToAccessContext(@Path() profileId: string, @Body() data: { contextIds: string | string[], digitalTwinId?: string }) {
        try {
            const contexts = await serviceInstance.authorizeProfileToAccessContext(profileId, data.contextIds, data.digitalTwinId);
            if (contexts) {
                this.setStatus(HTTP_CODES.OK);
                return _getNodeListInfo(contexts);
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "something went wrong please check your input" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/authorize_profile_to_access_apis/{profileId}")
    public async authorizeProfileToAccessApis(@Path() profileId: string, @Body() data: { apiIds: string | string[] }) {
        try {
            const apis = await serviceInstance.authorizeProfileToAccessApis(profileId, data.apiIds);
            if (apis) {
                this.setStatus(HTTP_CODES.OK);
                return _getNodeListInfo(apis);
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "something went wrong please check your input" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.admin)
    @Post("/unauthorize_profile_to_access_contexts/{profileId}")
    public async unauthorizeProfileToAccessContext(@Path() profileId: string, @Body() data: { contextIds: string | string[], digitalTwinId?: string }) {
        try {
            const contexts = await serviceInstance.unauthorizeProfileToAccessContext(profileId, data.contextIds, data.digitalTwinId);
            if (contexts) {
                this.setStatus(HTTP_CODES.OK);
                return _getNodeListInfo(contexts);
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "something went wrong please check your input" };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/unauthorize_profile_to_access_apis/{profileId}")
    public async unauthorizeProfileToAccessApis(@Path() profileId: string, @Body() data: { apiIds: string | string[] }) {
        try {
            const apis = await serviceInstance.unauthorizeProfileToAccessApis(profileId, data.apiIds);
            if (apis) {
                this.setStatus(HTTP_CODES.OK);
                return _getNodeListInfo(apis);
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "something went wrong please check your input" };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/profile_has_access_to_context/{profileId}/{contextId}")
    public async profileHasAccessToContext(@Path() profileId: string, @Path() contextId: string, @Query() digitalTwinId?: string) {
        try {
            const hasAccess = await serviceInstance.profileHasAccessToContext(profileId, contextId, digitalTwinId);
            this.setStatus(HTTP_CODES.OK)
            return hasAccess;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/profile_has_access_to_api/{profileId}/{apiId}")
    public async profileHasAccessToApi(@Path() profileId: string, @Path() apiId: string) {
        try {
            const hasAccess = await serviceInstance.profileHasAccessToApi(profileId, apiId);
            this.setStatus(HTTP_CODES.OK)
            return hasAccess;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_contexts/{profileId}")
    public async getAuthorizedContexts(@Path() profileId: string, @Query() digitalTwinId?: string) {
        try {
            const contexts = await serviceInstance.getAuthorizedContexts(profileId, digitalTwinId);
            this.setStatus(HTTP_CODES.OK);
            return _getNodeListInfo(contexts);
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_apis/{profileId}")
    public async getAuthorizedApis(@Path() profileId: string) {
        try {
            const contexts = await serviceInstance.getAuthorizedApis(profileId);
            this.setStatus(HTTP_CODES.OK);
            return _getNodeListInfo(contexts);
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


}



export default new AppProfileController();