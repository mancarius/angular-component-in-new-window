import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { App } from './app/app.component';

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
