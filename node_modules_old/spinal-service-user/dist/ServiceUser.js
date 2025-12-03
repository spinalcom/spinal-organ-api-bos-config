"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Constants_1 = require("./Constants");
const Errors_1 = require("./Errors");
require("spinal-core-connectorjs_type");
class ServiceUser {
    constructor() {
        this.initialized = false;
    }
    createContext() {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(Constants_1.SERVICE_NAME, Constants_1.SERVICE_TYPE, undefined)
            .then((context) => {
            this.context = context;
            this.contextId = context.info.id.get();
        })
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
        });
    }
    init() {
        this.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(Constants_1.SERVICE_NAME);
        this.users = new Set();
        this.initialized = true;
        if (typeof this.context !== 'undefined') {
            this.contextId = this.context.info.id.get();
            spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(this.contextId, [Constants_1.RELATION_NAME])
                .then((children) => {
                for (let i = 0; i < children.length; i = i + 1) {
                    this.users.add(children[i].id);
                }
            })
                .catch((e) => {
                console.error(e);
            });
        }
        else {
            this.createContext()
                .catch((e) => {
                throw new Error(e);
            });
        }
    }
    createUser(url, user) {
        return this.findEmail(user.email)
            .then((exist) => {
            if (exist) {
                return Promise.resolve(Errors_1.USER_ALREADY_EXIST);
            }
            const userId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(user, undefined);
            user.id = userId;
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(this.contextId, userId, this.contextId, Constants_1.RELATION_NAME, Constants_1.RELATION_TYPE).then(() => {
                return Promise.resolve(user);
            });
        })
            .catch((e) => {
            return Promise.resolve(e);
        });
        // @ts-ignore
    }
    getUser(id, email, password) {
        if (typeof email === 'string' && typeof password === 'string')
            return this.findUserWithEmailPassword(email, password);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(this.contextId, [Constants_1.RELATION_NAME])
            .then((children) => {
            if (children.length < 0) {
                return Promise.reject(Errors_1.USER_BASE_EMPTY);
            }
            for (let i = 0; i < children.length; i = i + 1) {
                if (children[i].hasOwnProperty('id')
                    && children[i].id.get() === id) {
                    return Promise.resolve(children[i]);
                }
            }
            return Promise.resolve(Errors_1.USER_NOT_FOUND);
        }).catch(((e) => {
            console.error(e);
            return Promise.resolve(e);
        }));
    }
    addNode(userId, childId, relationName, relationType) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(userId, childId, relationName, relationType);
    }
    findEmail(email) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(this.contextId, [Constants_1.RELATION_NAME])
            .then((children) => {
            if (children.length < 0) {
                return Promise.resolve(false);
            }
            for (let i = 0; i < children.length; i = i + 1) {
                if (children[i].hasOwnProperty('email')
                    && children[i].email.get() === email) {
                    return Promise.resolve(true);
                }
            }
            return Promise.resolve(false);
        });
    }
    findUserWithEmailPassword(email, password) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(this.contextId, [Constants_1.RELATION_NAME])
            .then((children) => {
            if (children.length < 0) {
                return Promise.reject(Errors_1.USER_BASE_EMPTY);
            }
            for (let i = 0; i < children.length; i = i + 1) {
                if (children[i].hasOwnProperty('email')
                    && children[i].email.get() === email
                    && children[i].hasOwnProperty('password')
                    && children[i].password.get() === password) {
                    return Promise.resolve(children[i]);
                }
            }
            return Promise.resolve(Errors_1.USER_NOT_FOUND);
        }).catch(((e) => {
            console.error(e);
            return Promise.resolve(e);
        }));
    }
}
exports.ServiceUser = ServiceUser;
//# sourceMappingURL=ServiceUser.js.map