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

import { DigitalTwinService } from "../services";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, Tags } from "tsoa";
import * as express from 'express';
import { checkIfItIsAdmin } from "../security/authentication";
import { AuthError } from "../security/AuthError";

const serviceInstance = DigitalTwinService.getInstance();

@Route("/api/v1")
@Tags("DigitalTwin")
export class DigitaltwinController extends Controller {

    public constructor() {
        super();
    }

    // @Security(SECURITY_NAME.admin)
    @Post("/add_digitaltwin")
    public async addDigitalTwin(@Request() req: express.Request, @Body() data: { name: string; url: string }, @Query() set_as_actual_digitaltwin?: boolean) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            if (!data.name || !data.name.trim()) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "The file name is mandatory" };
            }

            try {
                const node = await serviceInstance.createDigitalTwin(data.name, data.url, set_as_actual_digitaltwin);
                this.setStatus(HTTP_CODES.CREATED);
                return node.info.get();

            } catch (error) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: error.message }
            }

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Get("/get_all_digitaltwins")
    public async getAllDigitalTwins(@Request() req: express.Request,) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const digitalTwins = await serviceInstance.getAllDigitalTwins();
            this.setStatus(HTTP_CODES.OK);
            return digitalTwins.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Get("/get_digitaltwin/{digitaltwinId}")
    public async getDigitalTwin(@Request() req: express.Request, @Path() digitaltwinId: string) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const digitaltwin = await serviceInstance.getDigitalTwin(digitaltwinId);
            if (digitaltwin) {
                this.setStatus(HTTP_CODES.OK)
                return digitaltwin.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `No digitalTwin found for ${digitaltwinId}` }
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Put("/set_as_actual_digitaltwin/{digitaltwinId}")
    public async setActualDigitalTwin(@Request() req: express.Request, @Path() digitaltwinId: string) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await serviceInstance.setActualDigitalTwin(digitaltwinId);
            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `No digitalTwin found for ${digitaltwinId}` }
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Get("/get_actual_digitaltwin")
    public async getActualDigitalTwin(@Request() req: express.Request,) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await serviceInstance.getActualDigitalTwin();
            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `No digitaltwin is set up` }
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    // @Security(SECURITY_NAME.admin)
    @Get("/get_digitaltwin_contexts")
    public async getDefaultDigitalTwinContexts(@Request() req: express.Request,) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const contexts = await serviceInstance.getDigitalTwinContexts();
            this.setStatus(HTTP_CODES.OK)
            return contexts.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Get("/get_digitaltwin_contexts/{digitaltwinId}")
    public async getDigitalTwinContexts(@Request() req: express.Request, @Path() digitaltwinId: string) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const contexts = await serviceInstance.getDigitalTwinContexts(digitaltwinId);
            this.setStatus(HTTP_CODES.OK)
            return contexts.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Put("/update_digitaltwin/{digitaltwinId}")
    public async editDigitalTwin(@Request() req: express.Request, @Path() digitaltwinId: string, @Body() data: { name?: string; url?: string }) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await serviceInstance.editDigitalTwin(digitaltwinId, data);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `No digitaltwin found for ${digitaltwinId}` }

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Delete("/delete_digitaltwin/{digitaltwinId}")
    public async removeDigitalTwin(@Request() req: express.Request, @Path() digitaltwinId: string) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const deleted = await serviceInstance.removeDigitalTwin(digitaltwinId);
            if (deleted) {
                this.setStatus(HTTP_CODES.OK);
                return { message: `digitaltwin deleted with success` }
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: `sommething went wrong, please check digitaltwin id` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Delete("/delete_actual_digitaltwin")
    public async removeActualDigitaTwin(@Request() req: express.Request,) {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const deleted = await serviceInstance.removeActualDigitaTwin();
            if (deleted) {
                this.setStatus(HTTP_CODES.OK);
                return { message: `actual digitaltwin deleted with success` }
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST);
            return { message: `sommething went wrong, please check if default digitaltwin is set up` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

}


export default new DigitaltwinController();