import { UserInterface } from 'spinal-models-user/declarations/SpinalUser';
import 'spinal-core-connectorjs_type';
export declare class ServiceUser {
    contextId: string;
    private context;
    initialized: boolean;
    private users;
    private createContext;
    init(): void;
    createUser(url: any, user: UserInterface): Promise<UserInterface | string>;
    getUser(id: string): Promise<UserInterface>;
    getUser(url: string, email: string, password: string): Promise<UserInterface>;
    addNode(userId: string, childId: string, relationName: string, relationType: string): Promise<boolean>;
    private findEmail;
    private findUserWithEmailPassword;
}
