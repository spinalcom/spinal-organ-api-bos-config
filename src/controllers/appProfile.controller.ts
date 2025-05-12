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

import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from '../constant';
import { IProfile, IProfileAuthEdit, IProfileData } from '../interfaces';
import { AppProfileService } from '../services';
import {
  Route,
  Tags,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Path,
  Security,
  Query,
  Request,
} from 'tsoa';
import { _formatProfile, _getNodeListInfo } from '../utils/profileUtils';
import * as express from 'express';
import { checkIfItIsAdmin, getProfileId } from '../security/authentication';
import { AuthError } from '../security/AuthError';
import { AdminProfileService } from '../services/adminProfile.service';

const serviceInstance = AppProfileService.getInstance();

@Route('/api/v1/app_profile')
@Tags('App Profiles')
export class AppProfileController extends Controller {
  public constructor() {
    super();
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/create_profile')
  public async createAppProfile(
    @Request() req: express.Request,
    @Body() data: IProfile
  ): Promise<IProfileData | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      if (!data.name) {
        this.setStatus(HTTP_CODES.BAD_REQUEST);
        return { message: 'The profile name is required' };
      }

      const profile = await serviceInstance.createAppProfile(data);
      this.setStatus(HTTP_CODES.CREATED);
      return await _formatProfile(profile);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_profile/{id}')
  public async getAppProfile(
    @Request() req: express.Request,
    @Path() id: string
  ): Promise<IProfileData | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const data = await serviceInstance.getAppProfile(id);
      if (data) {
        this.setStatus(HTTP_CODES.OK);
        return await _formatProfile(data);
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `no profile found for ${id}` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_all_profile')
  public async getAllAppProfile(
    @Request() req: express.Request
  ): Promise<IProfileData[] | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const nodes = (await serviceInstance.getAllAppProfile()) || [];
      this.setStatus(HTTP_CODES.OK);
      return await Promise.all(nodes.map((el) => _formatProfile(el)));
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Put('/edit_profile/{id}')
  public async updateAppProfile(
    @Request() req: express.Request,
    @Path() id: string,
    @Body() data: IProfileAuthEdit
  ): Promise<IProfileData | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await serviceInstance.updateAppProfile(id, data);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return await _formatProfile(node);
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `no profile found for ${id}` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Delete('/delete_profile/{id}')
  public async deleteAppProfile(
    @Request() req: express.Request,
    @Path() id: string
  ): Promise<{ message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      await serviceInstance.deleteAppProfile(id);
      this.setStatus(HTTP_CODES.OK);
      return { message: 'user profile deleted' };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  //////////////////////////////////////////////////////////////////////////

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/authorize_profile_to_access_contexts/{profileId}')
  public async authorizeProfileToAccessContext(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Body() data: { contextIds: string | string[]; digitalTwinId?: string }
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const contexts = await serviceInstance.authorizeProfileToAccessContext(
        profileId,
        data.contextIds,
        data.digitalTwinId
      );
      if (contexts) {
        this.setStatus(HTTP_CODES.OK);
        return _getNodeListInfo(contexts);
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: 'something went wrong please check your input' };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/authorize_profile_to_access_apis/{profileId}')
  public async authorizeProfileToAccessApis(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Body() data: { apiIds: string | string[] }
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const apis = await serviceInstance.authorizeProfileToAccessApis(
        profileId,
        data.apiIds
      );
      if (apis) {
        this.setStatus(HTTP_CODES.OK);
        return _getNodeListInfo(apis);
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: 'something went wrong please check your input' };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/unauthorize_profile_to_access_contexts/{profileId}')
  public async unauthorizeProfileToAccessContext(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Body() data: { contextIds: string | string[]; digitalTwinId?: string }
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const contexts = await serviceInstance.unauthorizeProfileToAccessContext(
        profileId,
        data.contextIds,
        data.digitalTwinId
      );
      if (contexts) {
        this.setStatus(HTTP_CODES.OK);
        return _getNodeListInfo(contexts);
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: 'something went wrong please check your input' };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/unauthorize_profile_to_access_apis/{profileId}')
  public async unauthorizeProfileToAccessApis(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Body() data: { apiIds: string | string[] }
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const apis = await serviceInstance.unauthorizeProfileToAccessApis(
        profileId,
        data.apiIds
      );
      if (apis) {
        this.setStatus(HTTP_CODES.OK);
        return _getNodeListInfo(apis);
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: 'something went wrong please check your input' };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/profile_has_access_to_context/{profileId}/{contextId}')
  public async profileHasAccessToContext(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Path() contextId: string,
    @Query() digitalTwinId?: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const hasAccess = await serviceInstance.profileHasAccessToContext(
        profileId,
        contextId,
        digitalTwinId
      );
      this.setStatus(HTTP_CODES.OK);
      return hasAccess ? true : false;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/profile_has_access_to_api/{profileId}/{apiId}')
  public async profileHasAccessToApi(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Path() apiId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const hasAccess = await serviceInstance.profileHasAccessToApi(
        profileId,
        apiId
      );
      this.setStatus(HTTP_CODES.OK);
      return hasAccess ? true : false;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_authorized_contexts/{profileId}')
  public async getAuthorizedContexts(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Query() digitalTwinId?: string
  ) {
    try {
      const id = await getProfileId(req);
      const isAdmin =
        AdminProfileService.getInstance().adminNode.getId().get() === id;

      if (!isAdmin && profileId !== id)
        throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const contexts = await serviceInstance.getAuthorizedContexts(
        profileId,
        digitalTwinId
      );
      this.setStatus(HTTP_CODES.OK);
      return _getNodeListInfo(contexts);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_authorized_apis/{profileId}')
  public async getAuthorizedApis(
    @Request() req: express.Request,
    @Path() profileId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const contexts = await serviceInstance.getAuthorizedApis(profileId);
      this.setStatus(HTTP_CODES.OK);
      return _getNodeListInfo(contexts);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }
}

export default new AppProfileController();
