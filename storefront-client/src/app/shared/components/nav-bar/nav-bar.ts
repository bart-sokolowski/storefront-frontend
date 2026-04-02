import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss'
})
export class NavBar {
  private readonly authService = inject(AuthService);
  private readonly signalrService = inject(SignalrService);
  private readonly userContextService = inject(UserContextService);
  private readonly router = inject(Router);

  protected readonly isLoggedIn$ = this.authService.isLoggedIn;
  protected readonly userContext = this.userContextService.userContext;

  protected async signOut(): Promise<void> {
    await this.signalrService.disconnect();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
