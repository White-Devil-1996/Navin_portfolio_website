import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/loader.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { InactivityService } from './core/inactivity.service';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio-website');

  constructor(
    private loader: LoaderService,
    private inactivity: InactivityService,
    private auth: AuthService
  ) {
    // Hide loader after first render completes
    afterNextRender(() => {
      setTimeout(() => {
        this.loader.hide();
      }, 500);
    });
  }

  ngOnInit() {
    // Start inactivity watching only when logged in
    this.auth.isLoggedIn$.subscribe(is => {
      if (is) this.inactivity.startWatching();
      else this.inactivity.stopWatching();
    });
  }
}
