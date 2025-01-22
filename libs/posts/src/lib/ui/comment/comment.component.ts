import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PostComment } from '../../data';
import { AvatarCircleComponent, DateFormatComponent } from '@tt/common-ui';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe, DateFormatComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
