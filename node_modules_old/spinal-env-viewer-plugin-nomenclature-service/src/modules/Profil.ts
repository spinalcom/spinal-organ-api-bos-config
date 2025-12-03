import { Model, Ptr } from 'spinal-core-connectorjs_type';
import { SpinalGraphService, SpinalNode, SpinalNodeRef } from "spinal-env-viewer-graph-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { IAttribute } from '../interfaces/IAttribute';
import { IProfile } from '../interfaces/IProfile';


export class NomenclatureProfil {
   public profileNodeType: string = "AttributeConfiguration";

   constructor() {}

   /**
    * This methods takes as params th context id, group id, profile name and list of categories. Creates and return the profile SpinalNode.
    * @param contextId - ContextId - String
    * @param groupId - GroupId - String
    * @param profileName - profileName
    * @param categories - Array of category : {show: boolean; name : string}
    * @returns 
    */
   public async createProfile(contextId: string, groupId: string, profileName: string, categories: Array<IAttribute> = []) : Promise<SpinalNode<any>> {
      
      const id = SpinalGraphService.createNode({name : profileName, type : this.profileNodeType}, new Model({
         name : profileName,
         categories
      }));

      await groupManagerService.linkElementToGroup(contextId,groupId,id);

      return SpinalGraphService.getRealNode(id);

   }

   /**
    * This methods updates the profile cateregories return false
    * @param profileId - string profile node id
    * @param profilElement - profil new Element IProfile 
    * @returns 
    */
   public updateProfile(profileId: string, newValues : {name?: string; categories? : Array<IAttribute>}) : Promise<boolean> {
      let realNode = SpinalGraphService.getRealNode(profileId);
   
      if (realNode) {
         if (newValues.name && newValues.name.trim().length > 0) {
            realNode.info.name.set(newValues.name);
         }

         if(newValues.categories) {
            return realNode.getElement().then((element) => {
               element.set(newValues.categories);
               return true;
            }).catch(err => false)
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
   public async findOrGetProfiles(contextId: string,startId?: string ,profileId?: string): Promise<IProfile[]| IProfile> {
      if(!startId || startId.length === 0) startId = contextId;

      const profiles = await SpinalGraphService.findInContextByType(startId,contextId,this.profileNodeType);
      if(profileId) {
         const profile = profiles.filter(el => el.getId().get() === profileId);
         if(profile) {
            return this._getProfileElement(profile);
         }

         return
      }

      const promises = profiles.map(el => this._getProfileElement(el));

      return Promise.all(promises);
   }



   /**
    * This methods takes as parameters a contextId and profileId and set the profile as a current profile in the contexte
    * @param contextId - string
    * @param profileId - string
    * @returns 
    */
   public setAsCurrentProfile(contextId: string, profileId: string): boolean {
      const profileNode = SpinalGraphService.getRealNode(profileId);
      const context = SpinalGraphService.getRealNode(contextId);

      if(profileNode && context) {
         if(context.info.currentConfiguration) {
            context.info.rem_attr("currentConfiguration");
         }

         context.info.add_attr({
            currentConfiguration: new Ptr(profileNode)
         })

         return true
      }

      return false;
   }


   /**
    * This methods takes as parameter a contextId and returns the current profile in the Context
    * @param contextId - string
    * @returns 
    */
   public getCurrentProfile(contextId : string) : Promise<{name: string; id: string; type: string;}> | void {
      const context = SpinalGraphService.getRealNode(contextId);
      const confPtr = context.info.currentConfiguration;
      if(typeof confPtr !== "undefined") {
         return new Promise((resolve, reject) => {
            confPtr.load((realNode) => {
               (<any>SpinalGraphService)._addNode(realNode);
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
   public deleteCurrentAsCurrentProfile(contextId: string) : boolean {
      const context = SpinalGraphService.getRealNode(contextId);
      if(context && context.info.currentConfiguration) {
         context.info.rem_attr("currentConfiguration");
         return true;
      }

      return false;
   }
   

   public async _getProfileElement(profileInfo: SpinalNodeRef) {
      // (<any>SpinalGraphService)._addNode(profileNode);
      const realNode = SpinalGraphService.getRealNode(profileInfo.id.get());
      const element = await realNode.getElement();
      const el = element.get();
      el.id = realNode.getId().get();

      return el;
   }

}