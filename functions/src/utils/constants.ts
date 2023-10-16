import { User } from "../models/User";

export interface MyLocation {
    name: string,
    geometry: {
        lat: string,
        lng: string,
        address: string
    },
    info: {
        identification_details: string,
        unique_registration: string,
        no_registration: string,
        euid: string
    }
}

export interface Geometry {
    lat: string,
    lng: string,
    address: string
};

export interface UserMap {
    uid: string,
    data: User
}