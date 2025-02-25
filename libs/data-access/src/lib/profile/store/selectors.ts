import { createFeatureSelector, createSelector } from "@ngrx/store";
import { profileFeature } from "./reducer";
import { ProfileFilter } from "../interfaces";

export const selectFilteredProfiles = createSelector(
    profileFeature.selectProfiles,
    (profiles) => profiles
)

// для бесконечного скролла
export const selectProfilePageable = createSelector(
    profileFeature.selectProfileFeatureState,
    (state) => {
        return {
            page: state?.page,
            size: state?.size
        }
    }
)

export const selectProfileFilters = createSelector(
    profileFeature.selectProfileFilters,
    (filters) => filters
)



// Для фильтрации имен списка
export const selectFilterState = createFeatureSelector<ProfileFilter>('filters');

export const selectFilterValues = createSelector(
    selectFilterState,
    (state) => state
)