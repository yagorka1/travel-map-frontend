import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '@app/core/components/spinner/spinner.component';

@Component({
  imports: [RouterModule, SpinnerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
