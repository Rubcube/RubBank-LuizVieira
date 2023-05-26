import { pagination } from "./GlobalDTO"

export type messageOut = {
    message: string,
    direction: string,
    created_at: Date
}

export interface messages {
    pagination: pagination
    messages: Array<messageOut>
}