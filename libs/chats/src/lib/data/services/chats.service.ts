import { AuthService } from '@tt/auth';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { getUniqueDates } from '../../../../../common-ui/src/lib/utils/getUniqueDates';
import { map, Observable } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWsNativeService } from './chat-ws-native.service';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWSRxjsService } from '../interfaces/chat-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(ProfileService).me;

  wsAdapter: ChatWsService = new ChatWSRxjsService();

  // Чтобы сообщения в чате при переключении между чатами обновлялись
  activeChatMessages = signal<Message[]>([]);
  anotherUser = null;

  uniqueDates!: string[];

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  
  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>;
  }


  // TODO Замыкания
  handleWSMessage = (message: ChatWSMessage) => {

    if(!('action' in message)) return

    if(isUnreadMessage(message)) {
      // TODO
    }

    if(isNewMessage(message)) {
      
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: message.data.author === this.me()?.id,
          user:  message.data.author === this.me()?.id ? this.me() : null
        }
      ]);

      console.log('user', this.me());
      console.log('it was a new message', message);
      console.log('activeChatMessages:', this.activeChatMessages());
    }
  }


  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        this.activeChatMessages.set(patchedMessages);

        this.uniqueDates = getUniqueDates(this.activeChatMessages());

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      }),
    );
  }

  // For messages
  sendMessage(chatId: number, message: string) {
    return this.http.post(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      },
    );
  }
}
