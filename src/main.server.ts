// Load Zone.js for server-side so Angular's NgZone is available during SSR.
import 'zone.js/node';
import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext | undefined) => {
  // Pass the incoming BootstrapContext through to bootstrapApplication so the
  // server creates the correct platform (avoids NG0401 Missing Platform).
  return bootstrapApplication(App, config, context);
};

export default bootstrap;
