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

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { IGroups } from "../interfaces/IGroups";

export class NomenclatureTree {

   public profileNodeType: string = "AttributeConfiguration";
   public defaultContextName: string = "NomenclatureConfiguration";

   public constructor() { }

   /**
    * This method takes a context name as a parameter (not required),
    * If no name is passed it creates or returns the default context (NomenclatureConfiguration)
    * @param contextName - string - not required
    * @returns Promise<SpinalContext>
    */
   public async createOrGetContext(contextName?: string): Promise<SpinalContext<any>> {
      let isDefault = false;
      if (!contextName || contextName?.trim().length === 0) {
         const defaultContext = await this.getDefaultContext();
         if (defaultContext) return defaultContext;

         isDefault = true;
         contextName = this.defaultContextName
      };

      const context = await groupManagerService.createGroupContext(contextName.trim(), this.profileNodeType);
      if (!isDefault) return context;

      if (context.info.isDefault) context.info.isDefault.set(isDefault);
      else context.info.add_attr({ isDefault: true });

      return context;
   }


   public async getDefaultContext(): Promise<SpinalContext<any>> {
      const contexts = await this.getContexts();
      const found = (<any>contexts).find(el => typeof (<any>el).info.isDefault !== "undefined");
      if (found) return found;

   }


   /**
    * This method returns a context (if contextName or id is passed) or all profil contexts
    * @param contextName - string - contextName not required
    * @returns Promise<SpinalContext | SpinalContext[]>
    */
   public async getContexts(contextName?: string, graph?: SpinalGraph<any>): Promise<SpinalContext<any>[] | SpinalContext<any>> {
      const contexts = await groupManagerService.getGroupContexts(this.profileNodeType, graph);
      if (contextName && contextName.trim().length > 0) {
         const context = contexts.find(el => el.name === contextName || el.id === contextName);
         return SpinalGraphService.getRealNode(context?.id);
      }

      return contexts.map(el => SpinalGraphService.getRealNode(el?.id));
   }

   /**
    * This method updates a contextName, it takes as parameter two strings (contextId and context new Name)
    * @param contextId - string - the context id 
    * @param newName  - string - new context name
    * @returns SpinalContext
    */
   public updateContext(contextId: string, newName: string): SpinalContext<any> {
      const spinalContext = SpinalGraphService.getRealNode(contextId);
      if (!spinalContext || !(spinalContext instanceof SpinalContext) || spinalContext.getType().get() !== `${this.profileNodeType}GroupContext`) throw new Error(`${contextId} must be an id of profil SpinalContext`);
      if (typeof newName !== "string" || newName.trim().length === 0) throw new Error("newName is required and must be a string at less 1 character");

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
   public async createCategory(categoryName: string, iconName: string = "settings", contextId?: string): Promise<SpinalNode<any>> {
      if (!contextId) {
         const context = await this.getDefaultContext();
         contextId = context.getId().get();
      }

      return groupManagerService.addCategory(contextId, categoryName.trim(), iconName.trim());
   }


   /**
    * This method returns a category of context (if category name or id is passed) or all categories of context
    * @param contextId - contextId
    * @param categoryName  - category name or id (not required)
    * @returns 
    */
   public async getCategories(categoryName?: string, contextId?: string): Promise<SpinalNode<any> | SpinalNode<any>[]> {
      if (typeof contextId === "undefined") {
         const context = await this.getDefaultContext()
         contextId = context.getId().get();
      }

      const categories = await groupManagerService.getCategories(contextId);

      if (categoryName && categoryName.trim().length > 0) {
         const category = categories.find(el => el.name.get() === categoryName || el.id.get() === categoryName);
         return SpinalGraphService.getRealNode(category?.id?.get());
      }

      return categories.map(el => SpinalGraphService.getRealNode(el?.id?.get()));
   }


   /**
    * This method updates a category, it takes as parameter two strings (categoryId and category new Values)
    * @param categoryId - string - the category Id
    * @param newValues - {name?: string; icon?: string } - object of new values (name and icon)
    * @returns 
    */
   public updateCategory(categoryId: string, newValues: { name?: string; icon?: string }): SpinalNode<any> | void {
      const node = SpinalGraphService.getRealNode(categoryId);
      const { name, icon } = newValues;
      if (node && (name || icon)) {
         if (typeof name === "string" && name.trim().length > 0) node.info.name.set(name.trim());
         if (typeof icon === "string" && icon.trim().length > 0) {
            if (node.info.icon) node.info.icon.set(icon.trim());
            else node.info.add_attr({ icon });
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
   public createGroup(contextId: string, categoryId: string, groupName: string, groupColor: string = "#fff000"): Promise<SpinalNode<any>> {
      if (typeof groupName !== "string" || groupName.trim().length === 0) throw new Error("group name must be a string less than 1 character");
      if (!groupColor || groupColor.trim().length === 0) groupColor = "#fff000";

      return groupManagerService.addGroup(contextId, categoryId, groupName, groupColor);
   }


   /**
    * This method updates a group, it takes as parameter two strings (groupId and new values)
    * @param groupId - string - the group Id
    * @param newValues - {name?: string; color?: string } - object of new values (name and color)
    * @returns 
    */
   public updateGroup(groupId: string, newValues: { name?: string; color?: string }): SpinalNode<any> | void {
      const node = SpinalGraphService.getRealNode(groupId);
      const { name, color } = newValues;
      if (node && (name || color)) {
         if (typeof name === "string" && name.trim().length > 0) node.info.name.set(name.trim());
         if (typeof color === "string" && color.trim().length > 0) {
            if (node.info.color) node.info.color.set(color.trim());
            else node.info.add_attr({ color });
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
   public async getGroups(contextId: string, categoryId?: string): Promise<IGroups[]> {
      let categories = await this.getCategories(categoryId, contextId);
      if (categories) {
         if (!Array.isArray(categories)) categories = [categories];
         const promises = categories.map(async category => {
            const info = category.info.get();
            info.groups = await groupManagerService.getGroups(category.getId().get());
            return info;
         })

         return Promise.all(promises).then((cats) => {
            return cats.map(category => {
               category.groups = category.groups.map(el => SpinalGraphService.getRealNode(el.id.get()));
               return category
            })
         })
      }

      return []
   }

}