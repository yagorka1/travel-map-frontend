import { Component, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'lib-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private auth: AuthService = inject(AuthService);

  constructor() {
    setTimeout(() => {
      this.auth.login({ email: 'test@mail.com', password: '123456' }).subscribe();
    }, 5000);
  }
}
