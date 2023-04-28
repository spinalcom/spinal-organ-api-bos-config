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

import { Route, Get, Post, Delete, Body, Controller, Tags, Put, Path, UploadedFile, Security, Request } from "tsoa";
import { APIService } from "../services";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { IApiRoute } from "../interfaces";
import { checkIfItIsAdmin } from "../security/authentication";
import { AuthError } from "../security/AuthError";

import * as express from "express";

const apiService = APIService.getInstance();


@Route("/api/v1")
@Tags("Apis")
export class APIController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/create_bos_api_route")
    public async createBosApiRoute(@Request() req: express.Request, @Body() data: IApiRoute): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await apiService.createApiRoute(data);
            this.setStatus(HTTP_CODES.CREATED);
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/update_bos_api_route/{id}")
    public async updateBosApiRoute(@Request() req: express.Request, @Body() data: IApiRoute, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await apiService.updateApiRoute(id, data);
            this.setStatus(HTTP_CODES.ACCEPTED)
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_bos_api_route/{id}")
    public async getBosApiRouteById(@Request() req: express.Request, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await apiService.getApiRouteById(id);
            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `No api route found for ${id}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_bos_api_route")
    public async getAllBosApiRoute(@Request() req: any): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const routes = await apiService.getAllApiRoute();
            this.setStatus(HTTP_CODES.OK)
            return routes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/delete_bos_api_route/{id}")
    public async deleteBosApiRoute(@Request() req: any, @Path() id): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            await apiService.deleteApiRoute(id);
            this.setStatus(HTTP_CODES.OK)
            return { message: `${id} api route has been deleted` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/upload_bos_apis_routes")
    public async uploadBosSwaggerFile(@Request() req: any, @UploadedFile() file): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            if (!file) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "No file uploaded" }
            }

            // const firstFile = Object.keys(files)[0];
            if (file) {
                // const file = files[firstFile];
                if (!/.*\.json$/.test(file.originalname)) {
                    this.setStatus(HTTP_CODES.BAD_REQUEST);
                    return { message: "The selected file must be a json file" }
                }

                const apis = await apiService.uploadSwaggerFile(file.buffer);
                this.setStatus(HTTP_CODES.OK)
                return apis.map(el => el.info.get());
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST)
            return { message: "No file uploaded" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

}

export default new APIController();