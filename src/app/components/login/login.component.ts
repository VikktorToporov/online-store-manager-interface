import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserRole } from 'src/app/enums/user.enum';
import { User } from 'src/app/models/user.model';
import { ClientsService } from 'src/app/services/clients.service';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userType: number;
  userId: string;

  loginForm: FormGroup;
  signupForm: FormGroup;
  
  showLogin = null;
  showLoginInfoTitle = false;
  showError = false;

  enumUserRole = UserRole;

  signupFormInitialValue = {
    username: '',
    email: '',
    password: '',
    role: null,
  }

  constructor(private usersService: UsersService, protected clientsService: ClientsService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
    this.userType = +localStorage.getItem('userType');
    this.userId = localStorage.getItem('userId');

    if (this.userId && +this.userType != UserRole.ADMINISTRATOR) {
      window.location.href = '/';
    } else {
      this.showLogin = +this.userType === UserRole.ADMINISTRATOR ? false : true;
      
      this.loginForm = this._formBuilder.group({
        email: [''],
        password: [''],
      });

      this.signupForm = this._formBuilder.group(this.signupFormInitialValue);
    }
  };

  login() {
    this.showError = false;

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      if (email && password) {
        const user: Partial<User> = {
          email: email,
          password: password,
        };
    
        this.usersService.login(user)
          .subscribe((result: User) => {
            if (result != null) {
              this.initUser(result);
            }
          }, error => { this.showError = true; });
      }
    }
  }

  initUser(result: any) {
    if (result) {
      localStorage.setItem('userId', result.id);
      
      if (result.role != null && result.role != undefined) {
        localStorage.setItem('userType', UserRole[result.role]);
      }
      
      if (result.cart) {
        localStorage.setItem('cart', result.cart || '');
      }
      
      localStorage.setItem('theme', result.prefferedUserTheme);
      window.location.href = '/';
    }
  }

  signup() {
    this.showError = false;

    if (this.signupForm.valid) {
      const username = this.signupForm.value.username;
      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;
      const role = this.signupForm.value.role;

      if (password && username && email) {
        if (this.userType === UserRole.ADMINISTRATOR) {
          const user: Partial<User> = {
            username: username,
            email: email,
            password: password,
            role: role,
          };

          const client: Partial<User> = {
            username: username,
            email: email,
            password: password,
          };
  
          if (role != -1) {
            this.usersService.signup(user)
            .subscribe((result: any) => {
              if (result) {
                this._snackBar.open('User added!', 'Close', {duration: 2 * 1000});
                this.signupForm.patchValue(this.signupFormInitialValue);
              }
            }); 
          } else {
            this.clientsService.signup(client)
            .subscribe((result: any) => {
              if (result) {
                this._snackBar.open('Client added!', 'Close', {duration: 2 * 1000});
                this.signupForm.patchValue(this.signupFormInitialValue);
              }
            }); 
          }
        } else {
          const user: Partial<User> = {
            username: username,
            email: email,
            password: password,
          };
  
          this.clientsService.signup(user)
            .subscribe((result: any) => {
              if (result) {
                this.showLogin = true;
                this.showLoginInfoTitle = true;
              }
            }); 
        }
      }
    }
  }
}
