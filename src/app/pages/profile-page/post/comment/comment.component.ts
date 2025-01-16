import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PostComment } from '../../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { DateFormatComponent } from '../../../../common-ui/date-format/date-format.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    DateFormatComponent,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<PostComment>();
}
