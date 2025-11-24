// Basic selectors
export const selectTermsOfUseState = (state) => state.termsOfUse;
export const selectTermsOfUse = (state) => state.termsOfUse.termsOfUse;
export const selectTermsOfUseLoading = (state) => state.termsOfUse.loading;
export const selectTermsOfUseError = (state) => state.termsOfUse.error;
export const selectTermsOfUseUpdating = (state) => state.termsOfUse.updating;
export const selectTermsOfUseUpdateError = (state) => state.termsOfUse.updateError;

