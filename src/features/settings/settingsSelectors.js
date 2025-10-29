import { createSelector } from "@reduxjs/toolkit";

export const selectSettingsState = (state) => state.settings;
export const selectPlatformSettings = (state) =>
  state.settings.platformSettings;
export const selectSettingsLoading = (state) => state.settings.loading;
export const selectSettingsError = (state) => state.settings.error;
export const selectSettingsUpdating = (state) => state.settings.updating;
export const selectSettingsUpdateError = (state) => state.settings.updateError;

// Computed selectors
export const selectPlatformSettingsHasValues = createSelector(
  [selectPlatformSettings],
  (settings) => {
    return settings.id && settings.id !== "";
  }
);

export const selectPlatformSettingsValidation = createSelector(
  [selectPlatformSettings],
  (settings) => {
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }
);
