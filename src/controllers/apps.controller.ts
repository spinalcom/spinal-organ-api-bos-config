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

import {
  AppService,
  AppsType,
  UserListService,
  UserProfileService,
} from '../services';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
  UploadedFile,
  Request,
} from 'tsoa';
import {
  BUILDING_SUB_APP_TYPE,
  HTTP_CODES,
  SECURITY_MESSAGES,
  SECURITY_NAME,
  SUB_APP_RELATION_NAME,
} from '../constant';
import { ISpinalApp } from '../interfaces';
import * as express from 'express';
import { AuthError } from '../security/AuthError';
import {
  checkAndGetTokenInfo,
  checkIfItIsAdmin,
  getProfileId,
} from '../security/authentication';
import { ISubApp } from '../interfaces/ISubApp';
import { searchById, searchByNameOrId } from '../utils/findNodeBySearchKey';

const appServiceInstance = AppService.getInstance();

@Route('/api/v1')
@Tags('Applications')
export class AppsController extends Controller {
  public constructor() {
    super();
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/create_admin_app')
  public async createAdminApp(
    @Request() req: express.Request,
    @Body() appInfo: ISpinalApp
  ): Promise<ISpinalApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await appServiceInstance.createAdminApp(appInfo);
      if (node) {
        this.setStatus(HTTP_CODES.CREATED);
        return node.info.get();
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return {
        message: 'oops, something went wrong, please check your input data',
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/create_building_app')
  public async createBuildingApp(
    @Request() req: express.Request,
    @Body() appInfo: ISpinalApp
  ): Promise<ISpinalApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await appServiceInstance.createBuildingApp(appInfo);
      if (node) {
        this.setStatus(HTTP_CODES.CREATED);
        return node.info.get();
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return {
        message: 'oops, something went wrong, please check your input data',
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/create_building_sub_app/{appId}')
  public async createBuildingSubApp(
    @Request() req: express.Request,
    @Path() appId: string,
    @Body() appInfo: ISubApp
  ): Promise<ISubApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      const profileId = await getProfileId(req);
      const appNode =
        await UserProfileService.getInstance().profileHasAccessToApp(
          searchById,
          profileId,
          appId
        );

      if (!appNode) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      if (appInfo && !appInfo.appConfig) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { message: 'AppConfig is required' };
      }
      const subAppNode = await appServiceInstance.createBuildingSubApp(
        appNode,
        appInfo
      );
      if (typeof subAppNode === 'string') {
        this.setStatus(HTTP_CODES.CONFLICT);
        return { message: subAppNode };
      } else if (subAppNode) {
        this.setStatus(HTTP_CODES.CREATED);
        return subAppNode.info.get();
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return {
        message: 'oops, something went wrong, please check your input data',
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_all_admin_apps')
  public async getAllAdminApps(
    @Request() req: express.Request
  ): Promise<ISpinalApp[] | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const nodes = await appServiceInstance.getAllAdminApps();
      this.setStatus(HTTP_CODES.OK);
      return nodes.map((el) => el.info.get());
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_all_building_apps')
  public async getAllBuildingApps(
    @Request() req: express.Request
  ): Promise<ISpinalApp[] | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const nodes = await appServiceInstance.getAllBuildingApps();
      const res = await appServiceInstance.formatAppsAndAddSubApps(nodes);

      this.setStatus(HTTP_CODES.OK);
      return res;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_admin_app/{appNameOrId}')
  public async getAdminApp(
    @Request() req: express.Request,
    @Path() appNameOrId: string
  ): Promise<ISpinalApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await appServiceInstance.getAdminApp(
        searchByNameOrId,
        appNameOrId
      );
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `No application found for this id (${appNameOrId})` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  /**
   * Get building app by name or id
   * @param {express.Request} req express request
   * @param {string} appNaneOrId app name or id
   * @return {*}  {(Promise<ISpinalApp | { message: string }>)}
   * @memberof AppsController
   */
  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_building_app/{appNaneOrId}')
  public async getBuildingApp(
    @Request() req: express.Request,
    @Path() appNaneOrId: string
  ): Promise<ISpinalApp | { message: string }> {
    try {
      const profileId = await getProfileId(req);
      const node = await UserProfileService.getInstance().profileHasAccessToApp(
        searchByNameOrId,
        profileId,
        appNaneOrId
      );

      if (!node) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      if (node) {
        const res = await appServiceInstance.formatAppAndAddSubApps(node);
        this.setStatus(HTTP_CODES.OK);
        return res;
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return {
        message: `No application found for appNaneOrId : '${appNaneOrId}'`,
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  /**
   * Get building sub app configuration by name or id
   * @param {express.Request} req
   * @param {string} appNameOrId
   * @param {string} subAppNameOrId
   * @return {*}  {(Promise<any | { message: string }>)}
   * @memberof AppsController
   */
  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_building_sub_app/{appNameOrId}/{subAppNameOrId}')
  public async getBuildingSubApp(
    @Request() req: express.Request,
    @Path() appNameOrId: string,
    @Path() subAppNameOrId: string
  ): Promise<any | { message: string }> {
    try {
      const profileId = await getProfileId(req);
      const node =
        await UserProfileService.getInstance().profileHasAccessToSubApp(
          searchByNameOrId,
          profileId,
          appNameOrId,
          subAppNameOrId
        );

      if (!node) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      if (node) {
        const elem = await node.getElement();
        if (elem) {
          const res = elem.get();
          this.setStatus(HTTP_CODES.OK);
          return res;
        }
        this.setStatus(HTTP_CODES.INTERNAL_ERROR);
        return { message: `Failed to load configuration` };
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `Failed to load configuration` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Put('/update_admin_app/{appId}')
  public async updateAdminApp(
    @Request() req: express.Request,
    @Path() appId: string,
    @Body() newInfo: ISpinalApp
  ): Promise<ISpinalApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await appServiceInstance.updateAdminApp(appId, newInfo);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: `Something went wrong, please check your input data.` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Put('/update_building_app/{appId}')
  public async updateBuildingApp(
    @Request() req: express.Request,
    @Path() appId: string,
    @Body() newInfo: ISpinalApp
  ): Promise<ISpinalApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await appServiceInstance.updateBuildingApp(appId, newInfo);
      if (node) {
        const res = await appServiceInstance.formatAppAndAddSubApps(node);
        this.setStatus(HTTP_CODES.OK);
        return res;
      }

      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: `Something went wrong, please check your input data.` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Put('/update_building_sub_app/{appId}/{subAppId}')
  public async updateBuildingSubApp(
    @Request() req: express.Request,
    @Path() appId: string,
    @Path() subAppId: string,
    @Body() newInfo: ISubApp
  ): Promise<ISubApp | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await appServiceInstance.updateBuildingSubAppInfo(
        appId,
        subAppId,
        newInfo
      );
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: `Something went wrong, please check your input data.` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Delete('/delete_admin_app/{appId}')
  public async deleteAdminApp(
    @Request() req: express.Request,
    @Path() appId: string
  ): Promise<{ message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const isDeleted = await appServiceInstance.deleteAdminApp(appId);
      const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
      const message = isDeleted
        ? `${appId} is deleted with success`
        : 'something went wrong, please check your input data';
      this.setStatus(status);
      return { message };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Delete('/delete_building_app/{appId}')
  public async deleteBuildingApp(
    @Request() req: express.Request,
    @Path() appId: string
  ): Promise<{ message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const isDeleted = await appServiceInstance.deleteBuildingApp(appId);
      const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
      const message = isDeleted
        ? `${appId} is deleted with success`
        : 'something went wrong, please check your input data';
      this.setStatus(status);
      return { message };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Delete('/delete_building_sub_app/{appId}/{subAppId}')
  public async deleteBuildingSubApp(
    @Request() req: express.Request,
    @Path() appId: string,
    @Path() subAppId: string
  ): Promise<{ message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const isDeleted = await appServiceInstance.deleteBuildingSubApp(
        appId,
        subAppId
      );
      const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
      const message = isDeleted
        ? `${appId} is deleted with success`
        : 'something went wrong, please check your input data';
      this.setStatus(status);
      return { message };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/upload_admin_apps')
  public async uploadAdminApp(
    @Request() req: express.Request,
    @UploadedFile() file
  ): Promise<ISpinalApp[] | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      if (!file) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { message: 'No file uploaded' };
      }

      // if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
      if (file && !/.*\.xlsx$/.test(file.originalname)) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { message: 'The selected file must be a json or excel file' };
      }

      const isExcel = /.*\.xlsx$/.test(file.originalname);

      const apps = await appServiceInstance.uploadApps(
        AppsType.admin as "admin",
        file.buffer,
        isExcel
      );

      if (apps && apps.length > 0) {
        this.setStatus(HTTP_CODES.CREATED);
        return apps.map((node) => node.info.get());
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return {
        message: 'oops, something went wrong, please check your input data',
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/upload_building_apps')
  public async uploadBuildingApp(
    @Request() req: express.Request,
    @UploadedFile() file
  ): Promise<ISpinalApp[] | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      if (!file) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { message: 'No file uploaded' };
      }

      if (
        file &&
        !(
          /.*\.json$/.test(file.originalname) ||
          /.*\.xlsx$/.test(file.originalname)
        )
      ) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { message: 'The selected file must be a json or excel file' };
      }

      const isExcel = /.*\.xlsx$/.test(file.originalname);

      const apps = await appServiceInstance.uploadApps(
        AppsType.building as "building",
        file.buffer,
        isExcel
      );

      if (apps && apps.length > 0) {
        this.setStatus(HTTP_CODES.CREATED);
        return apps.map((node) => node.info.get());
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return {
        message: 'oops, something went wrong, please check your input data',
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/upload_building_sub_apps')
  public async uploadBuildingSubApp(
    @Request() req: express.Request,
    @UploadedFile() file
  ): Promise<{ subApps?: ISpinalApp[]; errors?: string[] | string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      if (!file) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { errors: 'No file uploaded' };
      }

      if (
        file &&
        !(
          /.*\.json$/.test(file.originalname) ||
          /.*\.xlsx$/.test(file.originalname)
        )
      ) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { errors: 'The selected file must be a json or excel file' };
      }

      const isExcel = /.*\.xlsx$/.test(file.originalname);
      const apps = await appServiceInstance.uploadSubApps(file.buffer, isExcel);

      if (apps && apps.subApps.length > 0) {
        this.setStatus(HTTP_CODES.CREATED);
        const result: { subApps?: ISpinalApp[]; errors?: string[] } = {
          subApps: apps.subApps.map((node) => node.info.get()),
        };
        if (apps.errors && apps.errors.length > 0) {
          result.errors = apps.errors;
        }
        return result;
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return {
        errors:
          apps.errors || 'something went wrong, please check your input data',
      };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { errors: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_favorite_apps')
  public async getFavoriteApps(@Request() request: express.Request) {
    try {
      const tokenInfo: any = await checkAndGetTokenInfo(request);

      let userName = tokenInfo.userInfo.userName;

      const nodes = await UserListService.getInstance().getFavoriteApps(
        userName
      );
      const subApps = nodes.filter(
        (node) => node.info.type.get() === BUILDING_SUB_APP_TYPE
      );
      const parents = await Promise.all(
        subApps.map((node) => node.getParents(SUB_APP_RELATION_NAME))
      );
      const apps = nodes.reduce((acc, node) => {
        if (node.info.type.get() !== BUILDING_SUB_APP_TYPE) acc.add(node);
        return acc;
      }, new Set(parents.flat()));
      // const res = nodes.map((node) => node.info.get());
      const res = await AppService.getInstance().formatAppsAndAddSubApps(
        Array.from(apps),
        subApps
      );
      this.setStatus(HTTP_CODES.OK);
      return res;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/add_app_to_favoris')
  public async addAppToFavoris(
    @Request() request: express.Request,
    @Body() data: { appIds: string[] }
  ) {
    try {
      const tokenInfo: any = await checkAndGetTokenInfo(request);
      let profileId =
        tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
      let userName = tokenInfo.userInfo.userName;

      await UserListService.getInstance().addFavoriteApp(
        userName,
        profileId,
        data.appIds
      );
      const nodes = await UserListService.getInstance().getFavoriteApps(
        userName
      );

      const subApps = nodes.filter(
        (node) => node.info.type.get() === BUILDING_SUB_APP_TYPE
      );
      const parents = await Promise.all(
        subApps.map((node) => node.getParents(SUB_APP_RELATION_NAME))
      );
      const apps = nodes.reduce((acc, node) => {
        if (node.info.type.get() !== BUILDING_SUB_APP_TYPE) acc.add(node);
        return acc;
      }, new Set(parents.flat()));
      // const res = nodes.map((node) => node.info.get());
      const res = await AppService.getInstance().formatAppsAndAddSubApps(
        Array.from(apps),
        subApps
      );
      this.setStatus(HTTP_CODES.OK);
      return res;
      // return nodes.map((node) => node.info.get());
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/remove_app_from_favoris')
  public async removeAppFromFavoris(
    @Request() request: express.Request,
    @Body() data: { appIds: string[] }
  ) {
    try {
      const tokenInfo: any = await checkAndGetTokenInfo(request);

      let profileId =
        tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
      let userName = tokenInfo.userInfo.userName;

      await UserListService.getInstance().removeFavoriteApp(
        userName,
        profileId,
        data.appIds
      );
      const nodes = await UserListService.getInstance().getFavoriteApps(
        userName
      );

      const subApps = nodes.filter(
        (node) => node.info.type.get() === BUILDING_SUB_APP_TYPE
      );
      const parents = await Promise.all(
        subApps.map((node) => node.getParents(SUB_APP_RELATION_NAME))
      );
      const apps = nodes.reduce((acc, node) => {
        if (node.info.type.get() !== BUILDING_SUB_APP_TYPE) acc.add(node);
        return acc;
      }, new Set(parents.flat()));
      // const res = nodes.map((node) => node.info.get());
      const res = await AppService.getInstance().formatAppsAndAddSubApps(
        Array.from(apps),
        subApps
      );
      this.setStatus(HTTP_CODES.OK);
      return res;
      // nodes.map((node) => node.info.get());
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }
}

export default new AppsController();
