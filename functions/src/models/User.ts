import { MyLocation } from "../utils/constants";

export interface User {
    id?: string,
    uid: string,
    email: string,
    displayName: string,
    authProvider: string,
    phone: string,
    userRole: string,       // admin, employee, user
    verified: boolean,
    locations: MyLocation[],
    profileImage?: string,
    messagingToken?: string
}