import { bootstrapApplication } from '@angular/platform-browser';
import {provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';

enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot({})),
    provideHttpClient(),
    provideRouter(routes),    
  ],
});
