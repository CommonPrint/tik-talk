import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { map, Observable } from 'rxjs';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWSRxjsService } from './chat-ws-rxjs.service';
import { AuthService } from '../../auth';
import { ProfileService } from '@tt/data-access';

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
  unreadMessagesCount = signal<number>(0);

  // uniqueDates!: string[];

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
      this.unreadMessagesCount.set(message.data.count);
    }

    if(isNewMessage(message) 
        && (message.data.chat_id === this.activeChatMessages()[0]?.personalChatId)) {
      
      // Проверка на дублирующиеся сообщения
      const isDuplicate = this.activeChatMessages().some(msg => msg.id === message.data.id);
      
      if (isDuplicate) {
          console.warn("Дубликат сообщения, игнорируем:", message);
          return;
      }

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
          user: message.data.author === this.me()?.id ? this.me() : null
        }
      ]);
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

        // this.uniqueDates = getUniqueDates(this.activeChatMessages());

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
          message
        },
      },
    );
  }
}
