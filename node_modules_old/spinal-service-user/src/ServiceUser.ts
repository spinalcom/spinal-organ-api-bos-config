/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  RELATION_NAME,
  RELATION_TYPE,
  SERVICE_NAME,
  SERVICE_TYPE,
} from './Constants';
import {
  CANNOT_CREATE_CONTEXT_INTERNAL_ERROR,
  USER_ALREADY_EXIST,
  USER_BASE_EMPTY,
  USER_NOT_FOUND,
} from './Errors';
import { UserInterface } from 'spinal-models-user/declarations/SpinalUser';
import 'spinal-core-connectorjs_type';

export class ServiceUser {
  public contextId: string;
  private context: any;
  public initialized = false;
  private users: Set<string>;

  private createContext(): Promise<any | Error> {
    return SpinalGraphService.addContext(SERVICE_NAME, SERVICE_TYPE, undefined)
      .then((context) => {
        this.context = context;
        this.contextId = context.info.id.get();
      })
      .catch((e) => {
        console.error(e);
        return Promise.reject(Error(CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
      });
  }

  public init() {
    this.context = SpinalGraphService.getContext(SERVICE_NAME);
    this.users = new Set();
    this.initialized = true;
    if (typeof this.context !== 'undefined') {
      this.contextId = this.context.info.id.get();
      SpinalGraphService.getChildren(this.contextId, [RELATION_NAME])
        .then((children) => {
          for (let i = 0; i < children.length; i = i + 1) {

            this.users.add(children[i].id);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      this.createContext()
        .catch((e) => {
          throw new Error(e);
        });
    }
  }

  public createUser(url: any, user: UserInterface): Promise<UserInterface | string> {

    return this.findEmail(user.email)
      .then((exist: boolean): any => {
        if (exist) {
          return Promise.resolve(USER_ALREADY_EXIST);
        }
        const userId = SpinalGraphService.createNode(user, undefined);
        user.id = userId;

        return SpinalGraphService.addChildInContext(
          this.contextId,
          userId,
          this.contextId,
          RELATION_NAME,
          RELATION_TYPE,
        ).then(() => {
          return Promise.resolve(user);
        });
      })
      .catch(
        (e) => {
          return Promise.resolve(e);
        },
      );
    // @ts-ignore

  }

  public getUser(id: string): Promise<UserInterface>;
  public getUser(url: string, email: string, password: string): Promise<UserInterface>;
  public getUser(id: string, email?: string, password?: string): Promise<UserInterface> {
    if (typeof email === 'string' && typeof password === 'string')
      return this.findUserWithEmailPassword(email, password);
    return SpinalGraphService.getChildren(this.contextId, [RELATION_NAME])
      .then((children: any[]) => {
        if (children.length < 0) {
          return Promise.reject(USER_BASE_EMPTY);
        }

        for (let i = 0; i < children.length; i = i + 1) {
          if (children[i].hasOwnProperty('id')
            && children[i].id.get() === id
          ) {

            return Promise.resolve(children[i]);
          }
        }
        return Promise.resolve(USER_NOT_FOUND);
      }).catch(((e) => {
        console.error(e);
        return Promise.resolve(e);
      }));
  }

  public addNode(userId: string, childId: string, relationName: string, relationType: string) {
    return SpinalGraphService.addChild(userId, childId, relationName, relationType);
  }

  private findEmail(email: string): Promise<boolean> {
    return SpinalGraphService.getChildren(this.contextId, [RELATION_NAME])
      .then((children) => {
        if (children.length < 0) {
          return Promise.resolve(false);
        }
        for (let i = 0; i < children.length; i = i + 1) {
          if (children[i].hasOwnProperty('email')
            && children[i].email.get() === email
          ) {
            return Promise.resolve(true);
          }
        }
        return Promise.resolve(false);
      });
  }

  private findUserWithEmailPassword(email: string, password: string): Promise<UserInterface> {
    return SpinalGraphService.getChildren(this.contextId, [RELATION_NAME])
      .then((children: any[]) => {
        if (children.length < 0) {
          return Promise.reject(USER_BASE_EMPTY);
        }

        for (let i = 0; i < children.length; i = i + 1) {
          if (children[i].hasOwnProperty('email')
            && children[i].email.get() === email
            && children[i].hasOwnProperty('password')
            && children[i].password.get() === password
          ) {

            return Promise.resolve(children[i]);
          }
        }
        return Promise.resolve(USER_NOT_FOUND);
      }).catch(((e) => {
        console.error(e);
        return Promise.resolve(e);
      }))
      ;
  }

}
