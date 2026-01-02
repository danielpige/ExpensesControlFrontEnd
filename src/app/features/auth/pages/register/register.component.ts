import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterForm, RegisterValues } from '../../../../core/models/user.model';
import { LoaderService } from '../../../../core/services/loader.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { passwordMatchValidator } from '../../../../core/utils/validators/password-match.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loaderSvc = inject(LoaderService);
  private authenticationSvc = inject(AuthenticationService);
  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  registerForm!: FormGroup<RegisterForm>;
  submitting = false;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group<RegisterForm>(
      {
        Username: this.fb.control(null, { validators: [Validators.required, Validators.minLength(3)] }),
        Email: this.fb.control(null, { validators: [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)] }),
        Password: this.fb.control(null, {
          validators: [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)],
        }),
        ConfirmPassword: this.fb.control(null, {
          validators: [Validators.required],
        }),
      },
      {
        validators: passwordMatchValidator('Password', 'ConfirmPassword'),
      }
    );
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();
    this.submitting = true;

    const data = this.registerForm.value as RegisterValues;

    this.authenticationSvc
      .registerUser(data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loaderSvc.hide();
          this.submitting = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.Success) {
            this.snackBar.success('Te has registrado e iniciado sesión correctamente.');

            this.router.navigate(['/dashboard']);
          }
        },
      });
  }

  get confirmPassword(): AbstractControl<string> {
    return this.registerForm.get('confirmPassword') as AbstractControl<string>;
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickEventConfirmPassword(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }
}
