/**
 * Policies Service
 * Handles all policy-related API calls (cancellation policy, privacy policy, terms of service)
 */
export class PoliciesService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get cancellation policy
   * @returns {Promise} API response
   */
  async getCancellationPolicy() {
    return this.apiClient.get("/admin/cancellation-policy");
  }

  /**
   * Update cancellation policy
   * @param {Object} updateData - Update payload with englishHtml, arabicHtml, isActive
   * @returns {Promise} API response
   */
  async updateCancellationPolicy(updateData) {
    // Clean up undefined values
    const cleanedData = {};
    if (updateData.englishHtml !== undefined) {
      cleanedData.englishHtml = updateData.englishHtml;
    }
    if (updateData.arabicHtml !== undefined) {
      cleanedData.arabicHtml = updateData.arabicHtml;
    }
    if (updateData.isActive !== undefined) {
      cleanedData.isActive = updateData.isActive;
    }

    return this.apiClient.put("/admin/cancellation-policy", cleanedData);
  }

  /**
   * Get terms of use
   * @returns {Promise} API response
   */
  async getTermsOfUse() {
    return this.apiClient.get("/admin/terms-of-use");
  }

  /**
   * Update terms of use
   * @param {Object} updateData - Update payload with englishHtml, arabicHtml, isActive
   * @returns {Promise} API response
   */
  async updateTermsOfUse(updateData) {
    // Clean up undefined values
    const cleanedData = {};
    if (updateData.englishHtml !== undefined) {
      cleanedData.englishHtml = updateData.englishHtml;
    }
    if (updateData.arabicHtml !== undefined) {
      cleanedData.arabicHtml = updateData.arabicHtml;
    }
    if (updateData.isActive !== undefined) {
      cleanedData.isActive = updateData.isActive;
    }

    return this.apiClient.put("/admin/terms-of-use", cleanedData);
  }

  /**
   * Get privacy policy
   * @returns {Promise} API response
   */
  async getPrivacyPolicy() {
    return this.apiClient.get("/admin/privacy-policy");
  }

  /**
   * Update privacy policy
   * @param {Object} updateData - Update payload with englishHtml, arabicHtml, isActive
   * @returns {Promise} API response
   */
  async updatePrivacyPolicy(updateData) {
    // Clean up undefined values
    const cleanedData = {};
    if (updateData.englishHtml !== undefined) {
      cleanedData.englishHtml = updateData.englishHtml;
    }
    if (updateData.arabicHtml !== undefined) {
      cleanedData.arabicHtml = updateData.arabicHtml;
    }
    if (updateData.isActive !== undefined) {
      cleanedData.isActive = updateData.isActive;
    }

    return this.apiClient.put("/admin/privacy-policy", cleanedData);
  }
}

