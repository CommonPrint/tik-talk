import { Component, EventEmitter, inject, Output, Renderer2 } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../../data/services/profile.service';
import { AvatarCircleComponent } from '../avatar-circle/avatar-circle.component';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    FormsModule,
    CommonModule,
    SvgIconComponent
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  // Renderer2 позволяет манипулировать элементом не изменяя сам DOM
  r2 = inject(Renderer2);
  me = inject(ProfileService).me;

  @Output() created = new EventEmitter<string>();

  postText = "";

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, "height", "auto");
    this.r2.setStyle(textarea, "height", textarea.scrollHeight + "px");
  }

  onCreatePost() {
    
    if(!this.postText) {
      return 
    }

    
    this.created.emit(this.postText);
    this.postText = '';
  }

}
