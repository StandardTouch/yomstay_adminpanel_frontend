import { test, expect } from "@playwright/test";

test.describe("User Management E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto("/");

    // Mock Clerk authentication
    await page.evaluate(() => {
      window.localStorage.setItem("clerk-db-jwt", "mock-jwt-token");
    });
  });

  test("should complete full user creation workflow", async ({ page }) => {
    // Navigate to users page
    await page.goto("/users");

    // Wait for page to load
    await expect(page.getByText("Users Management")).toBeVisible();

    // Click add user button
    await page.getByText("Add User").click();

    // Wait for modal to open
    await expect(page.getByText("Add New User")).toBeVisible();

    // Fill out the form
    await page.getByLabel("First Name *").fill("John");
    await page.getByLabel("Last Name *").fill("Doe");
    await page.getByLabel("Email *").fill("john.doe@example.com");
    await page.getByLabel("Phone").fill("+966501234567");
    await page.getByLabel("Password *").fill("password123");

    // Select role
    await page.getByRole("combobox").click();
    await page.getByText("User").click();

    // Submit form
    await page.getByText("Create User").click();

    // Wait for success message or modal to close
    await expect(page.getByText("Add New User")).not.toBeVisible();

    // Verify user appears in the list
    await expect(page.getByText("john.doe@example.com")).toBeVisible();
  });

  test("should create hotel owner with hotel selection", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Click add user button
    await page.getByText("Add User").click();
    await expect(page.getByText("Add New User")).toBeVisible();

    // Fill out the form
    await page.getByLabel("First Name *").fill("Hotel");
    await page.getByLabel("Last Name *").fill("Owner");
    await page.getByLabel("Email *").fill("hotel.owner@example.com");
    await page.getByLabel("Password *").fill("password123");

    // Select hotel owner role
    await page.getByRole("combobox").click();
    await page.getByText("Hotel Owner").click();

    // Wait for hotel selection to appear
    await expect(page.getByText("Hotel *")).toBeVisible();

    // Select hotel
    await page.getByText("Select hotel").click();
    await page.getByText("Test Hotel").click();

    // Submit form
    await page.getByText("Create User").click();

    // Wait for success
    await expect(page.getByText("Add New User")).not.toBeVisible();

    // Verify user appears in the list
    await expect(page.getByText("hotel.owner@example.com")).toBeVisible();
  });

  test("should upload profile image during user creation", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Click add user button
    await page.getByText("Add User").click();
    await expect(page.getByText("Add New User")).toBeVisible();

    // Upload profile image
    const fileInput = page.getByLabel(/Choose Image/i);
    await fileInput.setInputFiles({
      name: "test-image.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("fake-image-data"),
    });

    // Fill out the form
    await page.getByLabel("First Name *").fill("John");
    await page.getByLabel("Last Name *").fill("Doe");
    await page.getByLabel("Email *").fill("john.with.image@example.com");
    await page.getByLabel("Password *").fill("password123");

    // Select role
    await page.getByRole("combobox").click();
    await page.getByText("User").click();

    // Submit form
    await page.getByText("Create User").click();

    // Wait for success
    await expect(page.getByText("Add New User")).not.toBeVisible();

    // Verify user appears in the list
    await expect(page.getByText("john.with.image@example.com")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Click add user button
    await page.getByText("Add User").click();
    await expect(page.getByText("Add New User")).toBeVisible();

    // Try to submit without filling required fields
    const createButton = page.getByText("Create User");
    await expect(createButton).toBeDisabled();

    // Fill only some fields
    await page.getByLabel("First Name *").fill("John");

    // Button should still be disabled
    await expect(createButton).toBeDisabled();

    // Fill all required fields
    await page.getByLabel("Last Name *").fill("Doe");
    await page.getByLabel("Email *").fill("john@example.com");
    await page.getByLabel("Password *").fill("password123");

    // Select role
    await page.getByRole("combobox").click();
    await page.getByText("User").click();

    // Button should now be enabled
    await expect(createButton).toBeEnabled();
  });

  test("should handle form validation errors", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Click add user button
    await page.getByText("Add User").click();
    await expect(page.getByText("Add New User")).toBeVisible();

    // Fill form with invalid email
    await page.getByLabel("First Name *").fill("John");
    await page.getByLabel("Last Name *").fill("Doe");
    await page.getByLabel("Email *").fill("invalid-email");
    await page.getByLabel("Password *").fill("password123");

    // Select role
    await page.getByRole("combobox").click();
    await page.getByText("User").click();

    // Submit form
    await page.getByText("Create User").click();

    // Should show validation error
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test("should edit existing user", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Wait for users to load
    await expect(page.getByText("john.doe@example.com")).toBeVisible();

    // Click edit button for the first user
    const editButton = page.locator('[data-testid="edit-user"]').first();
    await editButton.click();

    // Wait for edit modal to open
    await expect(page.getByText("Edit User")).toBeVisible();

    // Update first name
    const firstNameInput = page.getByLabel("First Name *");
    await firstNameInput.clear();
    await firstNameInput.fill("Updated");

    // Submit form
    await page.getByText("Update User").click();

    // Wait for modal to close
    await expect(page.getByText("Edit User")).not.toBeVisible();

    // Verify user was updated
    await expect(page.getByText("Updated")).toBeVisible();
  });

  test("should delete user", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Wait for users to load
    await expect(page.getByText("john.doe@example.com")).toBeVisible();

    // Click delete button for the first user
    const deleteButton = page.locator('[data-testid="delete-user"]').first();
    await deleteButton.click();

    // Confirm deletion
    await page.getByText("Confirm").click();

    // Verify user was removed
    await expect(page.getByText("john.doe@example.com")).not.toBeVisible();
  });

  test("should search and filter users", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Search for a specific user
    const searchInput = page.getByPlaceholder("Search users...");
    await searchInput.fill("john");

    // Wait for search results
    await expect(page.getByText("john.doe@example.com")).toBeVisible();

    // Clear search
    await searchInput.clear();

    // Filter by role
    const roleFilter = page.getByLabel("Filter by role");
    await roleFilter.click();
    await page.getByText("User").click();

    // Verify filtered results
    await expect(page.getByText("john.doe@example.com")).toBeVisible();
  });

  test("should handle pagination", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("Users Management")).toBeVisible();

    // Check if pagination controls are visible
    const nextButton = page.getByText("Next");
    const prevButton = page.getByText("Previous");

    if (await nextButton.isVisible()) {
      // Click next page
      await nextButton.click();

      // Verify page changed
      await expect(page.getByText("Page 2")).toBeVisible();

      // Click previous page
      await prevButton.click();

      // Verify back to page 1
      await expect(page.getByText("Page 1")).toBeVisible();
    }
  });
});
