import { Component, computed, inject, signal } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { chatActions, ChatsService, selectChats } from '../../data';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, map, startWith, Subscription, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  store = inject(Store);

  chatsService = inject(ChatsService);
  filterChatsControl = new FormControl('');
  
  // Сигналы для фильтра и списка чатов 
  filterText = signal('');
  allChats$ = this.store.selectSignal(selectChats);

  // Сигнал отфильтрованных чатов
  chats$ = computed(() => {
    const filterValue = this.filterText().toLowerCase().trim();
    const chats = this.allChats$();
    
    return !filterValue
      ? chats
      : chats.filter(chat => chat.userFrom.firstName.toLowerCase().includes(filterValue) || chat.userFrom.lastName.toLowerCase().includes(filterValue));
  });

  ngOnInit() {
    this.store.dispatch(chatActions.chatsLoaded());

    this.filterChatsControl.valueChanges.pipe(
      debounceTime(300),
    )
    .subscribe(value => {
      this.filterText.set(value || '');
    })
    
  }
  

}
