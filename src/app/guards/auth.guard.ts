import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		const isAuthenticated = this.isLogged();

		if (isAuthenticated) {
			return of(isAuthenticated);
		} else {
			return this.redirectToLogin();
		}
	}
	
	isLogged(): boolean {
		if (localStorage.getItem('userId')) {
			return true;
		}

		return false;
	}

	redirectToLogin(): Observable<boolean> {
		// Not logged in, so redirect to login page.
		window.location.href = '/Login';
		return of(false);
	}
}
