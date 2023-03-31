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

import { AppService, AppsType, TokenService, UserListService, UserProfileService } from "../services";
import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags, UploadedFile, Request } from "tsoa";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { IApp } from "../interfaces";
import * as express from "express";
import { getToken } from "../security/utils";
import { AuthError } from "../security/AuthError";
import { checkAndGetTokenInfo, checkIfItIsAdmin, getProfileId } from "../security/authentication";

const appServiceInstance = AppService.getInstance();

@Route("/api/v1")
@Tags("Applications")
export class AppsController extends Controller {

    public constructor() {
        super();
    }

    // @Security(SECURITY_NAME.admin)
    @Post("/create_admin_app")
    public async createAdminApp(@Request() req: express.Request, @Body() appInfo: IApp): Promise<IApp | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await appServiceInstance.createAdminApp(appInfo);
            if (node) {
                this.setStatus(HTTP_CODES.CREATED);
                return node.info.get();
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "oops, something went wrong, please check your input data" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Post("/create_building_app")
    public async createBuildingApp(@Request() req: express.Request, @Body() appInfo: IApp): Promise<IApp | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await appServiceInstance.createBuildingApp(appInfo);
            if (node) {
                this.setStatus(HTTP_CODES.CREATED);
                return node.info.get();
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "oops, something went wrong, please check your input data" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Get("/get_all_admin_apps")
    public async getAllAdminApps(@Request() req: express.Request,): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await appServiceInstance.getAllAdminApps();
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Get("/get_all_building_apps")
    public async getAllBuildingApps(@Request() req: express.Request,): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await appServiceInstance.getAllBuildingApps();
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Get("/get_admin_app/{appId}")
    public async getAdminApp(@Request() req: express.Request, @Path() appId: string): Promise<IApp | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const node = await appServiceInstance.getAdminApp(appId);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `No application found for this id (${appId})` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.profile)
    @Get("/get_building_app/{appId}")
    public async getBuildingApp(@Request() req: express.Request, @Path() appId: string): Promise<IApp | { message: string }> {
        try {
            const profileId = await getProfileId(req);
            const node = await UserProfileService.getInstance().profileHasAccessToApp(profileId, appId);

            if (!node) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            // const node = await appServiceInstance.getBuildingApp(appId);

            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `No application found for this id (${appId})` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Put("/update_admin_app/{appId}")
    public async updateAdminApp(@Request() req: express.Request, @Path() appId: string, @Body() newInfo: IApp): Promise<IApp | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await appServiceInstance.updateAdminApp(appId, newInfo);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: `Something went wrong, please check your input data.` }

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Put("/update_building_app/{appId}")
    public async updateBuildingApp(@Request() req: express.Request, @Path() appId: string, @Body() newInfo: IApp): Promise<IApp | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await appServiceInstance.updateBuildingApp(appId, newInfo);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: `Something went wrong, please check your input data.` }

        } catch (error) {

            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Delete("/delete_admin_app/{appId}")
    public async deleteAdminApp(@Request() req: express.Request, @Path() appId: string): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const isDeleted = await appServiceInstance.deleteAdminApp(appId);
            const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
            const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        } catch (error) {

            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Delete("/delete_building_app/{appId}")
    public async deleteBuildingApp(@Request() req: express.Request, @Path() appId: string): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const isDeleted = await appServiceInstance.deleteBuildingApp(appId);
            const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
            const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Post("/upload_admin_apps")
    public async uploadAdminApp(@Request() req: express.Request, @UploadedFile() file): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            if (!file) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "No file uploaded" }
            }

            // if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
            if (file && !(/.*\.xlsx$/.test(file.originalname))) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "The selected file must be a json or excel file" }
            }

            const isExcel = /.*\.xlsx$/.test(file.originalname);

            const apps = await appServiceInstance.uploadApps(AppsType.admin, file.buffer, isExcel);

            if (apps && apps.length > 0) {
                this.setStatus(HTTP_CODES.CREATED);
                return apps.map(node => node.info.get());
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "oops, something went wrong, please check your input data" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Post("/upload_building_apps")
    public async uploadBuildingApp(@Request() req: express.Request, @UploadedFile() file): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            if (!file) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "No file uploaded" }
            }

            if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "The selected file must be a json or excel file" }
            }

            const isExcel = /.*\.xlsx$/.test(file.originalname);

            const apps = await appServiceInstance.uploadApps(AppsType.building, file.buffer, isExcel);

            if (apps && apps.length > 0) {
                this.setStatus(HTTP_CODES.CREATED);
                return apps.map(node => node.info.get());
            }
            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: "oops, something went wrong, please check your input data" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }



    // @Security(SECURITY_NAME.profile)
    @Get("/get_favorite_apps")
    public async getFavoriteApps(@Request() request: express.Request) {
        try {
            const tokenInfo: any = await checkAndGetTokenInfo(request);

            let userName = tokenInfo.userInfo.userName;

            const nodes = await UserListService.getInstance().getFavoriteApps(userName);
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(node => node.info.get());

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.profile)
    @Post("/add_app_to_favoris")
    public async addAppToFavoris(@Request() request: express.Request, @Body() data: { appIds: string[] }) {
        try {
            const tokenInfo: any = await checkAndGetTokenInfo(request);

            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;

            const nodes = await UserListService.getInstance().addFavoriteApp(userName, profileId, data.appIds);
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(node => node.info.get());

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.profile)
    @Post("/remove_app_from_favoris")
    public async removeAppFromFavoris(@Request() request: express.Request, @Body() data: { appIds: string[] }) {
        try {
            const tokenInfo: any = await checkAndGetTokenInfo(request);

            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;

            const nodes = await UserListService.getInstance().removeFavoriteApp(userName, profileId, data.appIds);
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(node => node.info.get());

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

}

export default new AppsController();