import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import {PostInputComponent} from '../../ui';
import { PostComponent } from '../post/post.component';
import { TestDirective } from './test.directive';
import { Store } from '@ngrx/store';
import { postActions, PostService, selectPosts } from '@tt/data-access';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent, TestDirective],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  store = inject(Store);

  feed = this.store.selectSignal(selectPosts);

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    this.store.dispatch(postActions.postsLoaded());
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }


  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
