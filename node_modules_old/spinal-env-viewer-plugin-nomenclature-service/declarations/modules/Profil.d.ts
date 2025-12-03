import { SpinalNode, SpinalNodeRef } from "spinal-env-viewer-graph-service";
import { IAttribute } from '../interfaces/IAttribute';
import { IProfile } from '../interfaces/IProfile';
export declare class NomenclatureProfil {
    profileNodeType: string;
    constructor();
    /**
     * This methods takes as params th context id, group id, profile name and list of categories. Creates and return the profile SpinalNode.
     * @param contextId - ContextId - String
     * @param groupId - GroupId - String
     * @param profileName - profileName
     * @param categories - Array of category : {show: boolean; name : string}
     * @returns
     */
    createProfile(contextId: string, groupId: string, profileName: string, categories?: Array<IAttribute>): Promise<SpinalNode<any>>;
    /**
     * This methods updates the profile cateregories return false
     * @param profileId - string profile node id
     * @param profilElement - profil new Element IProfile
     * @returns
     */
    updateProfile(profileId: string, newValues: {
        name?: string;
        categories?: Array<IAttribute>;
    }): Promise<boolean>;
    /**
     * This methods finds a profile (passed in parameter) or return all profiles in the contexte from the started node
     * @param contextId - string - Context id
     * @param startId  - string - start node id
     * @param profileId - string - not required
     * @returns
     */
    findOrGetProfiles(contextId: string, startId?: string, profileId?: string): Promise<IProfile[] | IProfile>;
    /**
     * This methods takes as parameters a contextId and profileId and set the profile as a current profile in the contexte
     * @param contextId - string
     * @param profileId - string
     * @returns
     */
    setAsCurrentProfile(contextId: string, profileId: string): boolean;
    /**
     * This methods takes as parameter a contextId and returns the current profile in the Context
     * @param contextId - string
     * @returns
     */
    getCurrentProfile(contextId: string): Promise<{
        name: string;
        id: string;
        type: string;
    }> | void;
    /**
     * This methods takes as parameters a contextId and remove the current profile
     * @param contextId - string
     * @returns
     */
    deleteCurrentAsCurrentProfile(contextId: string): boolean;
    _getProfileElement(profileInfo: SpinalNodeRef): Promise<any>;
}
