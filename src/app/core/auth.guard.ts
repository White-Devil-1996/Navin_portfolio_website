import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  console.log('AuthGuard invoked');
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn$.pipe(
    map(isLoggedIn => {
      return isLoggedIn ? true : router.createUrlTree(['/login']);
    })
  );
};
