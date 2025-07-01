import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  user = {
    name: '',
    nickname: '',
    email: '',
    password: ''
  };
  message = '';
  error = '';

  constructor(private authService: AuthenticationService, private router: Router, private toastr: ToastrService) {}

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: res => {
        this.message = res.message;
        this.error = '';
        this.toastr.success("Sikeres regisztráció!")
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = err.error.message || 'Hiba a regisztráció során.';
        this.toastr.error(err.error.message, "Hiba!")
        this.message = '';
      }
    });
  }

}
