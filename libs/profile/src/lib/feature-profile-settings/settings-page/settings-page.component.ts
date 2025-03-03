import { ChangeDetectionStrategy, Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { AvatarUploadComponent } from '../../ui/avatar-upload/avatar-upload.component';
import { StackInputComponent } from "../../../../../common-ui/src/lib/components/stack-input/stack-input.component";
import { AddressInputComponent } from '@tt/common-ui';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent, 
    AvatarUploadComponent, 
    ReactiveFormsModule, 
    StackInputComponent,
    AddressInputComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader: any;

  // form = this.fb.group({
  //   firstName: ['', Validators.required],
  //   lastName: ['', Validators.required],
  //   username: [{ value: '', disabled: true }, Validators.required],
  //   description: [''],
  //   stack: [''],
  //   city: [null]
  // });
  
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
    address: new FormGroup({
      city: new FormControl(''),
      street: new FormControl(''),
      building: new FormControl('')
    })
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar),
      );
    }

    firstValueFrom(
      // @ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
      })
    );

    console.log('form', this.form.value);
  }

}
