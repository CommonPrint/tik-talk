import { Component, EventEmitter, HostBinding, inject, input, OnInit, Output, signal } from '@angular/core';
import { AvatarCircleComponent } from "../../../common-ui/avatar-circle/avatar-circle.component";
import { DatePipe } from '@angular/common';
import { Post, PostComment } from '../../../data/interfaces/post.interface';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostService } from '../../../data/services/post.service';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { CommentComponent } from './comment/comment.component';
import { firstValueFrom } from 'rxjs';
import { DateFormatComponent } from "../../../common-ui/date-format/date-format.component";
import { FormsModule } from '@angular/forms';

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
    FormsModule
],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  
  post = input<Post>();

  comments = signal<PostComment[]>([]);

  postService = inject(PostService);


  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(comments);
  }

}
