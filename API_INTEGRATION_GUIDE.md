# YomStay Admin Panel API Integration Guide

This guide explains how to integrate API endpoints into the YomStay Admin Panel using the StandardTouch API client.

## Architecture Overview

The application uses a **Context Provider** pattern with the StandardTouch generated API client for all API communications. This provides:

- ✅ Centralized API management
- ✅ Automatic Clerk authentication
- ✅ Type safety from generated client
- ✅ No prop drilling required
- ✅ Consistent error handling

## File Structure

```
src/
├── contexts/
│   ├── ApiContext.jsx           # API Context Provider
│   └── ApiErrorBoundary.jsx     # Error boundary for API failures
├── features/
│   └── [feature]/
│       ├── screens/             # Main feature screens
│       ├── components/          # Feature-specific components
│       ├── [feature]Slice.js    # Redux slice with async thunks
│       └── [feature]Selectors.js # Redux selectors
└── main.jsx                     # App setup with providers
```

## Core Implementation Steps

### 1. API Context Setup (Already Done)

The `ApiContext` provides access to all StandardTouch API instances:

```javascript
// src/contexts/ApiContext.jsx
import { useApi } from "../contexts/ApiContext";

const MyComponent = () => {
  const api = useApi(); // Get all API instances

  // Available APIs:
  // api.users, api.hotels, api.hotelAmenities,
  // api.locations, api.currencies, api.webhooks

  return <div>...</div>;
};
```

### 2. Redux Slice Pattern

For each feature, create async thunks that use the API client:

```javascript
// src/features/[feature]/[feature]Slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk(
  "[feature]/fetchData",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.[apiName]) {
        throw new Error("API client is required");
      }

      // Call the StandardTouch API method
      const response = await apiClient.[apiName].[methodName](options);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch data");
    }
  }
);

const featureSlice = createSlice({
  name: "[feature]",
  initialState: {
    data: [],
    loading: false,
    error: null,
    // Add other state as needed
  },
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default featureSlice.reducer;
```

### 3. Component Integration

In your screen components, use the API context:

```javascript
// src/features/[feature]/screens/[Feature]Screen.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { fetchData } from "../[feature]Slice";

const FeatureScreen = () => {
  const dispatch = useDispatch();
  const { isSignedIn, isLoaded } = useAuth();
  const apiClient = useApi();

  const { data, loading, error } = useSelector(state => state.[feature]);

  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(fetchData({
        // Query parameters
        page: 1,
        pageSize: 20,
        apiClient, // Always pass the API client
      }));
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render your data */}
    </div>
  );
};

export default FeatureScreen;
```

## Implementation Template

When given a Swagger documentation and function name, follow this template:

### Step 1: Identify the API Method

From the Swagger docs, determine:

- **HTTP Method**: GET, POST, PUT, DELETE
- **Endpoint**: `/hotels`, `/users`, etc.
- **Parameters**: Query params, body, path params
- **Response Structure**: Success and error formats

### Step 2: Find the StandardTouch Method

StandardTouch API methods follow this pattern:

- **GET** `/hotels` → `api.hotels.hotelsGet(opts)`
- **POST** `/hotels` → `api.hotels.hotelsPost(data, opts)`
- **PUT** `/hotels/{id}` → `api.hotels.hotelsIdPut(id, data, opts)`
- **DELETE** `/hotels/{id}` → `api.hotels.hotelsIdDelete(id, opts)`

### Step 3: Create the Redux Async Thunk

```javascript
export const [functionName] = createAsyncThunk(
  "[feature]/[functionName]",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.[apiInstance]) {
        throw new Error("API client is required");
      }

      // Build options object from Swagger parameters
      const opts = {
        // Map all query/body parameters here
        param1: filters.param1,
        param2: filters.param2,
        // ... etc
      };

      // Remove undefined values
      Object.keys(opts).forEach(key =>
        opts[key] === undefined && delete opts[key]
      );

      // Call the StandardTouch API method
      const response = await apiClient.[apiInstance].[methodName](opts);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to [action description]");
    }
  }
);
```

### Step 4: Update Redux Slice

Add the new async thunk to your slice's `extraReducers`:

```javascript
.addCase([functionName].pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase([functionName].fulfilled, (state, action) => {
  state.loading = false;
  // Update state based on response structure
  state.data = action.payload.data || action.payload;
})
.addCase([functionName].rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
```

### Step 5: Use in Components

```javascript
const MyComponent = () => {
  const dispatch = useDispatch();
  const apiClient = useApi();

  const handleAction = () => {
    dispatch(
      [functionName]({
        // Parameters from Swagger
        param1: value1,
        param2: value2,
        apiClient, // Always include this
      })
    );
  };

  return <button onClick={handleAction}>Action</button>;
};
```

## Parameter Mapping Guide

### Query Parameters

Map Swagger query parameters to the `opts` object:

```javascript
// Swagger: ?search=value&page=1&pageSize=20
const opts = {
  search: filters.search,
  page: filters.page || 1,
  pageSize: filters.pageSize || 20,
};
```

### Body Parameters

For POST/PUT requests with body data:

```javascript
// If using FormData (file uploads)
const formData = new FormData();
formData.append("field1", value1);
formData.append("file", fileObject);
const response = await api.endpoint.methodPost(formData);

// If using JSON data
const jsonData = { field1: value1, field2: value2 };
const response = await api.endpoint.methodPost(jsonData);
```

### Path Parameters

For endpoints with path parameters like `/hotels/{id}`:

```javascript
// GET /hotels/{id}
const response = await api.hotels.hotelsIdGet(hotelId, opts);

// PUT /hotels/{id}
const response = await api.hotels.hotelsIdPut(hotelId, updateData, opts);
```

## Error Handling

The system automatically handles:

- **Authentication errors** - Token refresh via Clerk
- **Network errors** - Console logging
- **API errors** - Passed to Redux error state

Custom error handling in components:

```javascript
const handleAction = async () => {
  try {
    await dispatch(actionThunk({ ...params, apiClient })).unwrap();
    // Success handling
  } catch (error) {
    // Error handling
    console.error("Action failed:", error);
  }
};
```

## Best Practices

1. **Always pass `apiClient`** to your Redux thunks
2. **Use meaningful function names** that describe the action
3. **Handle loading states** in your components
4. **Map all Swagger parameters** to the options object
5. **Remove undefined values** from options before API calls
6. **Follow the established patterns** for consistency
7. **Add proper error messages** that help with debugging

## Example Implementation

Given this Swagger spec for listing hotels:

```yaml
/hotels:
  get:
    parameters:
      - name: search
        in: query
        type: string
      - name: page
        in: query
        type: integer
        default: 1
      - name: pageSize
        in: query
        type: integer
        default: 20
```

**Function name**: `listHotels`

**Implementation**:

```javascript
export const listHotels = createAsyncThunk(
  "hotels/listHotels",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      const opts = {
        search: filters.search,
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
      };

      Object.keys(opts).forEach(
        (key) => opts[key] === undefined && delete opts[key]
      );

      const response = await apiClient.hotels.hotelsGet(opts);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to list hotels");
    }
  }
);
```

This guide provides everything needed to implement any API endpoint following the established patterns in the YomStay Admin Panel.
