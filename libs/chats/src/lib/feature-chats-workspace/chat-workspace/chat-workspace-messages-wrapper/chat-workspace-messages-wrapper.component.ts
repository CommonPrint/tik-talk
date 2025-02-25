import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { CommonModule } from '@angular/common';
import { ProfileService } from '@tt/profile';
import { MessageInputComponent } from 'libs/chats/src/lib/ui/message-input/message-input.component';
import { Chat, ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, CommonModule],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent implements OnInit {
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  me = inject(ProfileService).me;

  chatsService = inject(ChatsService);

  chat = input.required<Chat>();

  messages: any = this.chatsService.activeChatMessages;

  // uniqueDates = this.chatsService.uniqueDates;

  today = { date: '', isToday: false };
  scrollContainer: any;

  ngOnInit() {
    let date = new Date();
    this.today.date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`;
    this.today.isToday = this.messages().includes(this.today);

    this.scrollContainer = this.hostElement.nativeElement.firstChild;
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  async onSendMessage(msgText: string) {
    this.chatsService.wsAdapter.sendMessage(
      msgText,
      this.chat().id
    );
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      behavior: 'smooth',
    });
  }
}
