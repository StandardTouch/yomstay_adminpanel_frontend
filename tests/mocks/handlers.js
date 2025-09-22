import { http, HttpResponse } from "msw";

export const handlers = [
  // User API mocks
  http.post("*/api/v1/users", () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: "user_123",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        phone: "+966501234567",
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
      },
      message: "User created successfully",
      statusCode: 201,
    });
  }),

  http.get("*/api/v1/users", () => {
    return HttpResponse.json({
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
            profileImageUrl: null,
            createdAt: new Date().toISOString(),
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
      message: "Users retrieved successfully",
      statusCode: 200,
    });
  }),

  // Hotel API mocks
  http.get("*/api/v1/hotels", () => {
    return HttpResponse.json({
      success: true,
      data: {
        hotels: [
          {
            id: "hotel_123",
            name: "Test Hotel",
            city: { name: "Riyadh" },
            state: { name: "Riyadh Province" },
            country: { name: "Saudi Arabia" },
            searchableText: "Test Hotel Riyadh Riyadh Province Saudi Arabia",
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
      message: "Hotels retrieved successfully",
      statusCode: 200,
    });
  }),

  // Error responses for testing
  http.post("*/api/v1/users", ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get("error") === "validation") {
      return HttpResponse.json(
        {
          success: false,
          errorType: "VALIDATION_ERROR",
          message: "Validation failed",
          errors: [
            {
              field: "email",
              message: "Invalid email format",
            },
          ],
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (url.searchParams.get("error") === "server") {
      return HttpResponse.json(
        {
          success: false,
          errorType: "INTERNAL_SERVER_ERROR",
          message: "Bad Request",
          errors: [],
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    // Default success response
    return HttpResponse.json({
      success: true,
      data: {
        id: "user_123",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        phone: "+966501234567",
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
      },
      message: "User created successfully",
      statusCode: 201,
    });
  }),
];
