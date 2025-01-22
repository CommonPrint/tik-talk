import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  // Renderer2 позволяет манипулировать элементом не изменяя сам DOM

  @Input() profileAvatar!: string | null | undefined;

  postId = input<number>(0);
  postText = '';

  @Output() created = new EventEmitter();

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
  }

  onEnterPress(event: Event) {
    event.preventDefault(); // Предотвращаем создание новой строки
    this.onSendPost(); // Вызываем отправку поста
  }

  onSendPost() {
    if (!this.postText.trim()) {
      return;
    }

    const data = {
      postText: this.postText,
      postId: this.postId(),
    };

    // Передадим значение [postText] родительскому компоненту
    this.created.emit(data);
    this.postText = '';
  }
}
