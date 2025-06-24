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
import { UserProfileService } from '../services';
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
import { AuthError } from '../security/AuthError';
import { checkIfItIsAdmin, getProfileId } from '../security/authentication';
import { AdminProfileService } from '../services/adminProfile.service';
import { searchById } from '../utils/findNodeBySearchKey';

const serviceInstance = UserProfileService.getInstance();

@Route('/api/v1/user_profile')
@Tags('user Profiles')
export class UserProfileController extends Controller {
  public constructor() {
    super();
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Post('/create_profile')
  public async createUserProfile(
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

      const profile = await serviceInstance.createUserProfile(data);
      this.setStatus(HTTP_CODES.CREATED);
      return await _formatProfile(profile);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_profile/{id}')
  public async getUserProfile(
    @Request() req: express.Request,
    @Path() id: string
  ): Promise<IProfileData | { message: string }> {
    try {
      const profileId = await getProfileId(req);
      const isAdmin =
        AdminProfileService.getInstance().adminNode.getId().get() === profileId;

      if (!isAdmin && profileId !== id)
        throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const data = await serviceInstance.getUserProfile(id);
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
  @Get('/get_profile')
  public async getUserProfileByToken(
    @Request() req: express.Request
  ): Promise<IProfileData | { message: string }> {
    try {
      const profileId = await getProfileId(req);
      const data = await serviceInstance.getUserProfile(profileId);
      if (data) {
        this.setStatus(HTTP_CODES.OK);
        const res = await _formatProfile(data);
        return res;
      }

      // this.setStatus(HTTP_CODES.NOT_FOUND)
      // return { message: `no profile found for ${id}` };
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_all_profile')
  public async getAllUserProfile(
    @Request() req: express.Request
  ): Promise<IProfileData[] | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const nodes = (await serviceInstance.getAllUserProfile()) || [];
      this.setStatus(HTTP_CODES.OK);
      return await Promise.all(nodes.map((el) => _formatProfile(el)));
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Put('/edit_profile/{id}')
  public async updateUserProfile(
    @Request() req: express.Request,
    @Path() id: string,
    @Body() data: IProfileAuthEdit
  ): Promise<IProfileData | { message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const node = await serviceInstance.updateUserProfile(id, data);
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
  public async deleteUserProfile(
    @Request() req: express.Request,
    @Path() id: string
  ): Promise<{ message: string }> {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      await serviceInstance.deleteUserProfile(id);
      this.setStatus(HTTP_CODES.OK);
      return { message: 'user profile deleted' };
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
  @Get('/get_authorized_apps/{profileId}')
  public async getAuthorizedApps(
    @Request() req: express.Request,
    @Path() profileId: string
  ) {
    try {
      const id = await getProfileId(req);
      const isAdmin =
        AdminProfileService.getInstance().adminNode.getId().get() === id;

      if (!isAdmin && profileId !== id)
        throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const contexts = await serviceInstance.getAuthorizedApps(profileId);
      this.setStatus(HTTP_CODES.OK);
      return _getNodeListInfo(contexts);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/get_authorized_admin_apps/{profileId}')
  public async getAuthorizedAdminApps(
    @Request() req: express.Request,
    @Path() profileId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const contexts = await serviceInstance.getAuthorizedAdminApps(profileId);
      this.setStatus(HTTP_CODES.OK);
      return _getNodeListInfo(contexts);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

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
  @Post('/authorize_profile_to_access_apps/{profileId}')
  public async authorizeProfileToAccessApps(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Body() data: { appIds: string | string[] }
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const apps = await serviceInstance.authorizeProfileToAccessApps(
        profileId,
        data.appIds
      );
      if (apps) {
        this.setStatus(HTTP_CODES.OK);
        return _getNodeListInfo(apps);
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
  @Post('/unauthorize_profile_to_access_apps/{profileId}')
  public async unauthorizeProfileToAccessApps(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Body() data: { appIds: string | string[] }
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const apps = await serviceInstance.unauthorizeProfileToAccessApps(
        profileId,
        data.appIds
      );
      if (apps) {
        this.setStatus(HTTP_CODES.OK);
        return _getNodeListInfo(apps);
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
  @Get('/profile_has_access_to_app/{profileId}/{appId}')
  public async profileHasAccessToApp(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Path() appId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const hasAccess = await serviceInstance.profileHasAccessToApp(
        searchById,
        profileId,
        appId
      );
      this.setStatus(HTTP_CODES.OK);
      return hasAccess ? true : false;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get(
    '/profile_has_access_to_sub_app/{profileId}/{appNameOrId}/{subAppNameOrId}'
  )
  public async profileHasAccessToSubApp(
    @Request() req: express.Request,
    @Path() profileId: string,
    @Path() appNameOrId: string,
    @Path() subAppNameOrId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const hasAccess = await serviceInstance.profileHasAccessToSubApp(
        searchById,
        profileId,
        appNameOrId,
        subAppNameOrId
      );
      this.setStatus(HTTP_CODES.OK);
      return hasAccess ? true : false;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }
}

export default new UserProfileController();
