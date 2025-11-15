import { ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { serverRoutes } from './app.routes.server';
import { routes } from './app.routes';

// Server-side config: exclude browser-only services like TokenInterceptor and InactivityService
export const config: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Don't include TokenInterceptor during SSR as it depends on AuthService which uses localStorage
    provideServerRendering(withRoutes(serverRoutes))
  ]
};
