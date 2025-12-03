"use strict";
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
exports.NomenclatureTree = void 0;
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
class NomenclatureTree {
    constructor() {
        this.profileNodeType = "AttributeConfiguration";
        this.defaultContextName = "NomenclatureConfiguration";
    }
    /**
     * This method takes a context name as a parameter (not required),
     * If no name is passed it creates or returns the default context (NomenclatureConfiguration)
     * @param contextName - string - not required
     * @returns Promise<SpinalContext>
     */
    createOrGetContext(contextName) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDefault = false;
            if (!contextName || (contextName === null || contextName === void 0 ? void 0 : contextName.trim().length) === 0) {
                const defaultContext = yield this.getDefaultContext();
                if (defaultContext)
                    return defaultContext;
                isDefault = true;
                contextName = this.defaultContextName;
            }
            ;
            const context = yield spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.createGroupContext(contextName.trim(), this.profileNodeType);
            if (!isDefault)
                return context;
            if (context.info.isDefault)
                context.info.isDefault.set(isDefault);
            else
                context.info.add_attr({ isDefault: true });
            return context;
        });
    }
    getDefaultContext() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getContexts();
            const found = contexts.find(el => typeof el.info.isDefault !== "undefined");
            if (found)
                return found;
        });
    }
    /**
     * This method returns a context (if contextName or id is passed) or all profil contexts
     * @param contextName - string - contextName not required
     * @returns Promise<SpinalContext | SpinalContext[]>
     */
    getContexts(contextName, graph) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroupContexts(this.profileNodeType, graph);
            if (contextName && contextName.trim().length > 0) {
                const context = contexts.find(el => el.name === contextName || el.id === contextName);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(context === null || context === void 0 ? void 0 : context.id);
            }
            return contexts.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(el === null || el === void 0 ? void 0 : el.id));
        });
    }
    /**
     * This method updates a contextName, it takes as parameter two strings (contextId and context new Name)
     * @param contextId - string - the context id
     * @param newName  - string - new context name
     * @returns SpinalContext
     */
    updateContext(contextId, newName) {
        const spinalContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        if (!spinalContext || !(spinalContext instanceof spinal_env_viewer_graph_service_1.SpinalContext) || spinalContext.getType().get() !== `${this.profileNodeType}GroupContext`)
            throw new Error(`${contextId} must be an id of profil SpinalContext`);
        if (typeof newName !== "string" || newName.trim().length === 0)
            throw new Error("newName is required and must be a string at less 1 character");
        spinalContext.info.name.set(newName.trim());
        return spinalContext;
    }
    /**
     * This method creates and links category to a profil context, it takes as parameters contextName, iconName (not required) and contextId (not required)
     * @param categoryName - string (required)
     * @param iconName - string (not required default value = settings)
     * @param contextId - string (not required default value = default contextId)
     * @returns Promise<SpinalNode>
     */
    createCategory(categoryName, iconName = "settings", contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contextId) {
                const context = yield this.getDefaultContext();
                contextId = context.getId().get();
            }
            return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.addCategory(contextId, categoryName.trim(), iconName.trim());
        });
    }
    /**
     * This method returns a category of context (if category name or id is passed) or all categories of context
     * @param contextId - contextId
     * @param categoryName  - category name or id (not required)
     * @returns
     */
    getCategories(categoryName, contextId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof contextId === "undefined") {
                const context = yield this.getDefaultContext();
                contextId = context.getId().get();
            }
            const categories = yield spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getCategories(contextId);
            if (categoryName && categoryName.trim().length > 0) {
                const category = categories.find(el => el.name.get() === categoryName || el.id.get() === categoryName);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode((_a = category === null || category === void 0 ? void 0 : category.id) === null || _a === void 0 ? void 0 : _a.get());
            }
            return categories.map(el => { var _a; return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode((_a = el === null || el === void 0 ? void 0 : el.id) === null || _a === void 0 ? void 0 : _a.get()); });
        });
    }
    /**
     * This method updates a category, it takes as parameter two strings (categoryId and category new Values)
     * @param categoryId - string - the category Id
     * @param newValues - {name?: string; icon?: string } - object of new values (name and icon)
     * @returns
     */
    updateCategory(categoryId, newValues) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(categoryId);
        const { name, icon } = newValues;
        if (node && (name || icon)) {
            if (typeof name === "string" && name.trim().length > 0)
                node.info.name.set(name.trim());
            if (typeof icon === "string" && icon.trim().length > 0) {
                if (node.info.icon)
                    node.info.icon.set(icon.trim());
                else
                    node.info.add_attr({ icon });
            }
            return node;
        }
    }
    /**
     * It takes as parameters a contextId, categoryId, groupName et groupColor in hexadecimal (not required) and returns a spinalNode of group
     * @param contextId - contextId
     * @param categoryId - categoryId
     * @param groupName - group name
     * @param groupColor - group color (not required)
     * @returns
     */
    createGroup(contextId, categoryId, groupName, groupColor = "#fff000") {
        if (typeof groupName !== "string" || groupName.trim().length === 0)
            throw new Error("group name must be a string less than 1 character");
        if (!groupColor || groupColor.trim().length === 0)
            groupColor = "#fff000";
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.addGroup(contextId, categoryId, groupName, groupColor);
    }
    /**
     * This method updates a group, it takes as parameter two strings (groupId and new values)
     * @param groupId - string - the group Id
     * @param newValues - {name?: string; color?: string } - object of new values (name and color)
     * @returns
     */
    updateGroup(groupId, newValues) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(groupId);
        const { name, color } = newValues;
        if (node && (name || color)) {
            if (typeof name === "string" && name.trim().length > 0)
                node.info.name.set(name.trim());
            if (typeof color === "string" && color.trim().length > 0) {
                if (node.info.color)
                    node.info.color.set(color.trim());
                else
                    node.info.add_attr({ color });
            }
            return node;
        }
    }
    /**
     * This methods takes as parameters a contextId and category id (not required), it returns all groups in category (or categories if not category id is set) in context
     * @param contextId - context id
     * @param categoryId - category id (not required)
     * @returns
     */
    getGroups(contextId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = yield this.getCategories(categoryId, contextId);
            if (categories) {
                if (!Array.isArray(categories))
                    categories = [categories];
                const promises = categories.map((category) => __awaiter(this, void 0, void 0, function* () {
                    const info = category.info.get();
                    info.groups = yield spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroups(category.getId().get());
                    return info;
                }));
                return Promise.all(promises).then((cats) => {
                    return cats.map(category => {
                        category.groups = category.groups.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(el.id.get()));
                        return category;
                    });
                });
            }
            return [];
        });
    }
}
exports.NomenclatureTree = NomenclatureTree;
//# sourceMappingURL=NomenclatureTree.js.map