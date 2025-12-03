export interface IAuthResponse {
    userInfo: IUserInfo;
    createdToken: number;
    expieredToken: number;
    userId: string;
    token: string;
    profile: IProfile;
}
export interface IUserInfo {
    name: string;
    userName: string;
    type: string;
    userType: string;
    id: string;
    directModificationDate: number;
}
export interface IProfile {
    profileId: string;
}
