import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserApi, ApiClient } from "@StandardTouch/yomstay_api";

describe("UserApi", () => {
  let apiClient;
  let userApi;

  beforeEach(() => {
    apiClient = new ApiClient("http://localhost:3000/api/v1");
    userApi = new UserApi(apiClient);
  });

  describe("usersPost", () => {
    it("should create a user successfully", async () => {
      const userData = {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        role: "user",
        phone: "+966501234567",
      };

      const result = await userApi.usersPost(
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.password,
        userData.role,
        { phone: userData.phone }
      );

      expect(result.success).toBe(true);
      expect(result.data.email).toBe(userData.email);
      expect(result.data.firstName).toBe(userData.firstName);
      expect(result.data.lastName).toBe(userData.lastName);
      expect(result.data.role).toBe(userData.role);
      expect(result.statusCode).toBe(201);
    });

    it("should handle file uploads", async () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      const result = await userApi.usersPost(
        "test@example.com",
        "John",
        "Doe",
        "password123",
        "user",
        { profileImage: file }
      );

      expect(result.success).toBe(true);
    });

    it("should handle validation errors", async () => {
      // Test with missing required fields
      await expect(userApi.usersPost("", "", "", "", "")).rejects.toThrow();
    });

    it("should handle server errors", async () => {
      // Mock server error response
      const originalCallApi = apiClient.callApi;
      apiClient.callApi = vi.fn().mockRejectedValue({
        response: {
          status: 500,
          data: {
            success: false,
            errorType: "INTERNAL_SERVER_ERROR",
            message: "Bad Request",
            errors: [],
            statusCode: 500,
          },
        },
      });

      await expect(
        userApi.usersPost(
          "test@example.com",
          "John",
          "Doe",
          "password123",
          "user",
          {}
        )
      ).rejects.toThrow();

      // Restore original method
      apiClient.callApi = originalCallApi;
    });
  });

  describe("usersGet", () => {
    it("should fetch users with pagination", async () => {
      const result = await userApi.usersGet({
        page: 1,
        pageSize: 20,
        search: "test",
      });

      expect(result.success).toBe(true);
      expect(result.data.users).toBeInstanceOf(Array);
      expect(result.data.total).toBeGreaterThanOrEqual(0);
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(20);
    });

    it("should handle empty results", async () => {
      const result = await userApi.usersGet({
        search: "nonexistent",
      });

      expect(result.success).toBe(true);
      expect(result.data.users).toBeInstanceOf(Array);
    });
  });

  describe("usersIdPut", () => {
    it("should update user successfully", async () => {
      const userId = "user_123";
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        phone: "+966501234567",
      };

      // Mock successful update
      const originalCallApi = apiClient.callApi;
      apiClient.callApi = vi.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            id: userId,
            ...updateData,
          },
          statusCode: 200,
        },
      });

      const result = await userApi.usersIdPut(userId, updateData);

      expect(result.success).toBe(true);
      expect(result.data.firstName).toBe(updateData.firstName);

      // Restore original method
      apiClient.callApi = originalCallApi;
    });
  });

  describe("usersIdDelete", () => {
    it("should delete user successfully", async () => {
      const userId = "user_123";

      // Mock successful deletion
      const originalCallApi = apiClient.callApi;
      apiClient.callApi = vi.fn().mockResolvedValue({
        data: {
          success: true,
          message: "User deleted successfully",
          statusCode: 200,
        },
      });

      const result = await userApi.usersIdDelete(userId);

      expect(result.success).toBe(true);
      expect(result.message).toBe("User deleted successfully");

      // Restore original method
      apiClient.callApi = originalCallApi;
    });
  });
});
