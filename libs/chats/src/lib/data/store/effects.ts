import { inject, Injectable } from "@angular/core";
import { ChatsService } from "../services/chats.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { chatActions } from "./actions";

@Injectable({
    providedIn: 'root' 
})
export class ChatEffects {

    chatService = inject(ChatsService);
    actions$ = inject(Actions);

    chats = createEffect(() => 
        this.actions$.pipe(
            ofType(chatActions.chatsLoaded),
            switchMap(() => 
                this.chatService.getMyChats().pipe(
                    map(chats => {
                        return chatActions.chatsLoadedSuccess({chats})
                    }),
                    catchError((error) => of(chatActions.chatsLoadedFailure({error})))
                )
            )
        )
    );


    activeChat = createEffect(() => 
        this.actions$.pipe(
            ofType(chatActions.activeChatLoaded),
            switchMap(({chatId}) => 
                this.chatService.getChatById(chatId).pipe(
                    map(activeChat => {
                        return chatActions.activeChatLoadedSuccess({activeChat})
                    }),
                    catchError((error) => of(chatActions.chatsLoadedFailure({error})))
                )
            )
        )
    )

}