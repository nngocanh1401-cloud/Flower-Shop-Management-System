import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin) {
    return true;
  }

  // Nếu không phải admin, đá về trang chủ
  router.navigate(['/']); 
  return false;
};