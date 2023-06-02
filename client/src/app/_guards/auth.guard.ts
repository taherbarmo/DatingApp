import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_service/account.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  
  constructor(private accountService : AccountService,private toaster: ToastrService) {

    
  }
  canActivate(): Observable<boolean> {
    //authguart sub and unsubs auto
    return this.accountService.currentUser$.pipe(
      map(user =>{
        if(user)
        return true;
        else {
          this.toaster.error('You should not pass!');
          return false;
        }
      })
    )
  }
}
