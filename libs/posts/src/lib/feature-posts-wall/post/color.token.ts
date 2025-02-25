import { InjectionToken } from "@angular/core";
import { PostService } from "@tt/data-access";

export const COLOR = new InjectionToken<string>('It is border color', {
    providedIn: 'root',
    factory: () => 'red'
});

export const TIMELINE_SERVICE = new InjectionToken<PostService>('TIMELINE_SERVICE');