import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectConditionsState = (state) => state.conditions;
export const selectConditions = (state) => state.conditions.conditions;
export const selectConditionsLoading = (state) => state.conditions.loading;
export const selectConditionsError = (state) => state.conditions.error;
export const selectConditionsTotalCount = (state) => state.conditions.totalCount;
export const selectConditionsFilters = (state) => state.conditions.filters;

// Individual filter selectors
export const selectConditionsActiveFilter = (state) =>
  state.conditions.filters.isActive;
export const selectConditionsRequiredFilter = (state) =>
  state.conditions.filters.isRequired;
export const selectConditionsSortBy = (state) => state.conditions.filters.sortBy;
export const selectConditionsSortOrder = (state) =>
  state.conditions.filters.sortOrder;
export const selectConditionsLocale = (state) => state.conditions.filters.locale;
export const selectConditionsSearch = (state) => state.conditions.filters.search;

// Memoized computed selectors
export const selectFilteredConditions = createSelector(
  [selectConditions, selectConditionsActiveFilter, selectConditionsRequiredFilter],
  (conditions, isActiveFilter, isRequiredFilter) => {
    let filtered = conditions;

    // Filter by active status
    if (isActiveFilter !== undefined) {
      filtered = filtered.filter((condition) => condition.isActive === isActiveFilter);
    }

    // Filter by required status
    if (isRequiredFilter !== undefined) {
      filtered = filtered.filter(
        (condition) => condition.isRequired === isRequiredFilter
      );
    }

    return filtered;
  }
);

// Separate active and inactive conditions
export const selectActiveConditions = createSelector(
  [selectConditions],
  (conditions) => conditions.filter((condition) => condition.isActive)
);

export const selectInactiveConditions = createSelector(
  [selectConditions],
  (conditions) => conditions.filter((condition) => !condition.isActive)
);

// Separate required and optional conditions
export const selectRequiredConditions = createSelector(
  [selectConditions],
  (conditions) => conditions.filter((condition) => condition.isRequired)
);

export const selectOptionalConditions = createSelector(
  [selectConditions],
  (conditions) => conditions.filter((condition) => !condition.isRequired)
);

// Sort options
export const selectSortOptions = () => [
  { value: "sortOrder", label: "Sort Order" },
  { value: "name", label: "Name" },
  { value: "displayName", label: "Display Name" },
  { value: "createdAt", label: "Created Date" },
];

// Sort order options
export const selectSortOrderOptions = () => [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

