import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if (!this.authService.isLoggedIn()) {
    //   this.router.navigateByUrl("/login");
    //   return false;
    // }
    // return true;
    
    // console.log(`isLoggedIn :: `)
    // console.log(this.authService.isLoggedIn())
    
    const getUser = localStorage.getItem('user');
    // console.log(`getUser :: `);
    // console.log(getUser);
    if(getUser != null){
        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
  
}
