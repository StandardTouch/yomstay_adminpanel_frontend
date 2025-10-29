/**
 * Locations Service
 * Handles location-related API calls (countries, states, cities)
 */
export class LocationsService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List countries
   * @param {string} search - Search term (optional)
   * @returns {Promise} API response
   */
  async listCountries(search = "") {
    const params = {};
    if (search) {
      params.search = search;
    }

    return this.apiClient.get("/location/countries", { params });
  }

  /**
   * List states
   * @param {string} countryId - Country ID (optional)
   * @param {string} search - Search term (optional)
   * @returns {Promise} API response
   */
  async listStates(countryId = "", search = "") {
    const params = {};
    if (countryId) {
      params.countryId = countryId;
    }
    if (search) {
      params.search = search;
    }

    return this.apiClient.get("/location/states", { params });
  }

  /**
   * List cities
   * @param {Object} params - Query parameters
   * @param {string} params.countryId - Country ID (optional)
   * @param {string} params.stateId - State ID (optional)
   * @param {string} params.search - Search term (optional)
   * @param {number} params.limit - Limit results (optional)
   * @returns {Promise} API response
   */
  async listCities(params = {}) {
    const { countryId, stateId, search, limit } = params;

    const queryParams = {};
    if (countryId) queryParams.countryId = countryId;
    if (stateId) queryParams.stateId = stateId;
    if (search) queryParams.search = search;
    if (limit) queryParams.limit = limit;

    return this.apiClient.get("/location/cities", { params: queryParams });
  }
}
