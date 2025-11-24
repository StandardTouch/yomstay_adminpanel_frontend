/**
 * Amenities Service
 * Handles all global amenities-related API calls using axios
 */
export class AmenitiesService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List amenities with filters and pagination
   * Returns both English and Arabic values in a single response
   * @param {Object} filters - Query parameters
   * @param {number} filters.page - Page number for pagination
   * @param {number} filters.limit - Number of items per page
   * @param {string} filters.search - Search term for name or displayName
   * @param {string} filters.type - Filter by amenity type (room, hotel)
   * @returns {Promise} API response
   */
  async listAmenities(filters = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      type,
    } = filters;

    const params = {
      page,
      limit,
      search,
      type,
    };

    // Remove undefined and empty string values
    Object.keys(params).forEach(
      (key) =>
        (params[key] === undefined || params[key] === "") && delete params[key]
    );

    return this.apiClient.get("/admin/amenities", { params });
  }

  /**
   * Create a new amenity
   * @param {Object} amenityData - Amenity create data
   * @param {string} amenityData.name - Unique identifier for the amenity (required, lowercase, no spaces)
   * @param {string} amenityData.displayName - English display name (required)
   * @param {string} amenityData.type - Type of amenity (required: room, hotel)
   * @param {string} amenityData.description - English description (optional)
   * @param {string} amenityData.displayNameAr - Arabic display name (optional)
   * @param {string} amenityData.descriptionAr - Arabic description (optional)
   * @param {string} amenityData.icon - Icon identifier (optional)
   * @returns {Promise} API response
   */
  async createAmenity(amenityData) {
    if (!amenityData) {
      throw new Error("Amenity data is required");
    }

    const {
      name,
      displayName,
      type,
      description,
      displayNameAr,
      descriptionAr,
      icon,
    } = amenityData;

    // Validate required fields
    if (!name || !displayName || !type) {
      throw new Error(
        "Missing required fields: name, displayName, and type are required"
      );
    }

    // Build payload
    const payload = {
      name,
      displayName,
      type,
    };

    // Add optional fields
    if (description !== undefined) {
      payload.description = description || null;
    }
    if (displayNameAr) {
      payload.displayNameAr = displayNameAr;
    }
    if (descriptionAr !== undefined) {
      payload.descriptionAr = descriptionAr || null;
    }
    if (icon !== undefined) {
      payload.icon = icon || null;
    }

    return this.apiClient.post("/admin/amenities", payload);
  }

  /**
   * Update an existing amenity
   * @param {string} id - Amenity ID
   * @param {Object} amenityData - Amenity update data
   * @param {string} amenityData.name - Unique identifier for the amenity
   * @param {string} amenityData.displayName - English display name
   * @param {string} amenityData.description - English description (optional)
   * @param {string} amenityData.displayNameAr - Arabic display name (optional)
   * @param {string} amenityData.descriptionAr - Arabic description (optional)
   * @param {string} amenityData.icon - Icon identifier (optional)
   * @param {string} amenityData.type - Type of amenity (room, hotel)
   * @param {string} locale - Language locale for input (en, ar) - optional
   * @returns {Promise} API response
   */
  async updateAmenity(id, amenityData, locale = "en") {
    if (!id) {
      throw new Error("Amenity ID is required");
    }

    if (!amenityData) {
      throw new Error("Amenity data is required");
    }

    const {
      name,
      displayName,
      description,
      displayNameAr,
      descriptionAr,
      icon,
      type,
    } = amenityData;

    // Build payload - only include defined fields
    const payload = {};

    if (name !== undefined) payload.name = name;
    if (displayName !== undefined) payload.displayName = displayName;
    if (description !== undefined) payload.description = description || null;
    if (displayNameAr !== undefined) payload.displayNameAr = displayNameAr || null;
    if (descriptionAr !== undefined) payload.descriptionAr = descriptionAr || null;
    if (icon !== undefined) payload.icon = icon || null;
    if (type !== undefined) payload.type = type;

    // Build query params
    const params = {};
    if (locale && locale !== "en") {
      params.locale = locale;
    }

    return this.apiClient.put(`/admin/amenities/${id}`, payload, { params });
  }

  /**
   * Delete an amenity
   * @param {string} id - Amenity ID
   * @returns {Promise} API response
   */
  async deleteAmenity(id) {
    if (!id) {
      throw new Error("Amenity ID is required");
    }

    return this.apiClient.delete(`/admin/amenities/${id}`);
  }
}

