# YomStay API JavaScript Client Usage Guide

This comprehensive guide explains how to use the auto-generated JavaScript client for the YomStay API, with specific patterns for the YomStay Admin Panel React application. The client is generated from OpenAPI specifications using inline JSDoc comments and handles all HTTP communication, authentication, and data serialization automatically.

## Quick Start for YomStay Admin Panel

If you're working on the YomStay Admin Panel, jump directly to:

- [Redux Integration](#redux-integration-patterns)
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

### From GitHub Packages (Private Package)

```bash
npm install @StandardTouch/yomstay_api
```

**Authentication Required**: Since this is a private package, you need to authenticate with GitHub Packages first:

```bash
# Set up .npmrc file
echo "@StandardTouch:registry=https://npm.pkg.github.com/" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
echo "always-auth=true" >> .npmrc
```

## Basic Setup

### Import the Client

```javascript
// ES6 Modules (Recommended)
import { UserApi, HotelApi, ApiClient } from "@StandardTouch/yomstay_api";

// CommonJS (Node.js)
const { UserApi, HotelApi, ApiClient } = require("@StandardTouch/yomstay_api");
```

### Initialize the API Client

```javascript
// Create API client instance
const apiClient = new ApiClient("https://api.yomstay.com/api/v1");

// For local development
const apiClient = new ApiClient("http://localhost:3000/api/v1");

// Initialize specific API services
const userApi = new UserApi(apiClient);
const hotelApi = new HotelApi(apiClient);
```

## Authentication

### Bearer Token Authentication

The YomStay API uses JWT Bearer token authentication. Set the token after creating the client:

```javascript
const apiClient = new ApiClient("https://api.yomstay.com/api/v1");

// Set authentication token
apiClient.authentications.bearerAuth.accessToken = "your-jwt-token-here";

// Initialize APIs with authenticated client
const userApi = new UserApi(apiClient);
```

### Dynamic Token Management

```javascript
class AuthManager {
  constructor() {
    this.apiClient = new ApiClient("https://api.yomstay.com/api/v1");
    this.userApi = new UserApi(this.apiClient);
  }

  setToken(token) {
    this.apiClient.authentications.bearerAuth.accessToken = token;
  }

  clearToken() {
    this.apiClient.authentications.bearerAuth.accessToken = null;
  }
}

const authManager = new AuthManager();
authManager.setToken("your-jwt-token");
```

### Clerk Authentication Integration

Since you're using Clerk for authentication, here's how to integrate it with the generated client:

#### React Hook for Clerk + API Client

```javascript
import { useAuth } from "@clerk/nextjs"; // or @clerk/react
import { UserApi, HotelApi, ApiClient } from "@StandardTouch/yomstay_api";

// Custom hook for authenticated API calls
function useAuthenticatedApi() {
  const { getToken, isSignedIn } = useAuth();

  const createApiClient = async () => {
    if (!isSignedIn) {
      throw new Error("User must be signed in");
    }

    const apiClient = new ApiClient("https://api.yomstay.com/api/v1");

    // Get JWT token from Clerk
    const token = await getToken();
    if (token) {
      apiClient.authentications.bearerAuth.accessToken = token;
    }

    return {
      userApi: new UserApi(apiClient),
      hotelApi: new HotelApi(apiClient),
      apiClient,
    };
  };

  return { createApiClient, isSignedIn };
}

// Usage in component
function UserManagement() {
  const { createApiClient, isSignedIn } = useAuthenticatedApi();
  const [users, setUsers] = useState([]);

  const handleCreateUser = async (userData) => {
    if (!isSignedIn) return;

    const { userApi } = await createApiClient();

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

    setUsers((prev) => [...prev, result.data]);
    return result;
  };

  const loadUsers = async () => {
    const { userApi } = await createApiClient();
    const response = await userApi.usersGet({ page: 1, pageSize: 20 });
    setUsers(response.data.users);
  };

  useEffect(() => {
    if (isSignedIn) {
      loadUsers();
    }
  }, [isSignedIn]);
}
```

#### Clerk Auth Manager Class

```javascript
class ClerkAuthManager {
  constructor(baseUrl = "https://api.yomstay.com/api/v1") {
    this.apiClient = new ApiClient(baseUrl);
    this.userApi = new UserApi(this.apiClient);
    this.hotelApi = new HotelApi(this.apiClient);
    this.isAuthenticated = false;
  }

  async authenticate(getToken) {
    try {
      const token = await getToken();
      if (token) {
        this.apiClient.authentications.bearerAuth.accessToken = token;
        this.isAuthenticated = true;
        return true;
      }
      this.isAuthenticated = false;
      return false;
    } catch (error) {
      console.error("Failed to get Clerk token:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  clearAuth() {
    this.apiClient.authentications.bearerAuth.accessToken = null;
    this.isAuthenticated = false;
  }

  async ensureAuthenticated(getToken) {
    if (!this.isAuthenticated) {
      await this.authenticate(getToken);
    }
    if (!this.isAuthenticated) {
      throw new Error("Authentication required");
    }
  }

  getUserApi() {
    return this.userApi;
  }

  getHotelApi() {
    return this.hotelApi;
  }
}

// Global instance
const authManager = new ClerkAuthManager();

// Usage in React component
function MyComponent() {
  const { getToken } = useAuth();

  const createUser = async (userData) => {
    await authManager.ensureAuthenticated(getToken);
    const userApi = authManager.getUserApi();

    return await userApi.usersPost(
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.password,
      userData.role,
      { phone: userData.phone }
    );
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

## Understanding API Methods

### Method Naming Convention

The generated client creates methods based on your OpenAPI paths and HTTP methods:

| HTTP Method          | Path           | Generated Method Name  |
| -------------------- | -------------- | ---------------------- |
| `POST /users`        | Create user    | `usersPost()`          |
| `GET /users`         | List users     | `usersGet()`           |
| `GET /users/{id}`    | Get user by ID | `usersIdGet(id)`       |
| `PUT /users/{id}`    | Update user    | `usersIdPut(id, opts)` |
| `DELETE /users/{id}` | Delete user    | `usersIdDelete(id)`    |

### Method Variants

Each method has two variants:

1. **Simple Method**: Returns data directly
2. **WithHttpInfo Method**: Returns data + HTTP response info

```javascript
// Simple method - returns data only
const userData = await userApi.usersIdGet("user123");

// WithHttpInfo method - returns {data, response}
const { data: userData, response } = await userApi.usersIdGetWithHttpInfo(
  "user123"
);
console.log("Status:", response.status);
console.log("Headers:", response.headers);
```

## JSON Requests (application/json)

### Simple JSON POST Request

For endpoints that accept JSON data:

```javascript
// Example: Sync users endpoint (application/json)
const syncRequest = {
  forceUpdate: true,
  dryRun: false,
};

try {
  const result = await userApi.usersSyncPost({
    usersSyncPostRequest: syncRequest,
  });
  console.log("Sync result:", result);
} catch (error) {
  console.error("Sync failed:", error);
}
```

### JSON with Authentication

```javascript
// Ensure token is set
apiClient.authentications.bearerAuth.accessToken = "your-jwt-token";

// Make authenticated JSON request
const passwordChangeRequest = {
  newPassword: "newSecurePassword123",
  forceChange: true,
  notifyUser: true,
};

const result = await userApi.usersUserIdPasswordPut(
  "user_123456789",
  passwordChangeRequest
);
```

## Form Data Requests (multipart/form-data)

### Understanding the User Creation Example

Based on your Swagger specification, here's how to use the `POST /users` endpoint:

```javascript
/**
 * Your Swagger spec shows:
 * - Content-Type: multipart/form-data
 * - Required: email, firstName, lastName, password, role
 * - Optional: phone, profileImage (binary file)
 */

// Required parameters (passed as individual arguments)
const email = "john.doe@example.com";
const firstName = "John";
const lastName = "Doe";
const password = "securePassword123";
const role = "user";

// Optional parameters (passed in opts object)
const opts = {
  phone: "+966501234567",
  profileImage: null, // We'll add file later
};

// Create user without file
try {
  const newUser = await userApi.usersPost(
    email,
    firstName,
    lastName,
    password,
    role,
    opts
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
const opts = {
  phone: "+966501234567",
  profileImage: selectedFile, // Pass File object directly
};

try {
  const newUser = await userApi.usersPost(
    "john.doe@example.com",
    "John",
    "Doe",
    "securePassword123",
    "user",
    opts
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
- **@StandardTouch/yomstay_api** generated client for API calls
- **Clerk** authentication
- **ShadCN/UI** components with Tailwind CSS
- **React Router** for navigation
- **Custom toast** utility for notifications

### File Structure Standards

```
src/
├── contexts/           # React contexts (API, theme, etc.)
├── features/          # Feature-based modules
│   └── [feature]/
│       ├── screens/   # Main feature screens
│       ├── components/ # Feature-specific components
│       ├── [feature]Slice.js    # Redux state management
│       └── [feature]Selectors.js # Redux selectors
├── components/        # Shared/reusable components
│   └── ui/           # ShadCN UI components
├── common/           # Common utilities & components
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── layout/           # Layout components
├── store/            # Redux store configuration
└── lib/              # Library utilities
```

This comprehensive guide covers all aspects of using the generated JavaScript client with your OpenAPI specifications. The examples are based on your actual Swagger documentation and provide practical, working code that you can adapt to your specific needs.
