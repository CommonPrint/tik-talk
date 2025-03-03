import { RatingControlComponent } from '@tt/common-ui';
import { TtInputComponent } from '@tt/common-ui';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@tt/data-access';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, TtInputComponent, RatingControlComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
    // rating: new FormControl<number | null>(0, Validators.required),
  });

  ngOnInit() {
    this.form.valueChanges.subscribe((val) => {
      console.log(val);
    });

    // this.form.controls.username.disable();
  }

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigate(['']);
        console.log(res);
      });
    }
  }
}
