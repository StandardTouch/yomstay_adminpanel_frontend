import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectCountriesState = (state) => state.countries;
export const selectCountries = (state) => state.countries.data;
export const selectCountriesLoading = (state) => state.countries.loading;
export const selectCountriesError = (state) => state.countries.error;
export const selectCountriesSearchTerm = (state) => state.countries.searchTerm;

// Computed selectors
export const selectCountriesFormatted = createSelector(
  [selectCountries],
  (countries) => {
    if (!countries || !Array.isArray(countries)) return [];

    return countries.map((country) => ({
      value: country.id,
      label: country.name,
      iso2: country.iso2,
      iso3: country.iso3,
      slug: country.slug,
    }));
  }
);

export const selectCountriesBySearch = createSelector(
  [selectCountries, selectCountriesSearchTerm],
  (countries, searchTerm) => {
    if (!countries || !Array.isArray(countries)) return [];

    if (!searchTerm) return countries;

    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

export const selectCountriesFormattedBySearch = createSelector(
  [selectCountriesBySearch],
  (countries) => {
    if (!countries || !Array.isArray(countries)) return [];

    return countries.map((country) => ({
      value: country.id,
      label: country.name,
      iso2: country.iso2,
      iso3: country.iso3,
      slug: country.slug,
    }));
  }
);
