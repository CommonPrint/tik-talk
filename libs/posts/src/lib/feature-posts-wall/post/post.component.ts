import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import { firstValueFrom } from 'rxjs';
import {CommentComponent, PostInputComponent} from '../../ui';
import { COLOR, TIMELINE_SERVICE } from './color.token';
import { Post, PostComment, PostService } from '@tt/data-access';

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
      useExisting: PostService
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
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
