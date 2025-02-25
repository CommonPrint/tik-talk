import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Chat, LastMessageRes } from "../interfaces/chats.interface";

export const chatActions = createActionGroup({
    source: 'chat',
    events: {
        'chats loaded': emptyProps(),
        'chats loaded success': props<{chats: LastMessageRes[]}>(),
        'chats loaded failure': props<{error: any}>(),

        'active chat loaded': props<{chatId: number}>(),
        'active chat loaded success': props<{activeChat: Chat}>(),
        'active chat loaded failure': props<{error: any}>()
    }
})