import { Routes } from '@angular/router';
import { canActivateAuth } from '@tt/auth';
import { LayoutComponent } from '@tt/layout';
import { ProfilePageComponent } from '@tt/profile';
import { chatsRoutes } from 'libs/chats/src/lib/feature-chats-workspace/chats-page/chatsRoutes';
import { SearchPageComponent } from 'libs/profile/src/lib/feature-profile-list/search-page/search-page.component';
import { SettingsPageComponent } from 'libs/profile/src/lib/feature-profile-settings/settings-page/settings-page.component';
import { LoginPageComponent } from 'libs/auth/src/lib/feature-login';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProfileEffects, profileFeature } from 'libs/profile/src/lib/data';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { 
        path: 'search', 
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects) 
        ]
      },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
];
function provideEffect(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

