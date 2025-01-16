import { Component, EventEmitter, HostBinding, inject, Input, input, Output, Renderer2 } from '@angular/core';
import { AvatarCircleComponent } from "../../../common-ui/avatar-circle/avatar-circle.component";
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { NgIf } from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    NgIf,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  // Renderer2 позволяет манипулировать элементом не изменяя сам DOM
  
  @Input() profileAvatar!: string | null | undefined;

  postId = input<number>(0);
  postText = "";

  @Output() created = new EventEmitter();

  
  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
  }

  onSendPost() {
    if (!this.postText.trim()) {
      return;
    }
    
    const data = {
      postText: this.postText,
      postId: this.postId()
    }

    // Передадим значение [postText] родительскому компоненту
    this.created.emit(data);
    this.postText = "";
  }

}
