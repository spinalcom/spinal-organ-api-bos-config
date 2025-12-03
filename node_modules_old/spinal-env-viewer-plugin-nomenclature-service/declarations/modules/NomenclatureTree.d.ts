import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { IGroups } from "../interfaces/IGroups";
export declare class NomenclatureTree {
    profileNodeType: string;
    defaultContextName: string;
    constructor();
    /**
     * This method takes a context name as a parameter (not required),
     * If no name is passed it creates or returns the default context (NomenclatureConfiguration)
     * @param contextName - string - not required
     * @returns Promise<SpinalContext>
     */
    createOrGetContext(contextName?: string): Promise<SpinalContext<any>>;
    getDefaultContext(): Promise<SpinalContext<any>>;
    /**
     * This method returns a context (if contextName or id is passed) or all profil contexts
     * @param contextName - string - contextName not required
     * @returns Promise<SpinalContext | SpinalContext[]>
     */
    getContexts(contextName?: string, graph?: SpinalGraph<any>): Promise<SpinalContext<any>[] | SpinalContext<any>>;
    /**
     * This method updates a contextName, it takes as parameter two strings (contextId and context new Name)
     * @param contextId - string - the context id
     * @param newName  - string - new context name
     * @returns SpinalContext
     */
    updateContext(contextId: string, newName: string): SpinalContext<any>;
    /**
     * This method creates and links category to a profil context, it takes as parameters contextName, iconName (not required) and contextId (not required)
     * @param categoryName - string (required)
     * @param iconName - string (not required default value = settings)
     * @param contextId - string (not required default value = default contextId)
     * @returns Promise<SpinalNode>
     */
    createCategory(categoryName: string, iconName?: string, contextId?: string): Promise<SpinalNode<any>>;
    /**
     * This method returns a category of context (if category name or id is passed) or all categories of context
     * @param contextId - contextId
     * @param categoryName  - category name or id (not required)
     * @returns
     */
    getCategories(categoryName?: string, contextId?: string): Promise<SpinalNode<any> | SpinalNode<any>[]>;
    /**
     * This method updates a category, it takes as parameter two strings (categoryId and category new Values)
     * @param categoryId - string - the category Id
     * @param newValues - {name?: string; icon?: string } - object of new values (name and icon)
     * @returns
     */
    updateCategory(categoryId: string, newValues: {
        name?: string;
        icon?: string;
    }): SpinalNode<any> | void;
    /**
     * It takes as parameters a contextId, categoryId, groupName et groupColor in hexadecimal (not required) and returns a spinalNode of group
     * @param contextId - contextId
     * @param categoryId - categoryId
     * @param groupName - group name
     * @param groupColor - group color (not required)
     * @returns
     */
    createGroup(contextId: string, categoryId: string, groupName: string, groupColor?: string): Promise<SpinalNode<any>>;
    /**
     * This method updates a group, it takes as parameter two strings (groupId and new values)
     * @param groupId - string - the group Id
     * @param newValues - {name?: string; color?: string } - object of new values (name and color)
     * @returns
     */
    updateGroup(groupId: string, newValues: {
        name?: string;
        color?: string;
    }): SpinalNode<any> | void;
    /**
     * This methods takes as parameters a contextId and category id (not required), it returns all groups in category (or categories if not category id is set) in context
     * @param contextId - context id
     * @param categoryId - category id (not required)
     * @returns
     */
    getGroups(contextId: string, categoryId?: string): Promise<IGroups[]>;
}
