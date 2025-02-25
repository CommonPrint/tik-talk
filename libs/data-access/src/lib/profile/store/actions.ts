import {createAction, createActionGroup, props} from '@ngrx/store';
import { Profile } from '../interfaces/profile.interface';
import { ProfileFilter } from '../interfaces/profile-filter.interface';

export const profileActions = createActionGroup({
    source: 'profile',
    events: {
        'filter events': props<{filters: Record<string, any>}>(),
        'set page': props<{page?: number}>(),
        'profiles loaded': props<{profiles: Profile[]}>()
    }
});

export const setFilterValues = createAction(
    '[Profile] Set Filter Values',
    props<{filters: ProfileFilter}>()
);