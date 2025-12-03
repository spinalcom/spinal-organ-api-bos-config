export declare class SpinalUserManager {
    static get_user_id(options: string | URL, username: string, password: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static get_admin_id(options: string | URL, adminName: string, password: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static new_account(options: string | URL, username: string, password: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static change_password(options: string | URL, user_id: string | number, password: string, newPassword: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static delete_account(options: string | URL, userId: string | number, password: string, userNameToDelete: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static change_password_by_admin(options: string | URL, targetUsername: string, targetPassword: string, adminUserId: string | number, adminPassword: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static delete_account_by_admin(options: string | URL, targetUsername: string, adminUserId: string | number, adminPassword: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static change_account_rights_by_admin(options: string | URL, targetUsername: string, targetAcountRight: string | number, adminUserId: string | number, adminPassword: string, success_callback?: (response: string) => void, error_callback?: () => void): Promise<string>;
    static _if_error(error_callback: (e: Error) => void, fun: string, response: Error): void;
}
