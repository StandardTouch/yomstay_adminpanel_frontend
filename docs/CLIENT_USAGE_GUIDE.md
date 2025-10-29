# YomStay API Axios Service Layer Guide

This comprehensive guide explains how to use the **axios-based service layer** for the YomStay API in the YomStay Admin Panel React application. We use a clean service layer pattern with axios for HTTP communication, authentication, and data serialization.

## Quick Start for YomStay Admin Panel

If you're working on the YomStay Admin Panel, jump directly to:

- [Service Layer Architecture](#service-layer-architecture)
- [Redux Integration Patterns](#redux-integration-patterns)
- [Admin Panel Architecture](#yomstay-admin-panel-architecture)
- [Feature Development Workflow](#feature-development-workflow)

## Table of Contents

- [Installation](#installation)
- [Basic Setup](#basic-setup)
- [Authentication](#authentication)
- [Understanding API Methods](#understanding-api-methods)
- [JSON Requests (application/json)](#json-requests-applicationjson)
- [Form Data Requests (multipart/form-data)](#form-data-requests-multipartform-data)
- [File Uploads](#file-uploads)
- [Error Handling](#error-handling)
- [Query Parameters](#query-parameters)
- [Path Parameters](#path-parameters)
- [Response Types](#response-types)
- [Advanced Configuration](#advanced-configuration)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Installation

### Install Axios

```bash
npm install axios
```

That's it! No additional packages needed.

## Basic Setup

### Service Layer Structure

The YomStay Admin Panel uses a service layer pattern where each feature has its own service class:

```
src/
├── services/
│   ├── config.js              # Axios instance configuration
│   └── index.js               # Service factory (optional)
├── features/
│   ├── users/
│   │   └── services/
│   │       └── usersService.js
│   ├── hotels/
│   │   └── services/
│   │       ├── hotelsService.js
│   │       └── adminService.js
│   └── [feature]/
│       └── services/
│           └── [feature]Service.js
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

  // Response interceptor - Handle errors and return data
  apiClient.interceptors.response.use(
    (response) => response.data, // Return response.data directly
    (error) => {
      // Enhanced error handling
      if (error.response) {
        const enhancedError = {
          message: error.response.data?.message || error.message,
          statusCode: error.response.status,
          data: error.response.data,
        };
        return Promise.reject(enhancedError);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};
```

## Authentication

### Bearer Token Authentication (Automatic)

The YomStay API uses JWT Bearer token authentication. Authentication is handled automatically through axios interceptors:

```javascript
// Authentication is automatic via request interceptor
// The getToken function from Clerk is called before each request
// No manual token management needed!
```

### Token Refresh (Automatic)

Tokens are automatically refreshed on each request via the interceptor in `createApiClient`. The `getToken` function from Clerk ensures you always have a fresh token - no manual management needed!

### Clerk Authentication Integration

The Clerk integration is already set up in the `ApiContext`. Here's how it works:

#### Using Services in Components

```javascript
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";

function UserManagement() {
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi(); // Get all services
  const [users, setUsers] = useState([]);

  const handleCreateUser = async (userData) => {
    if (!isSignedIn || !apiClient) return;

    try {
      // Use service method directly
      const result = await apiClient.users.createUser(
        userData,
        userData.profileImage // File object or null
      );

      setUsers((prev) => [...prev, result.data]);
      return result;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  const loadUsers = async () => {
    if (!apiClient) return;

    const response = await apiClient.users.listUsers({
      page: 1,
      pageSize: 20,
    });
    setUsers(response.data?.users || []);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      loadUsers();
    }
  }, [isLoaded, isSignedIn, apiClient]);
}
```

#### Service Class Example

```javascript
// src/features/users/services/usersService.js
export class UsersService {
  constructor(apiClient) {
    this.apiClient = apiClient; // Authenticated axios instance
  }

  async listUsers(filters = {}) {
    const params = { ...filters };
    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    return this.apiClient.get("/users", { params });
  }

  async createUser(userData, profileImage = null) {
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("password", userData.password);
    formData.append("role", userData.role);

    if (userData.phone) formData.append("phone", userData.phone);
    if (profileImage instanceof File) {
      formData.append("profileImage", profileImage);
    }

    return this.apiClient.post("/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

// Usage via ApiContext
function MyComponent() {
  const apiClient = useApi(); // Get services from context

  const createUser = async (userData) => {
    return await apiClient.users.createUser(userData, userData.profileImage);
  };
}
```

#### Next.js Server-Side API Routes

```javascript
// app/api/users/route.js (App Router)
import { auth } from "@clerk/nextjs";
import { UserApi, ApiClient } from "@StandardTouch/yomstay_api";

export async function POST(request) {
  const { getToken } = auth();

  try {
    // Get token from Clerk
    const token = await getToken();
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create authenticated API client
    const apiClient = new ApiClient(process.env.API_BASE_URL);
    apiClient.authentications.bearerAuth.accessToken = token;
    const userApi = new UserApi(apiClient);

    // Get request data
    const userData = await request.json();

    // Call your API
    const result = await userApi.usersPost(
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.password,
      userData.role,
      { phone: userData.phone }
    );

    return Response.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// pages/api/users.js (Pages Router)
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { getToken } = getAuth(req);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = await getToken();
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const apiClient = new ApiClient(process.env.API_BASE_URL);
    apiClient.authentications.bearerAuth.accessToken = token;
    const userApi = new UserApi(apiClient);

    const result = await userApi.usersPost(
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.role,
      { phone: req.body.phone }
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Complete React Component Example

```jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { UserApi, ApiClient } from "@StandardTouch/yomstay_api";

const UserCreationForm = () => {
  const { getToken, isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "user",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create authenticated API client
  const createApiClient = async () => {
    if (!isSignedIn) {
      throw new Error("Please sign in to continue");
    }

    const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL);
    const token = await getToken();

    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    apiClient.authentications.bearerAuth.accessToken = token;
    return new UserApi(apiClient);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userApi = await createApiClient();

      const opts = {
        phone: formData.phone || undefined,
        profileImage: profileImage,
      };

      const result = await userApi.usersPost(
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.password,
        formData.role,
        opts
      );

      console.log("User created:", result);

      // Reset form
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        role: "user",
        phone: "",
      });
      setProfileImage(null);
    } catch (error) {
      console.error("Failed to create user:", error);
      setError(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return <div>Please sign in to access this feature.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfileImage(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default UserCreationForm;
```

## Understanding Service Methods

### Service Method Naming Convention

Service methods use descriptive, RESTful naming conventions:

| HTTP Method          | Endpoint       | Service Method Name      |
| -------------------- | -------------- | ------------------------ |
| `GET /users`         | List users     | `listUsers(filters)`     |
| `POST /users`        | Create user    | `createUser(data, file)` |
| `GET /users/{id}`    | Get user by ID | `getUser(id)`            |
| `PUT /users/{id}`    | Update user    | `updateUser(id, data)`   |
| `DELETE /users/{id}` | Delete user    | `deleteUser(id)`         |

### Response Format

All service methods return the response data directly (via axios interceptor):

```javascript
// Service method returns response.data
const response = await apiClient.users.listUsers({ page: 1 });

// Response structure:
{
  statusCode: 200,
  data: { users: [...], total: 100, page: 1 },
  message: "Users fetched successfully",
  success: true
}
```

## JSON Requests (application/json)

### Simple JSON POST Request

For endpoints that accept JSON data:

```javascript
// Example: Sync users endpoint (application/json)
try {
  const result = await apiClient.users.syncUsers({
    forceUpdate: true,
    dryRun: false,
  });
  console.log("Sync result:", result);
} catch (error) {
  console.error("Sync failed:", error);
}
```

### JSON with Automatic Authentication

```javascript
// Authentication is automatic via interceptor
// No need to manually set tokens

// Example: Create hotel request
const requestData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  name: "Grand Hotel",
  starRating: "4",
  numberOfRooms: "150",
  address: "123 Main St",
  postalCode: "12345",
  countryId: "uuid-here",
  cityId: "uuid-here",
  phone: "+966501234567",
  jobFunction: "Hotel Manager",
  message: "We want to add our hotel",
};

const result = await apiClient.hotelRequests.createRequest(requestData);
```

## Form Data Requests (multipart/form-data)

### Understanding the User Creation Example

The service layer handles FormData creation automatically:

```javascript
/**
 * POST /users endpoint uses multipart/form-data
 * - Required: email, firstName, lastName, password, role
 * - Optional: phone, profileImage (binary file)
 */

// Create user with profile image
const userData = {
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "securePassword123",
  role: "user",
  phone: "+966501234567", // Optional
};

const profileImageFile = fileInput.files[0]; // File object

try {
  // Service handles FormData creation automatically
  const newUser = await apiClient.users.createUser(
    userData,
    profileImageFile // Pass File object or null
  );
  console.log("User created:", newUser);
} catch (error) {
  console.error("Failed to create user:", error);
}
```

## File Uploads

### Single File Upload

```javascript
// Get file from HTML input
const fileInput = document.getElementById("profileImageInput");
const selectedFile = fileInput.files[0];

// Create user with profile image
const userData = {
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "securePassword123",
  role: "user",
  phone: "+966501234567",
};

// Service handles FormData and Content-Type automatically
try {
  const newUser = await apiClient.users.createUser(
    userData,
    selectedFile // Pass File object directly
  );
  console.log("User created with image:", newUser);
} catch (error) {
  console.error("Failed to create user:", error);
}
```

### File Upload with Form Validation

```javascript
function validateAndCreateUser(formData) {
  // Extract form data
  const email = formData.get("email");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const password = formData.get("password");
  const role = formData.get("role");
  const phone = formData.get("phone");
  const profileImage = formData.get("profileImage");

  // Validate required fields
  if (!email || !firstName || !lastName || !password || !role) {
    throw new Error("Missing required fields");
  }

  // Validate file if provided
  if (profileImage && profileImage.size > 0) {
    if (profileImage.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error("File too large");
    }
    if (!profileImage.type.startsWith("image/")) {
      throw new Error("Invalid file type");
    }
  }

  // Create user
  const opts = {
    phone: phone || undefined,
    profileImage:
      profileImage && profileImage.size > 0 ? profileImage : undefined,
  };

  return userApi.usersPost(email, firstName, lastName, password, role, opts);
}

// Usage with HTML form
const form = document.getElementById("createUserForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(form);
    const result = await validateAndCreateUser(formData);
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
});
```

## Error Handling

### Understanding Error Responses

Based on your Swagger spec, errors have this structure:

```javascript
// UserCreateError schema
interface ErrorResponse {
  statusCode: number; // HTTP status code (400, 401, 500, etc.)
  message: string; // Human-readable error message
  errors: object[]; // Array of detailed error objects
  errorType: string; // Error category (VALIDATION_ERROR, etc.)
}
```

### Comprehensive Error Handling

```javascript
async function createUserWithErrorHandling(userData) {
  try {
    const result = await userApi.usersPost(
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.password,
      userData.role,
      {
        phone: userData.phone,
        profileImage: userData.profileImage,
      }
    );

    return { success: true, data: result };
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.body || error.response.data;

      switch (error.response.status) {
        case 400:
          return {
            success: false,
            error: "Validation Error",
            message: errorData.message || "Invalid input data",
            details: errorData.errors || [],
          };

        case 401:
          return {
            success: false,
            error: "Authentication Error",
            message: "Please log in to continue",
          };

        case 403:
          return {
            success: false,
            error: "Permission Error",
            message: "You do not have permission to perform this action",
          };

        case 500:
          return {
            success: false,
            error: "Server Error",
            message: "Internal server error. Please try again later.",
          };

        default:
          return {
            success: false,
            error: "Unknown Error",
            message: errorData.message || `HTTP ${error.response.status}`,
          };
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: "Network Error",
        message: "Unable to connect to server. Check your internet connection.",
      };
    } else {
      // Client-side error
      return {
        success: false,
        error: "Client Error",
        message: error.message || "An unexpected error occurred",
      };
    }
  }
}

// Usage
const result = await createUserWithErrorHandling({
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "password123",
  role: "user",
  phone: "+966501234567",
  profileImage: fileInput.files[0],
});

if (result.success) {
  console.log("User created:", result.data);
} else {
  console.error("Error:", result.error, result.message);
}
```

## Query Parameters

### List Endpoints with Query Parameters

```javascript
// Example: List users with filtering and pagination
const listOptions = {
  search: "john", // Search term
  role: "user", // Role filter
  page: 2, // Page number
  pageSize: 10, // Results per page
  sortBy: "createdAt", // Sort field
  sortOrder: "desc", // Sort direction
  hasProfileImage: true, // Boolean filter
  createdAfter: "2024-01-01", // Date filter
  hotelId: "hotel-uuid-123", // UUID filter
};

try {
  const users = await userApi.usersGet(listOptions);
  console.log("Users:", users.data.users);
  console.log("Total:", users.data.total);
  console.log("Current page:", users.data.page);
} catch (error) {
  console.error("Failed to list users:", error);
}
```

### Hotel Search with Geospatial Parameters

```javascript
// Example: Search hotels with location and filters
const searchOptions = {
  search: "luxury",
  lat: 24.7136,
  lng: 46.6753,
  city: "Riyadh",
  country: "Saudi Arabia",
  page: 1,
  pageSize: 20,
};

const hotels = await hotelApi.hotelsGet(searchOptions);
```

## Path Parameters

### Single Path Parameter

```javascript
// Get user by ID
const userId = "user_2abc123def456ghi789";
const user = await userApi.usersIdGet(userId);
```

### Multiple Path Parameters

```javascript
// Example: Get hotel room by hotel ID and room ID
const hotelId = "hotel-uuid-123";
const roomId = "room-uuid-456";

// This would generate a method like:
const room = await hotelApi.hotelsHotelIdRoomsRoomIdGet(hotelId, roomId);
```

## Response Types

### Understanding Response Structure

Your API responses follow this pattern:

```javascript
interface ApiResponse<T> {
  statusCode: number; // HTTP status code
  data: T; // Actual data (typed based on endpoint)
  message: string; // Success message
  success: boolean; // Always true for successful responses
}
```

### Working with Typed Responses

```javascript
// User creation response
const createResponse = await userApi.usersPost(/* ... */);
console.log("Status:", createResponse.statusCode); // 201
console.log("Message:", createResponse.message); // "User created successfully"
console.log("User ID:", createResponse.data.id); // "user_2abc123def456ghi789"
console.log("Email:", createResponse.data.emailAddresses[0].emailAddress);

// List response with pagination
const listResponse = await userApi.usersGet({ page: 1, pageSize: 10 });
console.log("Users:", listResponse.data.users);
console.log("Total count:", listResponse.data.total);
console.log("Current page:", listResponse.data.page);
console.log("Total pages:", listResponse.data.totalPages);
```

## Advanced Configuration

### Custom Timeouts

```javascript
const apiClient = new ApiClient("https://api.yomstay.com/api/v1");

// Set custom timeout (default is 60000ms)
apiClient.timeout = 30000; // 30 seconds

// Set for specific operations
apiClient.timeout = 120000; // 2 minutes for file uploads
```

### Custom Headers

```javascript
// Add default headers for all requests
apiClient.defaultHeaders = {
  "User-Agent": "MyApp/1.0.0",
  "X-Custom-Header": "custom-value",
};

// Add headers for specific request
const userApi = new UserApi(apiClient);
// Note: Custom headers per request would need to be added to the generated client
```

### Environment-Based Configuration

```javascript
class ApiConfig {
  constructor(environment = "production") {
    this.config = {
      development: {
        baseUrl: "http://localhost:3000/api/v1",
        timeout: 30000,
      },
      staging: {
        baseUrl: "https://staging-api.yomstay.com/api/v1",
        timeout: 60000,
      },
      production: {
        baseUrl: "https://api.yomstay.com/api/v1",
        timeout: 60000,
      },
    };

    this.apiClient = new ApiClient(this.config[environment].baseUrl);
    this.apiClient.timeout = this.config[environment].timeout;
  }

  setToken(token) {
    this.apiClient.authentications.bearerAuth.accessToken = token;
  }

  getUserApi() {
    return new UserApi(this.apiClient);
  }

  getHotelApi() {
    return new HotelApi(this.apiClient);
  }
}

// Usage
const apiConfig = new ApiConfig(process.env.NODE_ENV);
apiConfig.setToken(localStorage.getItem("authToken"));
const userApi = apiConfig.getUserApi();
```

## Common Patterns

### 1. User Management Pattern

```javascript
class UserManager {
  constructor(apiClient) {
    this.userApi = new UserApi(apiClient);
  }

  async createUser(userData, profileImage = null) {
    const opts = {
      phone: userData.phone,
      profileImage: profileImage,
    };

    return await this.userApi.usersPost(
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.password,
      userData.role,
      opts
    );
  }

  async updateUser(userId, updates, newProfileImage = null) {
    const opts = {
      email: updates.email,
      firstName: updates.firstName,
      lastName: updates.lastName,
      phone: updates.phone,
      role: updates.role,
      profileImage: newProfileImage,
    };

    return await this.userApi.usersIdPut(userId, opts);
  }

  async searchUsers(searchTerm, filters = {}) {
    return await this.userApi.usersGet({
      search: searchTerm,
      ...filters,
    });
  }
}
```

### 2. File Upload Pattern

```javascript
class FileUploadManager {
  constructor(apiClient) {
    this.userApi = new UserApi(apiClient);
  }

  async uploadProfileImage(userId, file, onProgress = null) {
    // Validate file
    this.validateFile(file);

    // Update user with new image
    const result = await this.userApi.usersIdPut(userId, {
      profileImage: file,
    });

    return result;
  }

  validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum 5MB allowed.");
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, and GIF allowed.");
    }
  }
}
```

### 3. Pagination Pattern

```javascript
class PaginationManager {
  constructor(apiClient) {
    this.userApi = new UserApi(apiClient);
  }

  async getAllUsers(filters = {}) {
    let allUsers = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.userApi.usersGet({
        ...filters,
        page: currentPage,
        pageSize: 100, // Max allowed
      });

      allUsers = allUsers.concat(response.data.users);

      hasMore = currentPage < response.data.totalPages;
      currentPage++;
    }

    return allUsers;
  }

  async *paginateUsers(filters = {}) {
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.userApi.usersGet({
        ...filters,
        page: currentPage,
        pageSize: 20,
      });

      yield response.data.users;

      hasMore = currentPage < response.data.totalPages;
      currentPage++;
    }
  }
}

// Usage
const paginator = new PaginationManager(apiClient);

// Get all users at once
const allUsers = await paginator.getAllUsers({ role: "user" });

// Iterate through pages
for await (const userPage of paginator.paginateUsers({ role: "admin" })) {
  console.log("Page of users:", userPage);
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Unexpected token '-', "------WebK"... is not valid JSON"

**Problem**: Your frontend is sending JSON to a multipart/form-data endpoint.

**Solution**:

```javascript
// ❌ Wrong - Don't use fetch with JSON for multipart endpoints
fetch("/api/v1/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// ✅ Correct - Use the generated client
const result = await userApi.usersPost(
  email,
  firstName,
  lastName,
  password,
  role,
  opts
);
```

#### 2. Authentication Errors

**Problem**: 401 Unauthorized responses.

**Solution**:

```javascript
// Ensure token is set before making requests
apiClient.authentications.bearerAuth.accessToken = "your-jwt-token";

// Check token validity
if (!apiClient.authentications.bearerAuth.accessToken) {
  throw new Error("Authentication token required");
}
```

#### 3. File Upload Issues

**Problem**: Files not uploading correctly.

**Solution**:

```javascript
// Ensure you're passing a File object, not a path or string
const fileInput = document.getElementById("fileInput");
const file = fileInput.files[0]; // This is a File object

// Pass File object directly to the generated client
const opts = { profileImage: file };
```

#### 4. CORS Issues

**Problem**: CORS errors in browser.

**Solution**: This is a backend configuration issue, not a client issue. Ensure your API server allows requests from your frontend domain.

#### 5. Network Timeouts

**Problem**: Requests timing out.

**Solution**:

```javascript
// Increase timeout for large file uploads
apiClient.timeout = 120000; // 2 minutes
```

### Debug Mode

```javascript
// Enable debug logging (if supported by client)
apiClient.debug = true;

// Log all requests and responses
const originalCallApi = apiClient.callApi;
apiClient.callApi = function (...args) {
  console.log("API Call:", args);
  return originalCallApi
    .apply(this, args)
    .then((result) => {
      console.log("API Response:", result);
      return result;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};
```

## Best Practices

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Validate files before upload**: Check size and type before sending
3. **Use environment-specific URLs**: Don't hardcode API URLs
4. **Cache API client instances**: Don't create new clients for every request
5. **Set appropriate timeouts**: Especially for file uploads
6. **Use TypeScript**: For better type safety and IDE support
7. **Implement retry logic**: For network failures
8. **Monitor API usage**: Log successful and failed requests

## React Integration Example

```jsx
import React, { useState, useCallback } from "react";
import { UserApi, ApiClient } from "@StandardTouch/yomstay_api";

const UserCreationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "user",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = new ApiClient(process.env.REACT_APP_API_URL);
  const userApi = new UserApi(apiClient);

  // Set auth token from context/state
  apiClient.authentications.bearerAuth.accessToken = "your-jwt-token";

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const opts = {
          phone: formData.phone || undefined,
          profileImage: profileImage,
        };

        const result = await userApi.usersPost(
          formData.email,
          formData.firstName,
          formData.lastName,
          formData.password,
          formData.role,
          opts
        );

        console.log("User created:", result);
        // Handle success (redirect, show message, etc.)
      } catch (error) {
        setError(error.message || "Failed to create user");
      } finally {
        setLoading(false);
      }
    },
    [formData, profileImage, userApi]
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfileImage(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default UserCreationForm;
```

---

## YomStay Admin Panel Architecture

This section covers the specific patterns and architecture used in the YomStay Admin Panel React application.

### Project Overview

The YomStay Admin Panel uses:

- **Redux Toolkit** for state management
- **Axios** for HTTP requests with service layer pattern
- **Clerk** authentication
- **ShadCN/UI** components with Tailwind CSS
- **React Router** for navigation
- **Custom toast** utility for notifications

### File Structure Standards

```
src/
├── services/          # Service layer infrastructure
│   ├── config.js     # Axios instance configuration
│   └── index.js      # Service factory (optional)
├── contexts/         # React contexts (API, theme, etc.)
│   └── ApiContext.jsx # Service provider
├── features/         # Feature-based modules
│   └── [feature]/
│       ├── services/ # Feature-specific services
│       │   └── [feature]Service.js
│       ├── screens/ # Main feature screens
│       ├── components/ # Feature-specific components
│       ├── [feature]Slice.js    # Redux state management
│       └── [feature]Selectors.js # Redux selectors
├── components/       # Shared/reusable components
│   └── ui/          # ShadCN UI components
├── common/          # Common utilities & components
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── layout/           # Layout components
├── store/            # Redux store configuration
└── lib/              # Library utilities
```

## Service Layer Reference

### Available Services

#### UsersService

- `listUsers(filters)` - GET /users
- `createUser(userData, profileImage)` - POST /users (multipart/form-data)
- `updateUser(id, userData, profileImage)` - PUT /users/:id (multipart/form-data)
- `deleteUser(id)` - DELETE /users/:id
- `syncUsers(options)` - POST /users/sync

#### HotelsService

- `listHotels(filters)` - GET /hotels
- `getHotel(id)` - GET /hotels/:id
- `createHotel(hotelData)` - POST /hotels
- `updateHotel(id, hotelData)` - PUT /hotels/:id
- `deleteHotel(id)` - DELETE /hotels/:id

#### AdminService

- `getHotelById(id)` - GET /admin/hotels/:id
- `updateHotel(id, updates)` - PUT /admin/hotels/:id
- `getPlatformSettings()` - GET /admin/platform-settings
- `updatePlatformSettings(data)` - PUT /admin/platform-settings
- `listHotelConditions()` - GET /admin/hotel-conditions
- `getHotelCondition(id)` - GET /admin/hotel-conditions/:id
- `createHotelCondition(data)` - POST /admin/hotel-conditions
- `updateHotelCondition(id, data)` - PUT /admin/hotel-conditions/:id
- `deleteHotelCondition(id)` - DELETE /admin/hotel-conditions/:id

#### LocationsService

- `listCountries(search)` - GET /location/countries
- `listStates(countryId, search)` - GET /location/states
- `listCities(params)` - GET /location/cities

#### HotelRequestsService

- `listRequests(filters)` - GET /hotel-requests
- `createRequest(requestData)` - POST /hotel-requests
- `handleRequest(id, status)` - PATCH /hotel-requests/:id/approve-or-reject

### Hotel Request Creation Example

Based on the Swagger documentation:

```javascript
// Required fields
const requestData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  name: "Grand Hotel Riyadh",
  starRating: "4",
  numberOfRooms: "150",
  address: "King Fahd Road, Riyadh",
  postalCode: "12345",
  countryId: "123e4567-e89b-12d3-a456-426614174000",
  cityId: "789e0123-e89b-12d3-a456-426614174000",
};

// Optional fields
requestData.jobFunction = "Hotel Manager";
requestData.phone = "+966501234567";
requestData.managementCompany = "false";
requestData.message = "We would like to add our new hotel to the platform";
requestData.stateId = "456e7890-e89b-12d3-a456-426614174000";

// Create hotel request
try {
  const result = await apiClient.hotelRequests.createRequest(requestData);
  console.log("Hotel request created:", result.data);
} catch (error) {
  console.error("Failed to create hotel request:", error);
}
```

This comprehensive guide covers all aspects of using the axios-based service layer with the YomStay API. The examples are based on your actual Swagger documentation and provide practical, working code that you can adapt to your specific needs.
