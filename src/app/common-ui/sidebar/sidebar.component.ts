import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { ProfileService } from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs';

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
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService);

  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }

}
