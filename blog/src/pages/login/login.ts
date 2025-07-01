import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  message = '';
  error = '';

  constructor(private authService: AuthenticationService, private router: Router, private toastr: ToastrService) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.message = res.message;
        this.error = '';
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('userId', JSON.stringify(res.user._id));
        this.toastr.success("Sikeres bejelentkezés!")
        this.router.navigate(['/home']);
      },
      error: err => {
        this.error = err.error.message || 'Hibás email vagy jelszó.';
        this.toastr.error(err.error.message, "Hiba!")
        this.message = '';
      }
    });
  }
}
