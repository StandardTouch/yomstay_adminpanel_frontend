import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectDocumentTypesState = (state) => state.documentTypes;
export const selectDocumentTypes = (state) => state.documentTypes.documentTypes;
export const selectDocumentTypesLoading = (state) => state.documentTypes.loading;
export const selectDocumentTypesError = (state) => state.documentTypes.error;
export const selectDocumentTypesPagination = (state) => state.documentTypes.pagination;
export const selectDocumentTypesFilters = (state) => state.documentTypes.filters;

// Memoized selector for document types with locale
export const selectDocumentTypesWithLocale = createSelector(
  [selectDocumentTypes, selectDocumentTypesFilters],
  (documentTypes, filters) => {
    return documentTypes.map((docType) => {
      const locale = filters.locale || "en";
      return {
        ...docType,
        displayName: locale === "ar" && docType.ar?.displayName 
          ? docType.ar.displayName 
          : docType.displayName,
        description: locale === "ar" && docType.ar?.description 
          ? docType.ar.description 
          : (docType.description || ""),
      };
    });
  }
);

