/**
 * Dashboard Service
 * Handles API calls for dashboard data
 */
export class DashboardService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get admin dashboard data
   * @param {Object} opts - Optional parameters
   * @param {number} opts.topHotelsLimit - Number of top hotels to return (1-20, default: 3)
   * @param {number} opts.recentBookingsLimit - Number of recent bookings to return (1-50, default: 10)
   * @returns {Promise} API response
   */
  async getDashboard(opts = {}) {
    const params = {};

    if (opts.topHotelsLimit !== undefined) {
      params.topHotelsLimit = opts.topHotelsLimit;
    }

    if (opts.recentBookingsLimit !== undefined) {
      params.recentBookingsLimit = opts.recentBookingsLimit;
    }

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/admin/dashboard", { params });
  }
}

