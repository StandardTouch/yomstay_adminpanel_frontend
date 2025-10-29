# YomStay Admin Panel - Redux & API Integration Patterns

This document provides specific patterns for the YomStay Admin Panel using **axios-based service layer**.

## Redux Integration Patterns

### 1. Standard Slice Structure

```javascript
// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.users) {
        throw new Error("API client is required");
      }

      // Call service method directly - filters are handled in the service
      const response = await apiClient.users.listUsers(filters);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async ({ userData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.users) {
        throw new Error("API client is required");
      }

      // Extract profileImage separately
      const { profileImage, ...userDataWithoutFile } = userData;

      // Call service method - handles FormData for multipart/form-data
      const response = await apiClient.users.createUser(
        userDataWithoutFile,
        profileImage
      );

      // Return only serializable data
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    error: null,
    filters: {
      search: "",
      role: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data?.users || action.payload.data || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // Add new user to the beginning of the list
        state.data.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, clearError } = usersSlice.actions;
export default usersSlice.reducer;
```

### 2. Selectors Pattern

```javascript
// src/features/users/usersSelectors.js
import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectUsersState = (state) => state.users;
export const selectUsers = (state) => state.users.data;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersTotal = (state) => state.users.total;
export const selectUsersPage = (state) => state.users.page;
export const selectUsersPageSize = (state) => state.users.pageSize;
export const selectUsersFilters = (state) => state.users.filters;

// Memoized computed selectors
export const selectFilteredUsers = createSelector(
  [selectUsers, selectUsersFilters],
  (users, filters) => {
    // Client-side filtering for additional criteria
    return users.filter((user) => {
      // Add any client-side filtering logic here
      return true;
    });
  }
);

export const selectUsersPagination = createSelector(
  [selectUsersTotal, selectUsersPage, selectUsersPageSize],
  (total, page, pageSize) => ({
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page * pageSize < total,
    hasPrevious: page > 1,
  })
);
```

## API Context Pattern

```javascript
// src/contexts/ApiContext.jsx
import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createApiClient } from "../services/config";
import { UsersService } from "../features/users/services/usersService";
import { HotelsService } from "../features/hotels/services/hotelsService";
import { AdminService } from "../features/hotels/services/adminService";
import { LocationsService } from "../features/locations/services/locationsService";
import { HotelRequestsService } from "../features/hotel_requests/services/hotelRequestsService";

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const apis = useMemo(() => {
    if (!isSignedIn || !isLoaded) {
      return null;
    }

    // Create authenticated axios instance
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "https://api.yomstay.com/api/v1";
    const apiClient = createApiClient(baseURL, getToken);

    // Return all service instances
    return {
      users: new UsersService(apiClient),
      hotels: new HotelsService(apiClient),
      admin: new AdminService(apiClient),
      locations: new LocationsService(apiClient),
      hotelRequests: new HotelRequestsService(apiClient),

      // Legacy support - keep apiClient for any remaining direct calls
      apiClient,
    };
  }, [getToken, isSignedIn, isLoaded]);

  return <ApiContext.Provider value={apis}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
```

## Component Integration Example

```javascript
// src/features/users/screens/UsersScreen.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import {
  fetchUsers,
  createUser,
  setFilters,
  setPage,
  clearError,
} from "../usersSlice";
import {
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersFilters,
  selectUsersPagination,
} from "../usersSelectors";
import { showSuccess, showError } from "../../../utils/toast";

const UsersScreen = () => {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const filters = useSelector(selectUsersFilters);
  const pagination = useSelector(selectUsersPagination);

  // Load users on mount and when dependencies change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchUsers({
          apiClient,
          ...filters,
          page: pagination.page,
          pageSize: pagination.pageSize,
        })
      );
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient, filters, pagination.page]);

  // Handle user creation
  const handleCreateUser = async (userData) => {
    try {
      const result = await dispatch(
        createUser({
          apiClient,
          ...userData,
        })
      ).unwrap();

      showSuccess("User created successfully");
      return result;
    } catch (error) {
      console.error("Failed to create user:", error);
      showError(error.message || "Failed to create user");
      throw error;
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      {/* Component content */}
    </div>
  );
};

export default UsersScreen;
```

## Service Layer Architecture

### Service Structure

Each feature has its own service class in `src/features/[feature]/services/[feature]Service.js`:

```javascript
// src/features/users/services/usersService.js
export class UsersService {
  constructor(apiClient) {
    this.apiClient = apiClient; // Authenticated axios instance
  }

  async listUsers(filters = {}) {
    // Handle query parameters, remove undefined values
    const params = { ...filters };
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/users", { params });
  }

  async createUser(userData, profileImage = null) {
    // Handle multipart/form-data for file uploads
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("firstName", userData.firstName);
    // ... other fields

    if (profileImage instanceof File) {
      formData.append("profileImage", profileImage);
    }

    return this.apiClient.post("/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}
```

### Axios Instance Configuration

```javascript
// src/services/config.js
import axios from "axios";

export const createApiClient = (baseURL, getToken) => {
  const apiClient = axios.create({
    baseURL,
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
  });

  // Request interceptor - Add auth token
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - Return data directly
  apiClient.interceptors.response.use(
    (response) => response.data, // Return response.data
    (error) => Promise.reject(error)
  );

  return apiClient;
};
```

## Key Rules for Service Usage

### ✅ CORRECT Patterns

```javascript
// 1. Always pass apiClient to thunks
dispatch(
  fetchUsers({
    search: "john",
    role: "user",
    apiClient, // REQUIRED
  })
);

// 2. Use service methods directly
const response = await apiClient.users.listUsers(filters);
const response = await apiClient.users.createUser(userData, profileImage);

// 3. Pass File objects directly for uploads
// Service handles FormData creation automatically
await apiClient.users.createUser(userData, profileImageFile);

// 4. Service methods handle parameter cleaning
// No need to remove undefined values manually - service does it
await apiClient.users.listUsers({ search, role, page });
```

### ❌ WRONG Patterns

```javascript
// 1. Missing apiClient
dispatch(
  fetchUsers({
    search: "john",
    role: "user", // Missing apiClient!
  })
);

// 2. Using axios directly instead of services
const response = await axios.get("/users");

// 3. Manually creating FormData (let service handle it)
const formData = new FormData();
await apiClient.users.createUser(formData); // Wrong pattern

// 4. Calling service with wrong parameters
await apiClient.users.createUser(userData.profileImage); // Wrong - pass separately
```

## Toast Integration

```javascript
// src/utils/toast.js
import { toast } from "sonner";

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showLoading = (message) => toast.loading(message);
export const updateToast = (toastId, type, message) => {
  toast[type](message, { id: toastId });
};

// Usage
import {
  showSuccess,
  showError,
  showLoading,
  updateToast,
} from "../../../utils/toast";

const handleAsyncOperation = async () => {
  const toastId = showLoading("Processing...");
  try {
    await someOperation();
    updateToast(toastId, "success", "Success!");
  } catch (error) {
    updateToast(toastId, "error", "Failed!");
  }
};
```

## Service Layer Pattern

### Creating a New Service

```javascript
// src/features/[feature]/services/[feature]Service.js
export class FeatureService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async listResources(filters = {}) {
    const params = { ...filters };
    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    return this.apiClient.get("/endpoint", { params });
  }

  async createResource(data) {
    return this.apiClient.post("/endpoint", data);
  }

  async updateResource(id, data) {
    return this.apiClient.put(`/endpoint/${id}`, data);
  }

  async deleteResource(id) {
    return this.apiClient.delete(`/endpoint/${id}`);
  }
}
```

### Adding Service to ApiContext

```javascript
// src/contexts/ApiContext.jsx
import { FeatureService } from "../features/[feature]/services/[feature]Service";

// In ApiProvider
return {
  // ... other services
  feature: new FeatureService(apiClient),
};
```

## Hotel Request Example

### Creating a Hotel Request

```javascript
// In Redux slice
export const createHotelRequest = createAsyncThunk(
  "hotelRequests/createHotelRequest",
  async ({ requestData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotelRequests) {
        throw new Error("API client is required");
      }

      const response = await apiClient.hotelRequests.createRequest(requestData);

      return {
        statusCode: response.statusCode,
        data: response.data,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create hotel request");
    }
  }
);

// In component
const handleSubmit = async (formData) => {
  try {
    const result = await dispatch(
      createHotelRequest({
        requestData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          name: formData.hotelName,
          starRating: formData.starRating,
          numberOfRooms: formData.numberOfRooms,
          address: formData.address,
          postalCode: formData.postalCode,
          countryId: formData.countryId,
          cityId: formData.cityId,
          stateId: formData.stateId,
          phone: formData.phone,
          jobFunction: formData.jobFunction,
          message: formData.message,
          managementCompany: formData.managementCompany,
        },
        apiClient,
      })
    ).unwrap();

    showSuccess("Hotel request submitted successfully!");
    return result;
  } catch (error) {
    showError(error.message || "Failed to submit hotel request");
  }
};
```

## Development Workflow

### New Feature Checklist

1. ✅ Create feature directory: `src/features/[feature]/`
2. ✅ Create service class: `src/features/[feature]/services/[feature]Service.js`
3. ✅ Add service to ApiContext
4. ✅ Add Redux slice with async thunks calling service methods
5. ✅ Create selectors file with memoized selectors
6. ✅ Add to root reducer
7. ✅ Create main screen component
8. ✅ Add feature-specific components
9. ✅ Add proper error handling
10. ✅ Test all functionality

This pattern ensures consistency across all features in the YomStay Admin Panel.
