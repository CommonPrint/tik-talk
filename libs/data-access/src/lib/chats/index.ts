import { ChatsService } from "./services/chats.service";
import { isErrorMessage } from "./interfaces/type-guards";

export * from './interfaces/chats.interface';
export * from './store';

export {
    ChatsService,
    isErrorMessage
};