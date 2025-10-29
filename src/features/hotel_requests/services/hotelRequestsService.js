/**
 * Hotel Requests Service
 * Handles hotel request-related API calls
 */
export class HotelRequestsService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List hotel requests with filters
   * @param {Object} filters - Query parameters (optional)
   * @returns {Promise} API response
   */
  async listRequests(filters = {}) {
    const params = { ...filters };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/hotel-requests", { params });
  }

  /**
   * Create a new hotel request
   * @param {Object} requestData - Hotel request data
   * @param {string} requestData.firstName - First name (required)
   * @param {string} requestData.lastName - Last name (required)
   * @param {string} requestData.email - Email (required)
   * @param {string} requestData.name - Hotel name (required)
   * @param {string} requestData.starRating - Star rating (required)
   * @param {string} requestData.numberOfRooms - Number of rooms (required)
   * @param {string} requestData.address - Address (required)
   * @param {string} requestData.postalCode - Postal code (required)
   * @param {string} requestData.countryId - Country ID (required)
   * @param {string} requestData.cityId - City ID (required)
   * @param {string} requestData.jobFunction - Job function (optional)
   * @param {string} requestData.phone - Phone number (optional)
   * @param {string} requestData.managementCompany - Management company flag (optional)
   * @param {string} requestData.message - Additional message (optional)
   * @param {string} requestData.stateId - State ID (optional)
   * @returns {Promise} API response
   */
  async createRequest(requestData) {
    if (!requestData) {
      throw new Error("Hotel request data is required");
    }

    // Validate required fields
    const required = [
      "firstName",
      "lastName",
      "email",
      "name",
      "starRating",
      "numberOfRooms",
      "address",
      "postalCode",
      "countryId",
      "cityId",
    ];

    for (const field of required) {
      if (!requestData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Build payload with only provided fields
    const payload = {
      firstName: requestData.firstName,
      lastName: requestData.lastName,
      email: requestData.email,
      name: requestData.name,
      starRating: requestData.starRating,
      numberOfRooms: requestData.numberOfRooms,
      address: requestData.address,
      postalCode: requestData.postalCode,
      countryId: requestData.countryId,
      cityId: requestData.cityId,
    };

    // Add optional fields
    if (requestData.jobFunction) payload.jobFunction = requestData.jobFunction;
    if (requestData.phone) payload.phone = requestData.phone;
    if (requestData.managementCompany)
      payload.managementCompany = requestData.managementCompany;
    if (requestData.message) payload.message = requestData.message;
    if (requestData.stateId) payload.stateId = requestData.stateId;

    return this.apiClient.post("/hotel-requests", payload);
  }

  /**
   * Handle hotel request (approve, reject, or mark as needs_completion)
   * @param {string} id - Request ID
   * @param {string} status - Status: 'approved', 'rejected', or 'needs_completion'
   * @returns {Promise} API response
   */
  async handleRequest(id, status) {
    if (!id) {
      throw new Error("Request ID is required");
    }

    if (
      !status ||
      !["approved", "rejected", "needs_completion"].includes(status)
    ) {
      throw new Error(
        "Status must be 'approved', 'rejected', or 'needs_completion'"
      );
    }

    return this.apiClient.patch(`/hotel-requests/${id}/approve-or-reject`, {
      status,
    });
  }
}
