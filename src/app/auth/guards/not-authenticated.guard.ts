import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {
    
    const authService = inject(AuthService);

    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(authService.checkStatus()); // Throw an observable and wait until the promise comes back

    if ( isAuthenticated ) {
        router.navigateByUrl('/', {
            replaceUrl: true
        });
        return false;
    }
    
    return true;
}