import { createFeatureSelector, createSelector } from "@ngrx/store";
import { profileFeature } from "./reducer";
import { ProfileFilter } from "@tt/interfaces/profile";

export const selectFilteredProfiles = createSelector(
    profileFeature.selectProfiles,
    (profiles) => profiles
)


export const selectFilterState = createFeatureSelector<ProfileFilter>('filters');

export const selectFilteValues = createSelector(
    selectFilterState,
    (state) => state
)