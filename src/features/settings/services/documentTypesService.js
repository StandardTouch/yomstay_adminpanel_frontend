/**
 * Document Types Service
 * Handles all document type-related API calls
 */
export class DocumentTypesService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List all document types
   * @param {Object} opts - Query parameters (page, limit, search, isActive, isRequired, sortBy, sortOrder)
   * @returns {Promise} API response
   */
  async listDocumentTypes(opts = {}) {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (opts.page !== undefined) {
      params.append("page", opts.page);
    }
    if (opts.limit !== undefined) {
      params.append("limit", opts.limit);
    }
    if (opts.search) {
      params.append("search", opts.search);
    }
    if (opts.isActive !== undefined) {
      params.append("isActive", opts.isActive);
    }
    if (opts.isRequired !== undefined) {
      params.append("isRequired", opts.isRequired);
    }
    if (opts.sortBy) {
      params.append("sortBy", opts.sortBy);
    }
    if (opts.sortOrder) {
      params.append("sortOrder", opts.sortOrder);
    }

    const queryString = params.toString();
    const url = `/admin/document-types${queryString ? `?${queryString}` : ""}`;

    return this.apiClient.get(url);
  }

  /**
   * Update document type
   * @param {string} id - Document type ID
   * @param {Object} updateData - Update payload (name, displayName, displayNameAr, description, descriptionAr, isActive, isRequired, order)
   * @returns {Promise} API response
   */
  async updateDocumentType(id, updateData) {
    if (!id) {
      throw new Error("Document type ID is required");
    }

    // Clean up undefined values
    const cleanedData = {};
    if (updateData.name !== undefined) {
      cleanedData.name = updateData.name;
    }
    if (updateData.displayName !== undefined) {
      cleanedData.displayName = updateData.displayName;
    }
    if (updateData.displayNameAr !== undefined) {
      cleanedData.displayNameAr = updateData.displayNameAr;
    }
    if (updateData.description !== undefined) {
      cleanedData.description = updateData.description;
    }
    if (updateData.descriptionAr !== undefined) {
      cleanedData.descriptionAr = updateData.descriptionAr;
    }
    if (updateData.isActive !== undefined) {
      cleanedData.isActive = updateData.isActive;
    }
    if (updateData.isRequired !== undefined) {
      cleanedData.isRequired = updateData.isRequired;
    }
    if (updateData.order !== undefined) {
      cleanedData.order = updateData.order;
    }

    return this.apiClient.put(`/admin/document-types/${id}`, cleanedData);
  }

  /**
   * Create document type
   * @param {Object} createData - Create payload (name, displayName, displayNameAr, description, descriptionAr, isActive, isRequired, order)
   * @returns {Promise} API response
   */
  async createDocumentType(createData) {
    // Clean up undefined values
    const cleanedData = {};
    if (createData.name !== undefined) {
      cleanedData.name = createData.name;
    }
    if (createData.displayName !== undefined) {
      cleanedData.displayName = createData.displayName;
    }
    if (createData.displayNameAr !== undefined) {
      cleanedData.displayNameAr = createData.displayNameAr;
    }
    if (createData.description !== undefined) {
      cleanedData.description = createData.description;
    }
    if (createData.descriptionAr !== undefined) {
      cleanedData.descriptionAr = createData.descriptionAr;
    }
    if (createData.isActive !== undefined) {
      cleanedData.isActive = createData.isActive;
    }
    if (createData.isRequired !== undefined) {
      cleanedData.isRequired = createData.isRequired;
    }
    if (createData.order !== undefined && createData.order !== null) {
      cleanedData.order = createData.order;
    }

    return this.apiClient.post("/admin/document-types", cleanedData);
  }

  /**
   * Delete document type
   * @param {string} id - Document type ID
   * @param {boolean} force - Force delete even if documents exist
   * @returns {Promise} API response
   */
  async deleteDocumentType(id, force = false) {
    if (!id) {
      throw new Error("Document type ID is required");
    }

    const params = new URLSearchParams();
    if (force) {
      params.append("force", "true");
    }

    const queryString = params.toString();
    const url = `/admin/document-types/${id}${queryString ? `?${queryString}` : ""}`;

    return this.apiClient.delete(url);
  }

  /**
   * Toggle document type active status
   * @param {string} id - Document type ID
   * @param {boolean} isActive - Optional: explicitly set isActive value; if omitted, toggles current value
   * @returns {Promise} API response
   */
  async toggleDocumentTypeActive(id, isActive) {
    if (!id) {
      throw new Error("Document type ID is required");
    }

    const payload = {};
    if (isActive !== undefined) {
      payload.isActive = isActive;
    }

    return this.apiClient.patch(`/admin/document-types/${id}/toggle-active`, payload);
  }

  /**
   * Reorder document types
   * @param {Array} orders - Array of {id, order} objects
   * @returns {Promise} API response
   */
  async reorderDocumentTypes(orders) {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      throw new Error("Orders array is required");
    }

    // Ensure each order has id and order
    const payload = {
      orders: orders.map(({ id, order }) => ({ id, order })),
    };

    return this.apiClient.patch("/admin/document-types/reorder", payload);
  }
}

