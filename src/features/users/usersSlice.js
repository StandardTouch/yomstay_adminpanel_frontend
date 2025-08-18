import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching users with query parameters
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Extract API client from query params
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.users) {
        throw new Error("API client is required");
      }

      // Extract filter parameters
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

      // Use the StandardTouch UserApi usersGet method with options object
      const opts = {
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
      Object.keys(opts).forEach(
        (key) => opts[key] === undefined && delete opts[key]
      );

      const response = await apiClient.users.usersGet(opts);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async ({ userData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient) {
        throw new Error("API client is required");
      }

      const {
        email,
        firstName,
        lastName,
        password,
        role,
        phone,
        profileImage,
      } = userData;

      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add user data fields
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("password", password);
      formData.append("role", role);
      if (phone) formData.append("phone", phone);

      // Add profile image if provided
      if (profileImage && profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      }

      // Use the StandardTouch UserApi usersPost method
      // Signature: usersPost(email, firstName, lastName, password, role, opts)
      const opts = {
        phone,
        profileImage,
      };

      const response = await apiClient.users.usersPost(
        email,
        firstName,
        lastName,
        password,
        role,
        opts
      );
      return response;
    } catch (error) {
      console.error("Error creating user:", error);

      // Handle specific error types
      if (
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        return rejectWithValue("Invalid user data. Please check your input.");
      }

      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      return rejectWithValue(error.message || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData, profileImage, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient) {
        throw new Error("API client is required");
      }

      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add user data fields
      if (userData.email) formData.append("email", userData.email);
      if (userData.firstName) formData.append("firstName", userData.firstName);
      if (userData.lastName) formData.append("lastName", userData.lastName);
      if (userData.phone) formData.append("phone", userData.phone);
      if (userData.role) formData.append("role", userData.role);

      // Add profile image if provided
      if (profileImage && profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      }

      // Use the StandardTouch UserApi usersIdPut method
      const response = await apiClient.users.usersIdPut(id, formData);
      return response;
    } catch (error) {
      console.error("Error updating user:", error);

      // Handle specific error types
      if (
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        return rejectWithValue("Invalid user data. Please check your input.");
      }

      if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("User not found.");
      }

      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ userId, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient) {
        throw new Error("API client is required");
      }

      // Use the StandardTouch UserApi usersIdDelete method
      await apiClient.users.usersIdDelete(userId);
      return userId; // Return the deleted user ID
    } catch (error) {
      console.error("Error deleting user:", error);
      return rejectWithValue(error.message || "Failed to delete user");
    }
  }
);

export const syncUsers = createAsyncThunk(
  "users/syncUsers",
  async ({ syncOptions = {}, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient) {
        throw new Error("API client is required");
      }

      const { forceUpdate = false, dryRun = false } = syncOptions;

      // Use the StandardTouch UserApi usersSyncPost method
      const response = await apiClient.users.usersSyncPost({
        forceUpdate,
        dryRun,
      });
      return response;
    } catch (error) {
      console.error("Error syncing users:", error);

      // If it's an authentication error, provide a helpful message
      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page and syncing again."
        );
      }

      return rejectWithValue(error.message || "Failed to sync users");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
    currentUser: null,
    // Pagination state
    pagination: {
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    },
    // Filter state - updated with new filters
    filters: {
      search: "",
      role: "",
      hasProfileImage: undefined,
      createdAfter: "",
      createdBefore: "",
      updatedAfter: "",
      updatedBefore: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      syncStatus: "all", // New filter for sync status
    },
    // Sync summary state
    syncSummary: {
      totalUsers: 0,
      syncedUsers: 0,
      unsyncedUsers: 0,
    },
    // Sync operation state
    syncLoading: false,
    syncError: null,
    lastSyncResult: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateUserInList: (state, action) => {
      const { id, updates } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },
    // Update filters
    setUserFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Update pagination
    setUserPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // Clear filters
    clearUserFilters: (state) => {
      state.filters = {
        search: "",
        role: undefined,
        hasProfileImage: undefined,
        createdAfter: "",
        createdBefore: "",
        updatedAfter: "",
        updatedBefore: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        syncStatus: "all",
      };
    },
    // Clear sync error
    clearSyncError: (state) => {
      state.syncError = null;
    },
    // Clear last sync result
    clearLastSyncResult: (state) => {
      state.lastSyncResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with sync status
        if (action.payload && action.payload.success && action.payload.data) {
          const responseData = action.payload.data;
          state.users = responseData.users || [];
          state.pagination = {
            total: responseData.total || 0,
            page: responseData.page || 1,
            pageSize: responseData.pageSize || 20,
            totalPages: Math.ceil(
              (responseData.total || 0) / (responseData.pageSize || 20)
            ),
          };
          // Update sync summary
          if (responseData.syncSummary) {
            state.syncSummary = {
              totalUsers: responseData.syncSummary.totalUsers || 0,
              syncedUsers: responseData.syncSummary.syncedUsers || 0,
              unsyncedUsers: responseData.syncSummary.unsyncedUsers || 0,
            };
          }
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          const userData = action.payload.data;
          state.users.push(userData);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          const userData = action.payload.data;

          console.log(
            "UpdateUser Response:",
            JSON.stringify(action.payload, null, 2)
          );
          console.log(
            "UserData from response:",
            JSON.stringify(userData, null, 2)
          );

          // Find the user in the state by matching either clerkUser.id or localUser.id
          const index = state.users.findIndex((user) => {
            const clerkId = user.clerkUser?.id;
            const localId = user.localUser?.id;
            const responseClerkId = userData.clerkUser?.id;
            const responseLocalId = userData.localUser?.id;
            const responseId = userData.id;

            console.log("Comparing IDs:", {
              userClerkId: clerkId,
              userLocalId: localId,
              responseClerkId,
              responseLocalId,
              responseId,
            });

            return (
              clerkId === responseClerkId ||
              localId === responseLocalId ||
              clerkId === responseId ||
              localId === responseId
            );
          });

          console.log("Found user at index:", index);
          console.log(
            "Original user in state:",
            JSON.stringify(state.users[index], null, 2)
          );

          if (index !== -1) {
            // Extract the new profile image URL from the Clerk response
            const newProfileImageUrl =
              userData._raw?.profile_image_url ||
              userData.profileImageUrl ||
              userData.imageUrl;

            console.log("New Profile Image URL:", newProfileImageUrl);

            // Update the user with new data, preserving the existing structure
            const updatedUser = {
              ...state.users[index],
              // Update the localUser profileImageUrl with the new image
              localUser: {
                ...state.users[index].localUser,
                profileImageUrl:
                  newProfileImageUrl ||
                  state.users[index].localUser?.profileImageUrl,
              },
              // Also update the clerkUser profileImageUrl if it exists
              clerkUser: {
                ...state.users[index].clerkUser,
                profileImageUrl:
                  newProfileImageUrl ||
                  state.users[index].clerkUser?.profileImageUrl,
              },
            };

            console.log("Profile Image Debug:", {
              originalProfileImageUrl:
                state.users[index].localUser?.profileImageUrl,
              newProfileImageUrl: newProfileImageUrl,
              finalProfileImageUrl: updatedUser.localUser?.profileImageUrl,
              userDataKeys: Object.keys(userData),
              userDataLocalUserKeys: userData.localUser
                ? Object.keys(userData.localUser)
                : "No localUser",
            });

            console.log("Updated user:", JSON.stringify(updatedUser, null, 2));
            state.users[index] = updatedUser;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sync Users
      .addCase(syncUsers.pending, (state) => {
        state.syncLoading = true;
        state.syncError = null;
      })
      .addCase(syncUsers.fulfilled, (state, action) => {
        state.syncLoading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          state.lastSyncResult = action.payload.data;
          // Update sync summary if provided
          if (action.payload.data.summary) {
            state.syncSummary = {
              totalUsers: action.payload.data.summary.totalProcessed || 0,
              syncedUsers:
                (action.payload.data.summary.totalProcessed || 0) -
                (action.payload.data.summary.failed || 0),
              unsyncedUsers: action.payload.data.summary.failed || 0,
            };
          }
        }
      })
      .addCase(syncUsers.rejected, (state, action) => {
        state.syncLoading = false;
        state.syncError = action.payload;
      });
  },
});

export const {
  clearUsersError,
  setCurrentUser,
  updateUserInList,
  setUserFilters,
  setUserPagination,
  clearUserFilters,
  clearSyncError,
  clearLastSyncResult,
} = usersSlice.actions;
export default usersSlice.reducer;
