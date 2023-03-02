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
import { UserProfileService } from "../services";
import { Route, Tags, Controller, Post, Get, Put, Delete, Body, Path, Security, Query } from "tsoa";
import { _formatProfile, _getNodeListInfo } from '../utils/profileUtils'

const serviceInstance = UserProfileService.getInstance();

@Route("/api/v1/user_profile")
@Tags("user Profiles")
export class UserProfileController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.admin)
    @Post("/create_profile")
    public async createUserProfile(@Body() data: IProfile): Promise<IProfileData | { message: string }> {
        try {

            if (!data.name) {
                this.setStatus(HTTP_CODES.BAD_REQUEST)
                return { message: "The profile name is required" };
            }

            const profile = await serviceInstance.createUserProfile(data);
            this.setStatus(HTTP_CODES.CREATED)
            return _formatProfile(profile);

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.profile)
    @Get("/get_profile/{id}")
    public async getUserProfile(@Path() id: string): Promise<IProfileData | { message: string }> {
        try {
            const data = await serviceInstance.getUserProfile(id);
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
    public async getAllUserProfile(): Promise<IProfileData[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAllUserProfile() || [];
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => _formatProfile(el));
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Put("/edit_profile/{id}")
    public async updateUserProfile(@Path() id: string, @Body() data: IProfileAuthEdit): Promise<IProfileData | { message: string }> {
        try {
            const node = await serviceInstance.updateUserProfile(id, data);
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
    public async deleteUserProfile(@Path() id: string): Promise<{ message: string }> {
        try {

            await serviceInstance.deleteUserProfile(id);
            this.setStatus(HTTP_CODES.OK);
            return { message: "user profile deleted" };

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
    @Get("/get_authorized_apps/{profileId}")
    public async getAuthorizedApps(@Path() profileId: string) {
        try {
            const contexts = await serviceInstance.getAuthorizedApps(profileId);
            this.setStatus(HTTP_CODES.OK);
            return _getNodeListInfo(contexts);
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_admin_apps/{profileId}")
    public async getAuthorizedAdminApps(@Path() profileId: string) {
        try {
            const contexts = await serviceInstance.getAuthorizedAdminApps(profileId);
            this.setStatus(HTTP_CODES.OK);
            return _getNodeListInfo(contexts);
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }



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
    @Post("/authorize_profile_to_access_apps/{profileId}")
    public async authorizeProfileToAccessApps(@Path() profileId: string, @Body() data: { appIds: string | string[] }) {
        try {
            const apps = await serviceInstance.authorizeProfileToAccessApps(profileId, data.appIds);
            if (apps) {
                this.setStatus(HTTP_CODES.OK);
                return _getNodeListInfo(apps);
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
    @Post("/unauthorize_profile_to_access_apps/{profileId}")
    public async unauthorizeProfileToAccessApps(@Path() profileId: string, @Body() data: { appIds: string | string[] }) {
        try {
            const apps = await serviceInstance.unauthorizeProfileToAccessApps(profileId, data.appIds);
            if (apps) {
                this.setStatus(HTTP_CODES.OK);
                return _getNodeListInfo(apps);
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
    @Get("/profile_has_access_to_app/{profileId}/{appId}")
    public async profileHasAccessToApp(@Path() profileId: string, @Path() appId: string) {
        try {
            const hasAccess = await serviceInstance.profileHasAccessToApp(profileId, appId);
            this.setStatus(HTTP_CODES.OK)
            return hasAccess;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }





}


export default new UserProfileController();