import { ChatWSMessage, ChatWSNewMessage, ChatWSUnreadMessage, ChatWSError } from "./chat-ws-message.interface";

export function isErrorMessage(message: ChatWSMessage): message is ChatWSError {
    return 'status' in message && message.status === 'error';
}

export function isUnreadMessage(message: ChatWSMessage): message is ChatWSUnreadMessage {
    return 'action' in message && message.action === 'unread'
}

export function isNewMessage(message: ChatWSMessage): message is ChatWSNewMessage {
    return 'action' in message && message.action === 'message'
}

