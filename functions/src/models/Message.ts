import { Timestamp } from "firebase-admin/firestore";

export interface Message {
    id?: string,
    roomId: string,     // user-user
    sender: string,
    content: string,
    createdAt: Timestamp,
    isRead: boolean
}