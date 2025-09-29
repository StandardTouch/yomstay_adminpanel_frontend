import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectLocationState = (state) => state.locations;

// Countries selectors
export const selectCountriesState = (state) => state.locations.countries;
export const selectCountriesData = (state) => state.locations.countries.data;
export const selectCountriesLoading = (state) =>
  state.locations.countries.loading;
export const selectCountriesError = (state) => state.locations.countries.error;
export const selectCountriesSearchTerm = (state) =>
  state.locations.countries.searchTerm;

// States selectors
export const selectStatesState = (state) => state.locations.states;
export const selectStatesData = (state) => state.locations.states.data;
export const selectStatesLoading = (state) => state.locations.states.loading;
export const selectStatesError = (state) => state.locations.states.error;
export const selectStatesSearchTerm = (state) =>
  state.locations.states.searchTerm;
export const selectStatesCountryId = (state) =>
  state.locations.states.countryId;

// Cities selectors
export const selectCitiesState = (state) => state.locations.cities;
export const selectCitiesData = (state) => state.locations.cities.data;
export const selectCitiesLoading = (state) => state.locations.cities.loading;
export const selectCitiesError = (state) => state.locations.cities.error;
export const selectCitiesSearchTerm = (state) =>
  state.locations.cities.searchTerm;
export const selectCitiesCountryId = (state) =>
  state.locations.cities.countryId;
export const selectCitiesStateId = (state) => state.locations.cities.stateId;

// Formatted selectors for countries
export const selectCountriesFormatted = createSelector(
  [selectCountriesData],
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

// Formatted selectors for states
export const selectStatesFormatted = createSelector(
  [selectStatesData],
  (states) => {
    if (!states || !Array.isArray(states)) return [];

    return states.map((state) => ({
      value: state.id,
      label: state.name,
      countryId: state.countryId,
      slug: state.slug,
    }));
  }
);

// Formatted selectors for cities
export const selectCitiesFormatted = createSelector(
  [selectCitiesData],
  (cities) => {
    if (!cities || !Array.isArray(cities)) return [];

    return cities.map((city) => ({
      value: city.id,
      label: city.name,
      countryId: city.countryId,
      stateId: city.stateId,
      slug: city.slug,
      breadcrumb: city.breadcrumb,
    }));
  }
);

// Filtered selectors for states by country
export const selectStatesByCountry = createSelector(
  [selectStatesFormatted, selectStatesCountryId],
  (states, countryId) => {
    if (!countryId) return states;
    return states.filter((state) => state.countryId === countryId);
  }
);

// Filtered selectors for cities by country and state
export const selectCitiesByLocation = createSelector(
  [selectCitiesFormatted, selectCitiesCountryId, selectCitiesStateId],
  (cities, countryId, stateId) => {
    let filteredCities = cities;

    if (countryId) {
      filteredCities = filteredCities.filter(
        (city) => city.countryId === countryId
      );
    }

    if (stateId) {
      filteredCities = filteredCities.filter(
        (city) => city.stateId === stateId
      );
    }

    return filteredCities;
  }
);

// Memoized selectors for search functionality
export const selectCountriesBySearch = createSelector(
  [selectCountriesFormatted, selectCountriesSearchTerm],
  (countries, searchTerm) => {
    if (!searchTerm) return countries;
    return countries.filter((country) =>
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

export const selectStatesBySearch = createSelector(
  [selectStatesFormatted, selectStatesSearchTerm],
  (states, searchTerm) => {
    if (!searchTerm) return states;
    return states.filter((state) =>
      state.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

export const selectCitiesBySearch = createSelector(
  [selectCitiesFormatted, selectCitiesSearchTerm],
  (cities, searchTerm) => {
    if (!searchTerm) return cities;
    return cities.filter((city) =>
      city.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

// Combined selectors for complex filtering
export const selectFilteredStates = createSelector(
  [selectStatesByCountry, selectStatesBySearch],
  (statesByCountry, statesBySearch) => {
    // If we have a country filter, use states by country, otherwise use search results
    return statesByCountry.length > 0 ? statesByCountry : statesBySearch;
  }
);

export const selectFilteredCities = createSelector(
  [selectCitiesByLocation, selectCitiesBySearch],
  (citiesByLocation, citiesBySearch) => {
    // If we have location filters, use cities by location, otherwise use search results
    return citiesByLocation.length > 0 ? citiesByLocation : citiesBySearch;
  }
);
