import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoadingButton],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly signalrService = inject(SignalrService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isLoading()) return;

    const { email, password } = this.form.value;
    this.isLoading.set(true);

    this.authService.login(email!, password!).subscribe({
      next: async result => {
        if (result.isSuccess) {
          await this.signalrService.connect();
          this.router.navigate(['/products']);
        } else {
          this.notificationService.add(result.note ?? 'Login failed.', 'error');
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
