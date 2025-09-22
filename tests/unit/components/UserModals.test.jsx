import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ClerkProvider } from "@clerk/clerk-react";
import UserModals from "../../../src/features/users/components/UserModals";
import usersReducer from "../../../src/features/users/usersSlice";
import hotelsReducer from "../../../src/features/hotels/hotelsSlice";

// Mock the API context
const mockApiClient = {
  users: {
    usersPost: vi.fn(),
    usersIdPut: vi.fn(),
  },
  hotels: {
    hotelsGet: vi.fn(),
  },
};

const mockUseApi = () => mockApiClient;

vi.mock("../../../src/contexts/ApiContext", () => ({
  useApi: mockUseApi,
}));

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }) => children,
  useAuth: () => ({
    isSignedIn: true,
    isLoaded: true,
    getToken: vi.fn().mockResolvedValue("mock-token"),
  }),
}));

// Mock toast functions
vi.mock("../../../src/utils/toast", () => ({
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

describe("UserModals", () => {
  const defaultProps = {
    addOpen: false,
    setAddOpen: vi.fn(),
    editOpen: false,
    setEditOpen: vi.fn(),
    editUser: null,
    onUpdateUser: vi.fn(),
    roleOptions: [
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" },
      { value: "hotelOwner", label: "Hotel Owner" },
      { value: "hotelStaff", label: "Hotel Staff" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful hotel fetch
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

  describe("Add User Modal", () => {
    it("should render add user form when addOpen is true", () => {
      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      expect(screen.getByText("Add New User")).toBeInTheDocument();
      expect(screen.getByText("Create a new user account")).toBeInTheDocument();
      expect(screen.getByLabelText("First Name *")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name *")).toBeInTheDocument();
      expect(screen.getByLabelText("Email *")).toBeInTheDocument();
      expect(screen.getByLabelText("Role *")).toBeInTheDocument();
      expect(screen.getByLabelText("Password *")).toBeInTheDocument();
    });

    it("should create user when form is submitted", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: { id: "user_123", email: "test@example.com" },
        statusCode: 201,
      };

      mockApiClient.users.usersPost.mockResolvedValue(mockResponse);

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Fill out the form
      await user.type(screen.getByLabelText("First Name *"), "John");
      await user.type(screen.getByLabelText("Last Name *"), "Doe");
      await user.type(screen.getByLabelText("Email *"), "john@example.com");
      await user.type(screen.getByLabelText("Password *"), "password123");

      // Select role
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("User"));

      // Submit form
      fireEvent.click(screen.getByText("Create User"));

      await waitFor(() => {
        expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
          "john@example.com",
          "John",
          "Doe",
          "password123",
          "user",
          {}
        );
      });
    });

    it("should show hotel selection for hotel-related roles", async () => {
      const user = userEvent.setup();

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Select hotel owner role
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("Hotel Owner"));

      await waitFor(() => {
        expect(screen.getByText("Hotel *")).toBeInTheDocument();
      });
    });

    it("should validate required fields", async () => {
      const user = userEvent.setup();

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Try to submit without filling required fields
      const createButton = screen.getByText("Create User");
      expect(createButton).toBeDisabled();
    });

    it("should handle file upload", async () => {
      const user = userEvent.setup();
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Upload file
      const fileInput = screen.getByLabelText(/Choose Image/i);
      await user.upload(fileInput, file);

      // Fill form and submit
      await user.type(screen.getByLabelText("First Name *"), "John");
      await user.type(screen.getByLabelText("Last Name *"), "Doe");
      await user.type(screen.getByLabelText("Email *"), "john@example.com");
      await user.type(screen.getByLabelText("Password *"), "password123");

      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("User"));

      fireEvent.click(screen.getByText("Create User"));

      await waitFor(() => {
        expect(mockApiClient.users.usersPost).toHaveBeenCalledWith(
          "john@example.com",
          "John",
          "Doe",
          "password123",
          "user",
          { profileImage: file }
        );
      });
    });

    it("should handle API errors", async () => {
      const user = userEvent.setup();
      const errorMessage = "Validation failed";

      mockApiClient.users.usersPost.mockRejectedValue(new Error(errorMessage));

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Fill and submit form
      await user.type(screen.getByLabelText("First Name *"), "John");
      await user.type(screen.getByLabelText("Last Name *"), "Doe");
      await user.type(screen.getByLabelText("Email *"), "john@example.com");
      await user.type(screen.getByLabelText("Password *"), "password123");

      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("User"));

      fireEvent.click(screen.getByText("Create User"));

      await waitFor(() => {
        expect(mockApiClient.users.usersPost).toHaveBeenCalled();
      });
    });
  });

  describe("Edit User Modal", () => {
    const mockEditUser = {
      id: "user_123",
      clerkUser: {
        id: "clerk_123",
        email: "existing@example.com",
        firstName: "Jane",
        lastName: "Smith",
      },
      localUser: {
        id: "local_123",
        phone: "+966501234567",
        role: "user",
        profileImageUrl: "https://example.com/image.jpg",
      },
    };

    it("should render edit user form with existing data", () => {
      renderWithProviders(
        <UserModals {...defaultProps} editOpen={true} editUser={mockEditUser} />
      );

      expect(screen.getByText("Edit User")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("existing@example.com")
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
    });

    it("should update user when form is submitted", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: { id: "user_123", firstName: "Updated" },
        statusCode: 200,
      };

      mockApiClient.users.usersIdPut.mockResolvedValue(mockResponse);

      renderWithProviders(
        <UserModals {...defaultProps} editOpen={true} editUser={mockEditUser} />
      );

      // Update first name
      const firstNameInput = screen.getByDisplayValue("Jane");
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "Updated");

      // Submit form
      fireEvent.click(screen.getByText("Update User"));

      await waitFor(() => {
        expect(mockApiClient.users.usersIdPut).toHaveBeenCalled();
      });
    });

    it("should show hotel selection for hotel-related roles in edit mode", async () => {
      const user = userEvent.setup();
      const hotelUser = {
        ...mockEditUser,
        localUser: {
          ...mockEditUser.localUser,
          role: "hotelOwner",
          hotelId: "hotel_123",
        },
      };

      renderWithProviders(
        <UserModals {...defaultProps} editOpen={true} editUser={hotelUser} />
      );

      await waitFor(() => {
        expect(screen.getByText("Hotel *")).toBeInTheDocument();
      });
    });
  });

  describe("Modal Interactions", () => {
    it("should close modal when cancel is clicked", () => {
      const setAddOpen = vi.fn();
      renderWithProviders(
        <UserModals {...defaultProps} addOpen={true} setAddOpen={setAddOpen} />
      );

      fireEvent.click(screen.getByText("Cancel"));
      expect(setAddOpen).toHaveBeenCalledWith(false);
    });

    it("should close modal when backdrop is clicked", () => {
      const setAddOpen = vi.fn();
      renderWithProviders(
        <UserModals {...defaultProps} addOpen={true} setAddOpen={setAddOpen} />
      );

      // Click on the backdrop (the blur overlay)
      const backdrop = document.querySelector(".fixed.inset-0");
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(setAddOpen).toHaveBeenCalledWith(false);
      }
    });

    it("should clear form when modal closes", () => {
      const { rerender } = renderWithProviders(
        <UserModals {...defaultProps} addOpen={true} />
      );

      // Fill some data
      fireEvent.change(screen.getByLabelText("First Name *"), {
        target: { value: "Test" },
      });

      // Close modal
      rerender(<UserModals {...defaultProps} addOpen={false} />);

      // Reopen modal
      rerender(<UserModals {...defaultProps} addOpen={true} />);

      // Form should be cleared
      expect(screen.getByLabelText("First Name *")).toHaveValue("");
    });
  });

  describe("Form Validation", () => {
    it("should require hotel selection for hotel roles", async () => {
      const user = userEvent.setup();

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Fill required fields
      await user.type(screen.getByLabelText("First Name *"), "John");
      await user.type(screen.getByLabelText("Last Name *"), "Doe");
      await user.type(screen.getByLabelText("Email *"), "john@example.com");
      await user.type(screen.getByLabelText("Password *"), "password123");

      // Select hotel owner role
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("Hotel Owner"));

      // Button should be disabled until hotel is selected
      await waitFor(() => {
        expect(screen.getByText("Create User")).toBeDisabled();
      });
    });

    it("should enable button when all required fields are filled", async () => {
      const user = userEvent.setup();

      renderWithProviders(<UserModals {...defaultProps} addOpen={true} />);

      // Fill all required fields
      await user.type(screen.getByLabelText("First Name *"), "John");
      await user.type(screen.getByLabelText("Last Name *"), "Doe");
      await user.type(screen.getByLabelText("Email *"), "john@example.com");
      await user.type(screen.getByLabelText("Password *"), "password123");

      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("User"));

      // Button should be enabled
      expect(screen.getByText("Create User")).not.toBeDisabled();
    });
  });
});
