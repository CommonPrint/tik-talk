import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {webSocket} from 'rxjs/webSocket';
import { ChatWSMessage } from "../interfaces/chat-ws-message.interface";
import { ChatConnectionWSParams, ChatWsService } from "../interfaces/chat-ws-service.interface";
import { finalize, Observable, tap } from 'rxjs';
import { AuthService } from '@tt/auth';
import { inject } from '@angular/core';

export class ChatWSRxjsService implements ChatWsService {
    
    #authService = inject(AuthService);

    #socket: WebSocketSubject<ChatWSMessage> | null = null

    connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
        
        if(!this.#socket) {
            this.#socket = webSocket({
                url: params.url,
                protocol: [params.token]
            })
        }

        return this.#socket.asObservable()
            .pipe(
                tap(message => params.handleMessage(message)),
                finalize(() => { 
                    console.log('Пошел вон! Кина не будет, тикай отсюда, тоби пизда!');
                    this.#handleSocketClose(params)
                })
            )
    }

    disconnect(): void {
        this.#socket?.complete()
    }

    sendMessage(text: string, chatId: number): void {
        this.#socket?.next({
            text,
            chat_id: chatId
        })
    }
    

    #handleSocketClose(params: ChatConnectionWSParams) {
        // Обновляем токен
        this.#authService.refreshAuthToken();

        // Когда токен обновлен, то переподключаем WS
        if(this.#authService.token) {
            this.#socket?.complete();

            console.log('Токен обновлен!');

            this.connect({
                url: params.url,
                token: this.#authService.token!,
                handleMessage: params.handleMessage
            })
        }
    }
}