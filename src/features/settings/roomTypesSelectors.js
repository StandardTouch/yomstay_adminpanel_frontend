import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectRoomTypesState = (state) => state.roomTypes;
export const selectRoomTypes = (state) => state.roomTypes.roomTypes;
export const selectRoomTypesLoading = (state) => state.roomTypes.loading;
export const selectRoomTypesError = (state) => state.roomTypes.error;
export const selectRoomTypesPagination = (state) => state.roomTypes.pagination;
export const selectRoomTypesFilters = (state) => state.roomTypes.filters;
export const selectRoomTypesUpdating = (state) => state.roomTypes.updating;
export const selectRoomTypesUpdateError = (state) =>
  state.roomTypes.updateError;
export const selectRoomTypesCreating = (state) => state.roomTypes.creating;
export const selectRoomTypesCreateError = (state) =>
  state.roomTypes.createError;
export const selectRoomTypesDeletingIds = (state) =>
  state.roomTypes.deletingIds || {};
export const selectRoomTypesDeleteError = (state) =>
  state.roomTypes.deleteError;
export const selectRoomTypesReordering = (state) => state.roomTypes.reordering;
export const selectRoomTypesReorderError = (state) =>
  state.roomTypes.reorderError;
export const selectRoomTypesTogglingIds = (state) =>
  state.roomTypes.togglingIds || {};
export const selectRoomTypesToggleError = (state) =>
  state.roomTypes.toggleError;

// Computed selectors
export const selectActiveRoomTypes = createSelector(
  [selectRoomTypes],
  (roomTypes) => roomTypes.filter((roomType) => roomType.isActive === true)
);

export const selectInactiveRoomTypes = createSelector(
  [selectRoomTypes],
  (roomTypes) => roomTypes.filter((roomType) => roomType.isActive === false)
);

export const selectRoomTypesSortedByOrder = createSelector(
  [selectRoomTypes],
  (roomTypes) =>
    [...roomTypes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
);

export const selectRoomTypeById = createSelector(
  [selectRoomTypes, (state, roomTypeId) => roomTypeId],
  (roomTypes, roomTypeId) => roomTypes.find((rt) => rt.id === roomTypeId)
);
