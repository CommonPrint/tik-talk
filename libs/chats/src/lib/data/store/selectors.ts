import { createSelector } from "@ngrx/store";
import { chatFeature } from "./reducer";

export const selectChats = createSelector(
    chatFeature.selectChats,
    (chats) => chats
)

export const selectActiveChat = createSelector(
    chatFeature.selectActiveChat,
    (activeChat) => activeChat
)