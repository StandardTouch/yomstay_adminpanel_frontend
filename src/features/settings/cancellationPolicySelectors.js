// Basic selectors
export const selectCancellationPolicyState = (state) => state.cancellationPolicy;
export const selectCancellationPolicy = (state) => state.cancellationPolicy.policy;
export const selectCancellationPolicyLoading = (state) => state.cancellationPolicy.loading;
export const selectCancellationPolicyError = (state) => state.cancellationPolicy.error;
export const selectCancellationPolicyUpdating = (state) => state.cancellationPolicy.updating;
export const selectCancellationPolicyUpdateError = (state) => state.cancellationPolicy.updateError;

