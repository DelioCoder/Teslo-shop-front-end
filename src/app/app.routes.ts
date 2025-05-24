import { Routes } from '@angular/router';
import { isAdminGuard } from '@auth/guards/is-admin.guard';
import { notAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
        canMatch: [isAdminGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        // TODO: Guards
        canMatch: [notAuthenticatedGuard]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes')
    },
];
