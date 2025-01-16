import { Component, ElementRef, EventEmitter, HostBinding, HostListener, inject, input, Output, Renderer2 } from '@angular/core';
import { PostInputComponent } from "../post-input/post-input.component";
import { PostComponent } from "../post/post.component";
import { PostService } from '../../../data/services/post.service';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { DebounceClick } from '../../../helpers/decorators/debounce-click';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  
  isCommentInput = input(false);
  postText = "";
  postId = 0;
  
  feed = this.postService.posts;

  profile = inject(ProfileService).me;

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  @HostListener('window:resize')
  @DebounceClick(300)
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }


  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  handlePost(data: any) {
    const postText = data.postText;
    const postId = data.postId;

    if(this.isCommentInput()) {
      firstValueFrom(this.postService.createComment({
        text: postText,
        authorId: this.profile()!.id,
        postId: postId
      })).then(() => {
        this.postText = "";
      })

      return;
    }

    firstValueFrom(this.postService.createPost({
      title: 'Клевый пост',
      content: postText,
      authorId: this.profile()!.id
    })).then(() => {
      this.postText = "";
    })
  }
}


