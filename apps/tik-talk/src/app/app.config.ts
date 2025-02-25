import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore} from '@ngrx/store';

import { routes } from './app.routes';
import { authTokenInterceptor } from '@tt/auth';
import { provideEffects } from '@ngrx/effects';
import { 
  ChatEffects, chatFeature, filterReducer, 
  PostEffects, postFeature, ProfileEffects 
} from '@tt/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideStore(
      { 
        [postFeature.name]: postFeature.reducer,
        [chatFeature.name]: chatFeature.reducer,
        filters: filterReducer 
      },
    ),
    provideEffects([PostEffects, ProfileEffects, ChatEffects])
  ],
};
