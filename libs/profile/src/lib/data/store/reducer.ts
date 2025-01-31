import { createFeature, createReducer, on } from "@ngrx/store";
import { Profile, ProfileFilter } from "@tt/interfaces/profile";
import { profileActions, setFilterValues} from "./actions";

export interface ProfileState {
    profiles: Profile[],
    profileFilters: Record<string, any>
}

export const initialState: ProfileState = {
    profiles: [],
    profileFilters: {}
}

export const initialFilterState: ProfileFilter = {
    firstName: '',
    lastName: '',
    stack: ''
}


export const profileFeature = createFeature({
    name: 'profileFeature',
    reducer: createReducer(
        initialState,
        on(profileActions.profilesLoaded, (state, payload) => {
            return {
                ...state,
                profiles: payload.profiles
            }
        })
    ),
});


export const filterReducer = createReducer(
    initialFilterState,
    on(setFilterValues, (state, {filters}) => ({
        ...state,
        ...filters
    }))
)