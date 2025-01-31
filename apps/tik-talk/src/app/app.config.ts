import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideState, provideStore} from '@ngrx/store';

import { routes } from './app.routes';
import { authTokenInterceptor } from '@tt/auth';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, postFeature } from 'libs/posts/src/lib/data';
import { filterReducer, ProfileEffects} from 'libs/profile/src/lib/data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    // provideStore(),
    provideStore(
      { [postFeature.name]: postFeature.reducer },
    ),
    provideState({name: 'filters', reducer: filterReducer}),
    // provideEffects()
    provideEffects([PostEffects, ProfileEffects])
  ],
};
