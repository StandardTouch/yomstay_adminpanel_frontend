/**
 * Newsletter Service
 * Handles all newsletter-related API calls using axios
 */
export class NewsletterService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List newsletter subscriptions with pagination and search
   * @param {Object} filters - Query parameters
   * @param {number} filters.page - Page number for pagination
   * @param {number} filters.limit - Number of items per page
   * @param {string} filters.search - Search term for email (case-insensitive)
   * @returns {Promise} API response
   */
  async getNewsletterSubscriptions(filters = {}) {
    const { page, limit, search } = filters;

    const params = {
      page,
      limit,
      search: search && search.trim() ? search.trim() : undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/admin/newsletter-subscriptions", { params });
  }

  /**
   * Delete a newsletter subscription
   * @param {string} id - Newsletter subscription ID
   * @returns {Promise} API response
   */
  async deleteNewsletterSubscription(id) {
    if (!id) {
      throw new Error("Newsletter subscription ID is required");
    }

    return this.apiClient.delete(`/admin/newsletter-subscriptions/${id}`);
  }
}

