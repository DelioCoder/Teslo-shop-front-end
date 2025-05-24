import { computed, inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[]
) => {

    const router = inject(Router);

    const authService = inject(AuthService);

    await firstValueFrom(authService.checkStatus());

    if ( !authService.isAdmin() ){
        router.navigateByUrl('/');
        return false;
    }

    return true;
}