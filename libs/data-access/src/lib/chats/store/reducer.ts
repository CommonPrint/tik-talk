import { createFeature, createReducer, on } from "@ngrx/store";
import { Chat, LastMessageRes } from "../interfaces/chats.interface";
import { chatActions } from "./actions";

export interface ChatState {
    chats: LastMessageRes[];
    activeChat: Chat | null;
    error: any;
}

export const initialChatsState: ChatState = {
    chats: [],
    activeChat: null,
    error: null,
};

export const chatFeature = createFeature({
    name: 'chatFeature',
    reducer: createReducer(
        initialChatsState,
        on(chatActions.chatsLoadedSuccess, (state, {chats}) => {
            return {
                ...state,
                chats,
                error: null
            }
        }),
        on(chatActions.chatsLoadedFailure, (state, {error}) => {
            return {
                ...state,
                error,
            }
        }),
        on(chatActions.activeChatLoadedSuccess, (state, {activeChat}) => {
            return {
                ...state,
                activeChat,
                error: null
            }
        }),
        on(chatActions.activeChatLoadedFailure, (state, {error}) => {
            return {
                ...state,
                error,
            }
        }),
    ),
})