import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarCircleComponent, ImgUrlPipe } from '@tt/common-ui';
import { Profile } from '@tt/profile';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
}
