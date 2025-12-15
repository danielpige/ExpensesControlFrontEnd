import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authSvc = inject(AuthService);
  private snackBar = inject(SnackBarService);

  constructor() {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.authSvc.isAuthenticated()) {
      return true;
    }

    this.snackBar.info('Por favor iniciar sesión.');

    this.authSvc.logout();

    return this.router.createUrlTree(['/auth/login']);
  }
}
