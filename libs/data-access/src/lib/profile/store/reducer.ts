import { createFeature, createReducer, on } from "@ngrx/store";
import { profileActions, setFilterValues} from "./actions";
import { ProfileFilter } from "../interfaces/profile-filter.interface";
import { Profile } from "../interfaces/profile.interface";

export interface ProfileState {
    profiles: Profile[],
    profileFilters: Record<string, any>,
    page: number,
    size: number
}

export const initialProfileState: ProfileState = {
    profiles: [],
    profileFilters: {},
    page: 1,
    size: 10
}

export const initialFilterState: ProfileFilter = {
    firstName: '',
    lastName: '',
    stack: ''
}


export const profileFeature = createFeature({
    name: 'profileFeature',
    reducer: createReducer(
        initialProfileState,
        on(profileActions.profilesLoaded, (state, payload) => {
            return {
                ...state,
                profiles: state.profiles.concat(payload.profiles)
            }
        }),
        on(profileActions.filterEvents, (state, payload) => {
            return {
                ...state,
                profiles: [],
                profileFilters: payload.filters,
                page: 1
            }
        }),
        on(profileActions.setPage, (state, payload) => {
            let {page} = payload;

            if(!page) {
                page = state.page + 1
            }

            return {
                ...state,
                page
            }
        })
    ),
});


// Редюсер для фильтрации списка имен
export const filterReducer = createReducer(
    initialFilterState,
    on(setFilterValues, (state, {filters}) => ({
        ...state,
        ...filters
    }))
)