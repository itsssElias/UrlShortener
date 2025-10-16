// client/src/app/app.component.ts
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class AppComponent {
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
