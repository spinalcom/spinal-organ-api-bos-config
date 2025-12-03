"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NomenclatureProfil = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
class NomenclatureProfil {
    constructor() {
        this.profileNodeType = "AttributeConfiguration";
    }
    /**
     * This methods takes as params th context id, group id, profile name and list of categories. Creates and return the profile SpinalNode.
     * @param contextId - ContextId - String
     * @param groupId - GroupId - String
     * @param profileName - profileName
     * @param categories - Array of category : {show: boolean; name : string}
     * @returns
     */
    createProfile(contextId, groupId, profileName, categories = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: profileName, type: this.profileNodeType }, new spinal_core_connectorjs_type_1.Model({
                name: profileName,
                categories
            }));
            yield spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.linkElementToGroup(contextId, groupId, id);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(id);
        });
    }
    /**
     * This methods updates the profile cateregories return false
     * @param profileId - string profile node id
     * @param profilElement - profil new Element IProfile
     * @returns
     */
    updateProfile(profileId, newValues) {
        let realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
        if (realNode) {
            if (newValues.name && newValues.name.trim().length > 0) {
                realNode.info.name.set(newValues.name);
            }
            if (newValues.categories) {
                return realNode.getElement().then((element) => {
                    element.set(newValues.categories);
                    return true;
                }).catch(err => false);
            }
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
    /**
     * This methods finds a profile (passed in parameter) or return all profiles in the contexte from the started node
     * @param contextId - string - Context id
     * @param startId  - string - start node id
     * @param profileId - string - not required
     * @returns
     */
    findOrGetProfiles(contextId, startId, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!startId || startId.length === 0)
                startId = contextId;
            const profiles = yield spinal_env_viewer_graph_service_1.SpinalGraphService.findInContextByType(startId, contextId, this.profileNodeType);
            if (profileId) {
                const profile = profiles.filter(el => el.getId().get() === profileId);
                if (profile) {
                    return this._getProfileElement(profile);
                }
                return;
            }
            const promises = profiles.map(el => this._getProfileElement(el));
            return Promise.all(promises);
        });
    }
    /**
     * This methods takes as parameters a contextId and profileId and set the profile as a current profile in the contexte
     * @param contextId - string
     * @param profileId - string
     * @returns
     */
    setAsCurrentProfile(contextId, profileId) {
        const profileNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        if (profileNode && context) {
            if (context.info.currentConfiguration) {
                context.info.rem_attr("currentConfiguration");
            }
            context.info.add_attr({
                currentConfiguration: new spinal_core_connectorjs_type_1.Ptr(profileNode)
            });
            return true;
        }
        return false;
    }
    /**
     * This methods takes as parameter a contextId and returns the current profile in the Context
     * @param contextId - string
     * @returns
     */
    getCurrentProfile(contextId) {
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        const confPtr = context.info.currentConfiguration;
        if (typeof confPtr !== "undefined") {
            return new Promise((resolve, reject) => {
                confPtr.load((realNode) => {
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(realNode);
                    return realNode.getElement().then((el) => {
                        let element = el.get();
                        element.id = realNode.info.id.get();
                        resolve(element);
                    });
                });
            });
        }
    }
    /**
     * This methods takes as parameters a contextId and remove the current profile
     * @param contextId - string
     * @returns
     */
    deleteCurrentAsCurrentProfile(contextId) {
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        if (context && context.info.currentConfiguration) {
            context.info.rem_attr("currentConfiguration");
            return true;
        }
        return false;
    }
    _getProfileElement(profileInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            // (<any>SpinalGraphService)._addNode(profileNode);
            const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileInfo.id.get());
            const element = yield realNode.getElement();
            const el = element.get();
            el.id = realNode.getId().get();
            return el;
        });
    }
}
exports.NomenclatureProfil = NomenclatureProfil;
//# sourceMappingURL=Profil.js.map