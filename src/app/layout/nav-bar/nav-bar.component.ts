import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  private authSvc = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  logOut(): void {
    this.authSvc.logout();
    this.router.navigate(['/auth/login']);
  }
}
