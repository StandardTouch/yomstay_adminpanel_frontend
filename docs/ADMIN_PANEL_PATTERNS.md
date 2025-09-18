# YomStay Admin Panel - Redux & API Integration Patterns

This document extends the CLIENT_USAGE_GUIDE.md with specific patterns for the YomStay Admin Panel.

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

      // Build opts object for StandardTouch API
      const opts = {
        search: filters.search,
        role: filters.role,
        page: filters.page,
        pageSize: filters.pageSize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        hasProfileImage: filters.hasProfileImage,
        createdAfter: filters.createdAfter,
        hotelId: filters.hotelId,
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
  async (userData, { rejectWithValue }) => {
    try {
      const {
        apiClient,
        email,
        firstName,
        lastName,
        password,
        role,
        ...options
      } = userData;

      if (!apiClient?.users) {
        throw new Error("API client is required");
      }

      // Build opts object for optional parameters
      const opts = {};
      if (options.phone) opts.phone = options.phone;
      if (options.profileImage instanceof File) {
        opts.profileImage = options.profileImage;
      }

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
import {
  ApiClient,
  UserApi,
  HotelApi,
  HotelAmenityApi,
  LocationApi,
  CurrencyApi,
  WebhooksApi,
} from "@StandardTouch/yomstay_api";

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const { getToken } = useAuth();

  const apiClient = useMemo(() => {
    const client = new ApiClient(process.env.REACT_APP_API_URL);

    // Set up token refresh
    const originalCallApi = client.callApi;
    client.callApi = async function (...args) {
      try {
        const token = await getToken();
        if (token) {
          this.authentications.bearerAuth.accessToken = token;
        }
      } catch (error) {
        console.warn("Failed to refresh token:", error);
      }
      return originalCallApi.apply(this, args);
    };

    return {
      users: new UserApi(client),
      hotels: new HotelApi(client),
      hotelAmenities: new HotelAmenityApi(client),
      locations: new LocationApi(client),
      currencies: new CurrencyApi(client),
      webhooks: new WebhooksApi(client),
      // Add more API instances as needed
    };
  }, [getToken]);

  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
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

## Key Rules for Generated Client Usage

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

// 2. Use generated client methods directly
const response = await apiClient.users.usersPost(
  email, // Required parameter
  firstName, // Required parameter
  lastName, // Required parameter
  password, // Required parameter
  role, // Required parameter
  opts // Options object with optional fields
);

// 3. Pass File objects directly for uploads
const opts = {};
if (profileImage instanceof File) {
  opts.profileImage = profileImage; // Let client handle multipart
}

// 4. Build opts object properly
const opts = {
  search: filters.search,
  role: filters.role,
  page: filters.page,
};
// Remove undefined values
Object.keys(opts).forEach((key) => opts[key] === undefined && delete opts[key]);
```

### ❌ WRONG Patterns

```javascript
// 1. Missing apiClient
dispatch(fetchUsers({
  search: "john",
  role: "user", // Missing apiClient!
}));

// 2. Using raw callApi instead of generated methods
const response = await apiClient.users.apiClient.callApi(/*...*/);

// 3. Manually creating FormData
const formData = new FormData();
formData.append('profileImage', profileImage);

// 4. Setting Content-Type manually for file uploads
headers: { 'Content-Type': 'multipart/form-data' }
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

## Development Workflow

### New Feature Checklist

1. ✅ Create feature directory: `src/features/[feature]/`
2. ✅ Add Redux slice with async thunks
3. ✅ Create selectors file with memoized selectors
4. ✅ Add to root reducer
5. ✅ Create main screen component
6. ✅ Add feature-specific components
7. ✅ Integrate with API context
8. ✅ Add proper error handling
9. ✅ Test all functionality

This pattern ensures consistency across all features in the YomStay Admin Panel.
