import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {

  router = inject(Router);

  fb = inject(FormBuilder);

  private _service = inject(AuthService);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.email]],
    password: ['', [Validators.required]]
  });

  hasError = signal(false);

  onSubmit() {
    if (!this.registerForm.valid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    }

    const { fullName, email, password } = this.registerForm.value;

    this._service.register(fullName!, email!, password!)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }

        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      });

  }

}
