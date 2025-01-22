import {
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { CommentComponent } from '../../ui/comment/comment.component';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Post, PostComment, PostService } from '../../data';
import { AvatarCircleComponent, DateFormatComponent, SvgIconComponent } from '@tt/common-ui';
import {ProfileService} from '@tt/profile'

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
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
      console.log('postText: ', this.postText);
      this.postText = '';
    });
  }
}
