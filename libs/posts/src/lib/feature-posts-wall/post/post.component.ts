import { DatePipe } from '@angular/common';
import { Component, Host, inject, input, OnInit, Optional, Self, signal, SkipSelf } from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import { firstValueFrom } from 'rxjs';
import {Post, PostComment, PostService} from '../../data';
import {CommentComponent, PostInputComponent} from '../../ui';
import { TestDirective } from '../post-feed/test.directive';
import { COLOR, TIMELINE_SERVICE } from './color.token';
import {ChatsService} from '../../../../../../apps/tik-talk/src/app/data/services/chats.service'

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [
    {
      provide: TIMELINE_SERVICE,
      useValue: PostService,
    }
  ]
})
export class PostComponent implements OnInit {
  post = input<Post>();

  color = inject(COLOR);

  comments = signal<PostComment[]>([]);

  postService = inject(TIMELINE_SERVICE) as PostService;

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );
    this.comments.set(comments);
  }
}
