import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

export const adminGuard: CanActivateFn = () => {
  const userContextService = inject(UserContextService);
  const router = inject(Router);

  const context = userContextService.getContext();
  if (context?.isAdmin) return true;

  router.navigate(['/products']);
  return false;
};
