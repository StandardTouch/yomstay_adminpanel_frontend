/**
 * Contact Requests Service
 * Handles all contact requests-related API calls using axios
 */
export class ContactRequestsService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List contact requests with pagination, status filter, and search
   * @param {Object} filters - Query parameters
   * @param {number} filters.page - Page number for pagination
   * @param {number} filters.limit - Number of items per page
   * @param {string} filters.status - Filter by status (open, in_progress, resolved, closed)
   * @param {string} filters.search - Search term for email or reservation number (case-insensitive)
   * @returns {Promise} API response
   */
  async getContactRequests(filters = {}) {
    const { page, limit, status, search } = filters;

    const params = {
      page,
      limit,
      status,
      search: search && search.trim() ? search.trim() : undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/admin/contact-requests", { params });
  }

  /**
   * Get a single contact request by ID
   * @param {string} id - Contact request ID
   * @returns {Promise} API response
   */
  async getContactRequestById(id) {
    if (!id) {
      throw new Error("Contact request ID is required");
    }

    return this.apiClient.get(`/admin/contact-requests/${id}`);
  }

  /**
   * Update contact request status
   * @param {string} id - Contact request ID
   * @param {string} status - New status (open, in_progress, resolved, closed)
   * @returns {Promise} API response
   */
  async updateContactRequestStatus(id, status) {
    if (!id) {
      throw new Error("Contact request ID is required");
    }

    if (!status) {
      throw new Error("Status is required");
    }

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    return this.apiClient.put(`/admin/contact-requests/${id}/status`, { status });
  }
}

