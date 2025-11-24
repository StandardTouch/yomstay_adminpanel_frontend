// Basic selectors
export const selectPrivacyPolicyState = (state) => state.privacyPolicy;
export const selectPrivacyPolicy = (state) => state.privacyPolicy.privacyPolicy;
export const selectPrivacyPolicyLoading = (state) => state.privacyPolicy.loading;
export const selectPrivacyPolicyError = (state) => state.privacyPolicy.error;
export const selectPrivacyPolicyUpdating = (state) => state.privacyPolicy.updating;
export const selectPrivacyPolicyUpdateError = (state) => state.privacyPolicy.updateError;

