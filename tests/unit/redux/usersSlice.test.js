import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer, {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
} from "../../../src/features/users/usersSlice";

// Mock the API client
const mockApiClient = {
  users: {
    usersPost: vi.fn(),
    usersGet: vi.fn(),
    usersIdPut: vi.fn(),
    usersIdDelete: vi.fn(),
  },
};

describe("usersSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: usersReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "user_123",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
          phone: "+966501234567",
          createdAt: new Date().toISOString(),
        },
        statusCode: 201,
      };

      mockApiClient.users.usersPost.mockResolvedValue(mockResponse);

      const userData = {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        role: "user",
        phone: "+966501234567",
      };

      const result = await store.dispatch(
        createUser({ userData, apiClient: mockApiClient })
      );

      expect(result.type).toBe("users/createUser/fulfilled");
      expect(result.payload).toEqual(mockResponse);
      expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.password,
        userData.role,
        { phone: userData.phone }
      );

      // Check state was updated
      const state = store.getState().users;
      expect(state.users).toHaveLength(1);
      expect(state.users[0].id).toBe("user_123");
    });

    it("should handle create user error", async () => {
      const errorMessage = "Validation failed";
      mockApiClient.users.usersPost.mockRejectedValue(new Error(errorMessage));

      const userData = {
        email: "invalid-email",
        firstName: "",
        lastName: "",
        password: "",
        role: "",
      };

      const result = await store.dispatch(
        createUser({ userData, apiClient: mockApiClient })
      );

      expect(result.type).toBe("users/createUser/rejected");
      expect(result.payload).toBe(errorMessage);

      // Check error state
      const state = store.getState().users;
      expect(state.error).toBe(errorMessage);
    });

    it("should handle missing required fields", async () => {
      const userData = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        role: "",
      };

      const result = await store.dispatch(
        createUser({ userData, apiClient: mockApiClient })
      );

      expect(result.type).toBe("users/createUser/rejected");
      expect(result.payload).toContain("Missing required fields");
    });

    it("should handle file uploads", async () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockResponse = {
        success: true,
        data: {
          id: "user_123",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
          profileImageUrl: "https://example.com/image.jpg",
        },
        statusCode: 201,
      };

      mockApiClient.users.usersPost.mockResolvedValue(mockResponse);

      const userData = {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        role: "user",
        profileImage: file,
      };

      const result = await store.dispatch(
        createUser({ userData, apiClient: mockApiClient })
      );

      expect(result.type).toBe("users/createUser/fulfilled");
      expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.password,
        userData.role,
        { profileImage: file }
      );
    });
  });

  describe("fetchUsers", () => {
    it("should fetch users successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          users: [
            {
              id: "user_123",
              email: "test@example.com",
              firstName: "John",
              lastName: "Doe",
              role: "user",
              phone: "+966501234567",
              createdAt: new Date().toISOString(),
            },
          ],
          total: 1,
          page: 1,
          pageSize: 20,
          totalPages: 1,
        },
        statusCode: 200,
      };

      mockApiClient.users.usersGet.mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        fetchUsers({ apiClient: mockApiClient })
      );

      expect(result.type).toBe("users/fetchUsers/fulfilled");
      expect(result.payload).toEqual(mockResponse);

      // Check state was updated
      const state = store.getState().users;
      expect(state.users).toHaveLength(1);
      expect(state.pagination.total).toBe(1);
    });

    it("should handle fetch users error", async () => {
      const errorMessage = "Network error";
      mockApiClient.users.usersGet.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(
        fetchUsers({ apiClient: mockApiClient })
      );

      expect(result.type).toBe("users/fetchUsers/rejected");
      expect(result.payload).toBe(errorMessage);

      // Check error state
      const state = store.getState().users;
      expect(state.error).toBe(errorMessage);
    });

    it("should handle filters correctly", async () => {
      const mockResponse = {
        success: true,
        data: {
          users: [],
          total: 0,
          page: 1,
          pageSize: 20,
          totalPages: 0,
        },
        statusCode: 200,
      };

      mockApiClient.users.usersGet.mockResolvedValue(mockResponse);

      const filters = {
        search: "john",
        role: "user",
        page: 1,
        pageSize: 10,
      };

      await store.dispatch(
        fetchUsers({ apiClient: mockApiClient, ...filters })
      );

      expect(mockApiClient.users.usersGet).toHaveBeenCalledWith({
        search: "john",
        role: "user",
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = "user_123";
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        phone: "+966501234567",
      };

      const mockResponse = {
        success: true,
        data: {
          id: userId,
          ...updateData,
        },
        statusCode: 200,
      };

      mockApiClient.users.usersIdPut.mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        updateUser({
          id: userId,
          userData: updateData,
          apiClient: mockApiClient,
        })
      );

      expect(result.type).toBe("users/updateUser/fulfilled");
      expect(result.payload).toEqual(mockResponse);
    });

    it("should handle update user error", async () => {
      const errorMessage = "User not found";
      mockApiClient.users.usersIdPut.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(
        updateUser({
          id: "nonexistent",
          userData: { firstName: "Test" },
          apiClient: mockApiClient,
        })
      );

      expect(result.type).toBe("users/updateUser/rejected");
      expect(result.payload).toBe(errorMessage);
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const userId = "user_123";

      mockApiClient.users.usersIdDelete.mockResolvedValue({
        success: true,
        message: "User deleted successfully",
        statusCode: 200,
      });

      const result = await store.dispatch(
        deleteUser({
          userId,
          apiClient: mockApiClient,
        })
      );

      expect(result.type).toBe("users/deleteUser/fulfilled");
      expect(result.payload).toBe(userId);
    });

    it("should handle delete user error", async () => {
      const errorMessage = "User not found";
      mockApiClient.users.usersIdDelete.mockRejectedValue(
        new Error(errorMessage)
      );

      const result = await store.dispatch(
        deleteUser({
          userId: "nonexistent",
          apiClient: mockApiClient,
        })
      );

      expect(result.type).toBe("users/deleteUser/rejected");
      expect(result.payload).toBe(errorMessage);
    });
  });

  describe("reducers", () => {
    it("should handle setUserFilters", () => {
      const initialState = store.getState().users;
      const newFilters = { search: "john", role: "user" };

      store.dispatch({
        type: "users/setUserFilters",
        payload: newFilters,
      });

      const state = store.getState().users;
      expect(state.filters.search).toBe("john");
      expect(state.filters.role).toBe("user");
    });

    it("should handle clearUserFilters", () => {
      // First set some filters
      store.dispatch({
        type: "users/setUserFilters",
        payload: { search: "john", role: "user" },
      });

      // Then clear them
      store.dispatch({ type: "users/clearUserFilters" });

      const state = store.getState().users;
      expect(state.filters.search).toBe("");
      expect(state.filters.role).toBeUndefined();
    });

    it("should handle clearUsersError", () => {
      // First set an error
      store.dispatch({
        type: "users/createUser/rejected",
        payload: "Test error",
      });

      // Then clear it
      store.dispatch({ type: "users/clearUsersError" });

      const state = store.getState().users;
      expect(state.error).toBeNull();
    });
  });
});
