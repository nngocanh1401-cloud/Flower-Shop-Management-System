import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Thêm CommonModule
import { AuthService } from './core/services/auth.service'; // Import service
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule], // Cập nhật imports ở đây
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FSHOP.Angular');
  constructor(public authService: AuthService) {}
}

