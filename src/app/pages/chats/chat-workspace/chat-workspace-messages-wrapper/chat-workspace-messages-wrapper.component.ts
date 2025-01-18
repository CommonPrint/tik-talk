import { Component, ElementRef, inject, input, OnInit, Renderer2, signal } from '@angular/core';
import { ChatWorkspaceMessageComponent } from "./chat-workspace-message/chat-workspace-message.component";
import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component';
import { ChatsService } from '../../../../data/services/chats.service';
import { Chat, Message } from '../../../../data/interfaces/chats.interface';
import { firstValueFrom, switchMap, timer } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfileService } from '../../../../data/services/profile.service';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent,
    CommonModule
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent implements OnInit {

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  me = inject(ProfileService).me;

  chatsService = inject(ChatsService);

  chat = input.required<Chat>();

  messages: any = this.chatsService.activeChatMessages;

  uniqueDates = this.chatsService.uniqueDates;

  today = {date: '', isToday: false};
  scrollContainer: any;

  rxJsTimer = timer(0, 10000);
  timer!: number;

  ngOnInit() {
    let date = new Date();
    this.today.date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`
    this.today.isToday = this.messages().includes(this.today);

    this.scrollContainer = this.hostElement.nativeElement.firstChild;

    // Периодический запрос на сервер для получения новых сообщений чата
    this.rxJsTimer.pipe(
      switchMap(() => this.chatsService.getChatById(this.chat().id))
    )
    .subscribe(() => {
      this.messages = this.chatsService.activeChatMessages;
  
      this.scrollToBottom();
    })

  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  async onSendMessage(msgText: string) {
    const message: any = await firstValueFrom(this.chatsService.sendMessage(this.chat().id, msgText))

     // Добавляем дополнительные свойства к новому сообщению
    // const patchedMessage = [{
    //     ...message,
    //     user: this.messages()[0].length > 0
    //         ? (this.messages()[0].userFromId === message.userFromId
    //             ? this.messages()[0].user
    //             : this.me()) // Используем первого пользователя для определения user
    //         : this.me(),
    //     isMine: message.userFromId === this.me()!.id,
    //   },
    //   {
    //     ...message,
    //     user: this.chat().companion,
    //     isMine: false
    //   }
    // ]

    // Обновляем массив сообщений
    //  const updatedMessages = [...this.messages(), ...patchedMessage];
    //  this.chatsService.activeChatMessages.set(updatedMessages);
  }

  scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      behavior: 'smooth'
    });
    // this.scrollContainer.scrollTop = this.scrollContainer.scrollTopMax;
  }

}
