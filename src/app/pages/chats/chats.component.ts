import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from './chats-list/chats-list.component';
import { ChatWorkspaceComponent } from './chat-workspace/chat-workspace.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [RouterOutlet, ChatsListComponent, ChatWorkspaceComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsPageComponent {}
