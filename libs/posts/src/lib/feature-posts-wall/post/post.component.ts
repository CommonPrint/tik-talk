import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { DatePipe } from '@angular/common';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostService } from '../../../data/services/post.service';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { CommentComponent } from '../../ui/comment/comment.component';
import { firstValueFrom } from 'rxjs';
import { DateFormatComponent } from '../../../common-ui/date-format/date-format.component';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../data/services/profile.service';
import { Post, PostComment } from '../../data';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    PostInputComponent,
    SvgIconComponent,
    CommentComponent,
    DateFormatComponent,
    FormsModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();

  comments = signal<PostComment[]>([]);

  postService = inject(PostService);

  isCommentInput = input(true);
  postText = '';
  postId = 0;

  feed = this.postService.posts;

  profile = inject(ProfileService).me;

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id),
    );
    this.comments.set(comments);
  }

  handlePost(data: any) {
    const postText = data.postText;
    const postId = data.postId;

    if (this.isCommentInput()) {
      firstValueFrom(
        this.postService.createComment({
          text: postText,
          authorId: this.profile()!.id,
          postId: postId,
        }),
      ).then(() => {
        this.postText = '';
      });

      return;
    }

    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
      }),
    ).then(() => {
      this.postText = '';
    });
  }
}
