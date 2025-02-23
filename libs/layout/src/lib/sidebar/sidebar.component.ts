import { ChatsService } from '@tt/chats';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/profile';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isErrorMessage } from '@tt/chats';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    ImgUrlPipe,
    AsyncPipe,
    SubscriberCardComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
  destroyRef = inject(DestroyRef);

  subscribers$ = this.profileService.getSubscribersShortList();

  unreadMessagesCount: any;

  wsSubscribe!: Subscription;

  me = this.profileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  async reconnect() {
    console.log('reconnecting...');
    await firstValueFrom(this.profileService.getMe());
    await firstValueFrom(timer(1000));
    this.connectWs();
  }


  connectWs(): void {
    this.wsSubscribe?.unsubscribe();

    // Подключаем WebSocket и обрабатываем сообщения
    this.wsSubscribe = this.chatsService.connectWs()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((message) => {
      if(isErrorMessage(message)) {
        console.log('Wrong token');
        this.reconnect();
      }
    })
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    
    this.unreadMessagesCount = this.chatsService.unreadMessagesCount;

    this.connectWs();
  }

}
