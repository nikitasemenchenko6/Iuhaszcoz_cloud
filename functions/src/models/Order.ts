import { Timestamp } from "firebase-admin/firestore"
import { MyLocation } from "../utils/constants"

export interface Order {
    id?: string,
    location: MyLocation,
    addressInfo: string,
    bookingTime: {
        startTime: Timestamp,
        endTime: Timestamp
    },
    uid: string,
    state: number       // 0: pending, 1: rejected, 2: accepted, 3: finished
    assigned: string[],
    additionalInfo: string,
    acceptedAt: Timestamp | null,
    finishedAt: Timestamp | null,
    estimatedTime: number
}