/**
 * Users Service
 * Handles all user-related API calls using axios
 */
export class UsersService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List users with filters and pagination
   * @param {Object} filters - Query parameters
   * @returns {Promise} API response
   */
  async listUsers(filters = {}) {
    const {
      search,
      role,
      hasProfileImage,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      page = 1,
      pageSize = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      syncStatus,
    } = filters;

    const params = {
      search,
      role,
      hasProfileImage,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      page,
      pageSize,
      sortBy,
      sortOrder,
      syncStatus: syncStatus && syncStatus !== "all" ? syncStatus : undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/users", { params });
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.email - Email (required)
   * @param {string} userData.firstName - First name (required)
   * @param {string} userData.lastName - Last name (required)
   * @param {string} userData.password - Password (required)
   * @param {string} userData.role - Role (required)
   * @param {string} userData.phone - Phone (optional)
   * @param {string} userData.hotelId - Hotel ID (optional)
   * @param {File} profileImage - Profile image file (optional)
   * @returns {Promise} API response
   */
  async createUser(userData, profileImage = null) {
    const { email, firstName, lastName, password, role, phone, hotelId } =
      userData;

    // Validate required fields
    if (!email || !firstName || !lastName || !password || !role) {
      throw new Error(
        "Missing required fields: email, firstName, lastName, password, role"
      );
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("password", password);
    formData.append("role", role);

    if (phone) formData.append("phone", phone);
    if (hotelId) formData.append("hotelId", hotelId);
    if (profileImage && profileImage instanceof File) {
      formData.append("profileImage", profileImage);
    }

    return this.apiClient.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @param {File} profileImage - Profile image file (optional)
   * @returns {Promise} API response
   */
  async updateUser(id, userData, profileImage = null) {
    if (!id) {
      throw new Error("User ID is required");
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add user data fields
    if (userData.email) formData.append("email", userData.email);
    if (userData.firstName) formData.append("firstName", userData.firstName);
    if (userData.lastName) formData.append("lastName", userData.lastName);
    if (userData.phone) formData.append("phone", userData.phone);
    if (userData.role) formData.append("role", userData.role);

    // Handle ownedHotels array
    if (userData.ownedHotels && Array.isArray(userData.ownedHotels)) {
      userData.ownedHotels.forEach((hotelId, index) => {
        formData.append(`ownedHotels[${index}]`, hotelId);
      });
    }

    // Handle hotelStaffs array
    if (userData.hotelStaffs && Array.isArray(userData.hotelStaffs)) {
      userData.hotelStaffs.forEach((staff, index) => {
        formData.append(`hotelStaffs[${index}][hotelId]`, staff.hotelId);
        formData.append(`hotelStaffs[${index}][role]`, staff.role || "staff");
        formData.append(
          `hotelStaffs[${index}][isActive]`,
          staff.isActive !== undefined ? staff.isActive : true
        );
      });
    }

    // Add profile image if provided
    if (profileImage && profileImage instanceof File) {
      formData.append("profileImage", profileImage);
    }

    return this.apiClient.put(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Delete a user
   * @param {string} userId - User ID to delete
   * @returns {Promise} API response
   */
  async deleteUser(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return this.apiClient.delete(`/users/${userId}`);
  }

  /**
   * Sync users with external system
   * @param {Object} options - Sync options
   * @param {boolean} options.forceUpdate - Force update flag
   * @param {boolean} options.dryRun - Dry run flag
   * @returns {Promise} API response
   */
  async syncUsers(options = {}) {
    const { forceUpdate = false, dryRun = false } = options;

    return this.apiClient.post("/users/sync", {
      forceUpdate,
      dryRun,
    });
  }
}
