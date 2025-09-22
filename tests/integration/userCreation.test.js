import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ClerkProvider } from "@clerk/clerk-react";
import UsersScreen from "../../src/features/users/screens/UsersScreen";
import usersReducer from "../../src/features/users/usersSlice";
import hotelsReducer from "../../src/features/hotels/hotelsSlice";

// Mock API client
const mockApiClient = {
  users: {
    usersPost: vi.fn(),
    usersGet: vi.fn(),
  },
  hotels: {
    hotelsGet: vi.fn(),
  },
};

const mockUseApi = () => mockApiClient;

vi.mock("../../src/contexts/ApiContext", () => ({
  useApi: mockUseApi,
}));

vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }) => children,
  useAuth: () => ({
    isSignedIn: true,
    isLoaded: true,
    getToken: vi.fn().mockResolvedValue("mock-token"),
  }),
}));

// Mock toast functions
vi.mock("../../src/utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      users: usersReducer,
      hotels: hotelsReducer,
    },
  });
};

const renderWithProviders = (component, { store = createTestStore() } = {}) => {
  return render(
    <ClerkProvider publishableKey="test-key">
      <Provider store={store}>{component}</Provider>
    </ClerkProvider>
  );
};

describe("User Creation Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful API responses
    mockApiClient.users.usersGet.mockResolvedValue({
      success: true,
      data: {
        users: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
      },
    });

    mockApiClient.hotels.hotelsGet.mockResolvedValue({
      success: true,
      data: {
        hotels: [
          {
            id: "hotel_123",
            name: "Test Hotel",
            city: { name: "Riyadh" },
            state: { name: "Riyadh Province" },
            country: { name: "Saudi Arabia" },
            searchableText: "Test Hotel Riyadh",
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
    });
  });

  it("should complete full user creation flow", async () => {
    const user = userEvent.setup();

    // Mock successful user creation
    mockApiClient.users.usersPost.mockResolvedValue({
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
    });

    renderWithProviders(<UsersScreen />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockApiClient.users.usersGet).toHaveBeenCalled();
    });

    // Click add user button
    const addButton = screen.getByText("Add User");
    fireEvent.click(addButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    // Fill out the form
    await user.type(screen.getByLabelText("First Name *"), "John");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "test@example.com");
    await user.type(screen.getByLabelText("Phone"), "+966501234567");
    await user.type(screen.getByLabelText("Password *"), "password123");

    // Select role
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("User"));

    // Submit form
    fireEvent.click(screen.getByText("Create User"));

    // Verify API call
    await waitFor(() => {
      expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
        "test@example.com",
        "John",
        "Doe",
        "password123",
        "user",
        { phone: "+966501234567" }
      );
    });

    // Verify success (modal should close)
    await waitFor(() => {
      expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
    });
  });

  it("should handle user creation with hotel role", async () => {
    const user = userEvent.setup();

    mockApiClient.users.usersPost.mockResolvedValue({
      success: true,
      data: {
        id: "user_123",
        email: "hotelowner@example.com",
        firstName: "Hotel",
        lastName: "Owner",
        role: "hotelOwner",
        hotelId: "hotel_123",
      },
      statusCode: 201,
    });

    renderWithProviders(<UsersScreen />);

    await waitFor(() => {
      expect(mockApiClient.users.usersGet).toHaveBeenCalled();
    });

    // Open add user modal
    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    // Fill form
    await user.type(screen.getByLabelText("First Name *"), "Hotel");
    await user.type(screen.getByLabelText("Last Name *"), "Owner");
    await user.type(screen.getByLabelText("Email *"), "hotelowner@example.com");
    await user.type(screen.getByLabelText("Password *"), "password123");

    // Select hotel owner role
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Hotel Owner"));

    // Wait for hotel selection to appear
    await waitFor(() => {
      expect(screen.getByText("Hotel *")).toBeInTheDocument();
    });

    // Select hotel
    fireEvent.click(screen.getByText("Select hotel"));
    fireEvent.click(screen.getByText("Test Hotel"));

    // Submit form
    fireEvent.click(screen.getByText("Create User"));

    // Verify API call includes hotelId
    await waitFor(() => {
      expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
        "hotelowner@example.com",
        "Hotel",
        "Owner",
        "password123",
        "hotelOwner",
        { hotelId: "hotel_123" }
      );
    });
  });

  it("should handle user creation with file upload", async () => {
    const user = userEvent.setup();
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    mockApiClient.users.usersPost.mockResolvedValue({
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
    });

    renderWithProviders(<UsersScreen />);

    await waitFor(() => {
      expect(mockApiClient.users.usersGet).toHaveBeenCalled();
    });

    // Open add user modal
    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    // Upload file
    const fileInput = screen.getByLabelText(/Choose Image/i);
    await user.upload(fileInput, file);

    // Fill form
    await user.type(screen.getByLabelText("First Name *"), "John");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "test@example.com");
    await user.type(screen.getByLabelText("Password *"), "password123");

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("User"));

    // Submit form
    fireEvent.click(screen.getByText("Create User"));

    // Verify API call includes file
    await waitFor(() => {
      expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
        "test@example.com",
        "John",
        "Doe",
        "password123",
        "user",
        { profileImage: file }
      );
    });
  });

  it("should handle user creation errors gracefully", async () => {
    const user = userEvent.setup();

    // Mock API error
    mockApiClient.users.usersPost.mockRejectedValue(
      new Error("Validation failed")
    );

    renderWithProviders(<UsersScreen />);

    await waitFor(() => {
      expect(mockApiClient.users.usersGet).toHaveBeenCalled();
    });

    // Open add user modal
    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    // Fill form with invalid data
    await user.type(screen.getByLabelText("First Name *"), "John");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "invalid-email");
    await user.type(screen.getByLabelText("Password *"), "password123");

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("User"));

    // Submit form
    fireEvent.click(screen.getByText("Create User"));

    // Verify API was called
    await waitFor(() => {
      expect(mockApiClient.users.usersPost).toHaveBeenCalled();
    });

    // Modal should still be open (error occurred)
    expect(screen.getByText("Add New User")).toBeInTheDocument();
  });

  it("should refresh user list after successful creation", async () => {
    const user = userEvent.setup();

    // Mock successful user creation
    mockApiClient.users.usersPost.mockResolvedValue({
      success: true,
      data: {
        id: "user_123",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
      },
      statusCode: 201,
    });

    const store = createTestStore();
    renderWithProviders(<UsersScreen />, { store });

    await waitFor(() => {
      expect(mockApiClient.users.usersGet).toHaveBeenCalled();
    });

    // Open add user modal
    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    // Fill and submit form
    await user.type(screen.getByLabelText("First Name *"), "John");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "test@example.com");
    await user.type(screen.getByLabelText("Password *"), "password123");

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("User"));

    fireEvent.click(screen.getByText("Create User"));

    // Wait for creation to complete
    await waitFor(() => {
      expect(mockApiClient.users.usersPost).toHaveBeenCalled();
    });

    // Check that user was added to the store
    const state = store.getState().users;
    expect(state.users).toHaveLength(1);
    expect(state.users[0].email).toBe("test@example.com");
  });

  it("should handle network errors during user creation", async () => {
    const user = userEvent.setup();

    // Mock network error
    mockApiClient.users.usersPost.mockRejectedValue(new Error("Network error"));

    renderWithProviders(<UsersScreen />);

    await waitFor(() => {
      expect(mockApiClient.users.usersGet).toHaveBeenCalled();
    });

    // Open add user modal
    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    // Fill form
    await user.type(screen.getByLabelText("First Name *"), "John");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "test@example.com");
    await user.type(screen.getByLabelText("Password *"), "password123");

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("User"));

    // Submit form
    fireEvent.click(screen.getByText("Create User"));

    // Verify API was called
    await waitFor(() => {
      expect(mockApiClient.users.usersPost).toHaveBeenCalled();
    });

    // Modal should still be open (error occurred)
    expect(screen.getByText("Add New User")).toBeInTheDocument();
  });
});
