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
  
  feed = this.postService.posts;


  @HostListener('window:resize')
  @DebounceClick(300)
  onWindowResize() {
    // fromEvent(window, 'resize')
    //   .pipe(debounceTime(300))
    //   .subscribe(() => {
    //     this.resizeFeed();    
    //   })

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

}

