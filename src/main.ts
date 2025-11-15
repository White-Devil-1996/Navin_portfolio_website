// Load Zone.js before bootstrapping the app so NgZone is available.
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';
import { TokenInterceptor } from './app/core/token.interceptor';

// Inactivity config + service imports (browser-only)
import { INACTIVITY_CONFIG, InactivityConfig } from './app/core/inactivity-config';
import { InactivityService } from './app/core/inactivity.service';

const myInactivityConfig: InactivityConfig = {
  timeoutMs: 5 * 60 * 1000,     // 5 minutes
  warningMs: 30 * 1000,         // 30s warning
  activityEvents: ['mousemove','keydown','touchstart','click'],
  countdownTickMs: 1000,
  redirectUrl: '/login',
  broadcastChannelName: 'my-app-inactivity'
};

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    ),
    // provide the config token so InactivityService reads it
    { provide: INACTIVITY_CONFIG, useValue: myInactivityConfig }
  ]
})
.then(appRef => {
  // Get service instances from the app injector and start inactivity watcher
  const injector = appRef.injector;
  const inactivity = injector.get(InactivityService);

  // Start inactivity watcher in browser only
  inactivity.startWatching();
})
.catch(err => console.error(err));
