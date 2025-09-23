import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Upload, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../usersSlice";
import { selectUsersLoading } from "../usersSelectors";
import { fetchHotelsForDropdown } from "../../hotels/hotelsSlice";
import {
  selectDropdownHotels,
  selectDropdownLoading,
  selectDropdownError,
} from "../../hotels/hotelsSelectors";
import { showSuccess, showError } from "../../../utils/toast";
import SearchableDropdown from "../../../common/components/SearchableDropdown";
import { useApi } from "../../../contexts/ApiContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

const UserModals = ({
  addOpen,
  setAddOpen,
  editOpen,
  setEditOpen,
  editUser,
  onUpdateUser,
  roleOptions,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUsersLoading);
  const apiClient = useApi();

  // Hotel dropdown state
  const dropdownHotels = useSelector(selectDropdownHotels);
  const dropdownLoading = useSelector(selectDropdownLoading);
  const dropdownError = useSelector(selectDropdownError);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    password: "",
    hotelId: "", // For single hotel selection in add form
    ownedHotels: [], // For hotel owners
    hotelStaffs: [], // For hotel staff
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Error states
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load hotels for dropdown when component mounts or when needed
  const loadHotelsForDropdown = React.useCallback(
    (searchParams = {}) => {
      if (apiClient) {
        dispatch(
          fetchHotelsForDropdown({
            ...searchParams,
            apiClient,
          })
        );
      }
    },
    [dispatch, apiClient]
  );

  // Check if role requires hotel selection
  const requiresHotel = (role) => {
    const result = role === "hotelOwner" || role === "hotelStaff";
    console.log("requiresHotel check:", { role, result });
    return result;
  };

  // Helper function to get hotel name from user data
  const getHotelNameFromUserData = (user, hotelId) => {
    if (!user || !hotelId) return null;

    const userRole =
      user.clerkUser?.publicMetadata?.role || user.localUser?.role;

    if (userRole === "hotelOwner" && user.localUser?.ownedHotels) {
      const hotel = user.localUser.ownedHotels.find((h) => h.id === hotelId);
      return hotel ? hotel.name : null;
    } else if (userRole === "hotelStaff" && user.localUser?.hotelStaffs) {
      const staffRecord = user.localUser.hotelStaffs.find(
        (s) => s.hotel.id === hotelId
      );
      return staffRecord ? staffRecord.hotel.name : null;
    }

    return null;
  };

  // Load hotels when component mounts or when modals open
  useEffect(() => {
    if ((addOpen || editOpen) && apiClient) {
      loadHotelsForDropdown();
    }
  }, [addOpen, editOpen, loadHotelsForDropdown]);

  // Load hotels when edit modal opens
  useEffect(() => {
    if (editOpen && editUser && apiClient) {
      console.log("Loading hotels for edit user:", editUser);
      loadHotelsForDropdown();
    }
  }, [editOpen, editUser, loadHotelsForDropdown]);

  // Handle hotel prefilling when hotel data loads and user has hotel information
  useEffect(() => {
    if (editOpen && editUser && formData.hotelId && dropdownHotels.length > 0) {
      const selectedHotel = dropdownHotels.find(
        (h) => h.id === formData.hotelId
      );
      if (selectedHotel) {
        console.log(
          "✅ Hotel found in loaded data and prefilled:",
          selectedHotel
        );
      } else {
        console.warn("❌ Hotel not found in loaded data:", formData.hotelId);
      }
    }
  }, [editOpen, editUser, formData.hotelId, dropdownHotels]);

  // Debug hotel data loading
  useEffect(() => {
    if (editOpen && editUser) {
      console.log("Edit modal opened with user:", {
        user: editUser,
        clerkUser: editUser.clerkUser,
        localUser: editUser.localUser,
        formData: formData,
        dropdownHotels: dropdownHotels,
        dropdownLoading: dropdownLoading,
        dropdownError: dropdownError,
        ownedHotels: editUser.localUser?.ownedHotels || [],
        hotelStaffs: editUser.localUser?.hotelStaffs || [],
        note: "Hotel information is now available in user data from API",
      });
    }
  }, [
    editOpen,
    editUser,
    formData,
    dropdownHotels,
    dropdownLoading,
    dropdownError,
  ]);

  // Debug form data changes
  useEffect(() => {
    if (editOpen && editUser) {
      console.log("Form data changed:", {
        formData: formData,
        hotelId: formData.hotelId,
        role: formData.role,
        requiresHotel: requiresHotel(formData.role),
      });
    }
  }, [formData, editOpen, editUser]);

  // Show error toast when hotel loading fails
  useEffect(() => {
    if (dropdownError) {
      showError(`Failed to load hotels: ${dropdownError}`);
    }
  }, [dropdownError]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (addOpen) {
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "",
        password: "",
        hotelId: "",
        ownedHotels: [],
        hotelStaffs: [],
      });
      setProfileImage(null);
      setProfileImagePreview(null);
      setFormErrors({});
      setIsSubmitting(false);
    }

    if (editOpen && editUser) {
      // Extract hotel information from the new API structure
      const userRole =
        editUser.clerkUser?.publicMetadata?.role || editUser.localUser?.role;
      let hotelId = "";

      // Determine hotel based on user role
      console.log("Checking hotel data for user:", {
        userRole,
        ownedHotels: editUser.localUser?.ownedHotels,
        ownedHotelsLength: editUser.localUser?.ownedHotels?.length,
        hotelStaffs: editUser.localUser?.hotelStaffs,
        hotelStaffsLength: editUser.localUser?.hotelStaffs?.length,
        localUserKeys: Object.keys(editUser.localUser || {}),
      });

      // Extract hotel associations based on role
      let ownedHotels = [];
      let hotelStaffs = [];
      let displayHotelId = "";

      console.log("Setting form data for edit user:", {
        user: editUser,
        clerkUser: editUser.clerkUser,
        localUser: editUser.localUser,
        role: userRole,
        hotelId: hotelId,
        displayHotelId: displayHotelId,
        ownedHotels: editUser.localUser?.ownedHotels || [],
        hotelStaffs: editUser.localUser?.hotelStaffs || [],
        requiresHotel: requiresHotel(userRole),
      });

      if (
        userRole === "hotelOwner" &&
        editUser.localUser?.ownedHotels?.length > 0
      ) {
        ownedHotels = editUser.localUser.ownedHotels.map((hotel) => hotel.id);
        displayHotelId = ownedHotels[0]; // Use first owned hotel for display
      } else if (
        userRole === "hotelStaff" &&
        editUser.localUser?.hotelStaffs?.length > 0
      ) {
        hotelStaffs = editUser.localUser.hotelStaffs.map((staff) => ({
          hotelId: staff.hotel.id,
          role: staff.role || "staff",
          isActive: staff.isActive !== undefined ? staff.isActive : true,
        }));
        displayHotelId = hotelStaffs[0]?.hotelId || ""; // Use first staff hotel for display
      }

      const newFormData = {
        email: editUser.clerkUser?.email || editUser.localUser?.email || "",
        firstName:
          editUser.clerkUser?.firstName || editUser.localUser?.firstName || "",
        lastName:
          editUser.clerkUser?.lastName || editUser.localUser?.lastName || "",
        phone: editUser.localUser?.phone || "",
        role: userRole || "",
        password: "", // Password not used in edit mode
        hotelId: displayHotelId, // Set the display hotel ID
        ownedHotels: ownedHotels,
        hotelStaffs: hotelStaffs,
      };

      console.log("Setting form data:", newFormData);
      setFormData(newFormData);
      setProfileImagePreview(editUser.localUser?.profileImageUrl || null);
      setProfileImage(null);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [addOpen, editOpen, editUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showError("Image size must be less than 5MB");
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    // Validate form before submission
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      showError("Please fix the errors below and try again");
      return;
    }

    setIsSubmitting(true);

    try {
      if (addOpen) {
        // Create user
        const userData = {
          ...formData,
          profileImage,
        };

        // Add hotel associations based on role
        if (formData.role === "hotelOwner" && formData.hotelId) {
          userData.ownedHotels = [formData.hotelId];
        } else if (formData.role === "hotelStaff" && formData.hotelId) {
          userData.hotelStaffs = [
            {
              hotelId: formData.hotelId,
              role: "staff",
              isActive: true,
            },
          ];
        }

        await dispatch(createUser({ userData, apiClient })).unwrap();

        showSuccess("User created successfully!");
        setAddOpen(false);
        // dispatch(fetchUsers()); // Refresh users after creation - Removed as per edit hint
      } else if (editOpen && editUser) {
        // Update user
        const userData = {
          ...formData,
          profileImage,
        };

        // Add hotel associations based on role for update
        if (
          formData.role === "hotelOwner" &&
          formData.ownedHotels?.length > 0
        ) {
          userData.ownedHotels = formData.ownedHotels;
        } else if (
          formData.role === "hotelStaff" &&
          formData.hotelStaffs?.length > 0
        ) {
          userData.hotelStaffs = formData.hotelStaffs;
        }

        const userId = editUser.clerkUser?.id;
        console.log(
          "Updating user with Clerk ID:",
          userId,
          "editUser structure:",
          editUser
        );
        console.log("Available IDs:", {
          localUserId: editUser.localUser?.id,
          clerkUserId: editUser.clerkUser?.id,
          editUserId: editUser.id,
        });

        if (!userId) {
          showError("User ID not found. Cannot update user.");
          return;
        }

        await dispatch(
          updateUser({
            id: userId,
            userData,
            profileImage,
            apiClient,
          })
        ).unwrap();

        showSuccess("User updated successfully!");
        setEditOpen(false);
        setEditUser(null);
        // dispatch(fetchUsers()); // Refresh users after update - Removed as per edit hint
      }
    } catch (error) {
      handleUserError(error, addOpen ? "create" : "update");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // First name validation
    if (!formData.firstName) {
      errors.firstName = "First name is required";
    } else if (
      formData.firstName.length < 1 ||
      formData.firstName.length > 100
    ) {
      errors.firstName = "First name must be between 1 and 100 characters";
    }

    // Last name validation
    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.length < 1 || formData.lastName.length > 100) {
      errors.lastName = "Last name must be between 1 and 100 characters";
    }

    // Password validation (only for create)
    // Password validation (only for add form, not edit form)
    if (addOpen) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && formData.phone.length > 20) {
      errors.phone = "Phone number must be less than 20 characters";
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Role is required";
    }

    // Hotel validation for hotel-related roles
    if (requiresHotel(formData.role) && !formData.hotelId) {
      errors.hotelId = "Hotel selection is required for this role";
    }

    return errors;
  };

  // Comprehensive error handling function
  const handleUserError = (error, operation) => {
    console.error(`User ${operation} error:`, error);

    // Handle different types of errors
    if (error?.response?.data) {
      const errorData = error.response.data;

      // Handle validation errors (400)
      if (errorData.statusCode === 400) {
        if (
          errorData.errors &&
          Array.isArray(errorData.errors) &&
          errorData.errors.length > 0
        ) {
          // Map server validation errors to form fields
          const fieldErrors = {};
          errorData.errors.forEach((err) => {
            const field = err.field || err.path || "general";
            fieldErrors[field] = err.message || err;
          });

          if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(fieldErrors);
            showError("Please fix the validation errors below");
            return;
          }

          // Show specific validation errors
          const validationErrors = errorData.errors
            .map((err) => err.message || err)
            .join(", ");
          showError(`Validation failed: ${validationErrors}`);
        } else if (errorData.message) {
          showError(errorData.message);
        } else {
          showError("Please check your input and try again");
        }
      }
      // Handle unauthorized errors (401)
      else if (errorData.statusCode === 401) {
        showError("You are not authorized to perform this action");
      }
      // Handle forbidden errors (403)
      else if (errorData.statusCode === 403) {
        showError("You don't have permission to perform this action");
      }
      // Handle not found errors (404)
      else if (errorData.statusCode === 404) {
        showError("User not found or resource unavailable");
      }
      // Handle conflict errors (409)
      else if (errorData.statusCode === 409) {
        showError("A user with this email already exists");
      }
      // Handle server errors (500+)
      else if (errorData.statusCode >= 500) {
        showError("Server error occurred. Please try again later");
      }
      // Handle other API errors
      else {
        showError(errorData.message || `Failed to ${operation} user`);
      }
    }
    // Handle network errors
    else if (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("Network Error")
    ) {
      showError("Network error. Please check your connection and try again");
    }
    // Handle timeout errors
    else if (error?.code === "TIMEOUT" || error?.message?.includes("timeout")) {
      showError("Request timed out. Please try again");
    }
    // Handle API client errors
    else if (error?.message?.includes("API client")) {
      showError("API connection error. Please refresh the page and try again");
    }
    // Handle file upload errors
    else if (
      error?.message?.includes("profileImage") ||
      error?.message?.includes("file")
    ) {
      showError("Error uploading profile image. Please try a different image");
    }
    // Handle hotel selection errors
    else if (
      error?.message?.includes("hotel") ||
      error?.message?.includes("Hotel")
    ) {
      showError("Error with hotel selection. Please select a valid hotel");
    }
    // Handle role-related errors
    else if (
      error?.message?.includes("role") ||
      error?.message?.includes("Role")
    ) {
      showError("Error with role selection. Please select a valid role");
    }
    // Handle generic errors
    else {
      const errorMessage =
        error?.message || error?.toString() || `Failed to ${operation} user`;
      showError(errorMessage);
    }
  };

  const isFormValid = () => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <>
      {/* Custom backdrop with blur - rendered outside Sheet for immediate effect */}
      {(addOpen || editOpen) && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-200"
          onClick={() => {
            if (addOpen) setAddOpen(false);
            if (editOpen) setEditOpen(false);
          }}
        />
      )}

      {/* Add User Modal */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="w-96">
          <div className="h-full flex flex-col relative z-50">
            <SheetHeader className="pb-6 px-6">
              <SheetTitle>Add New User</SheetTitle>
              <SheetDescription>Create a new user account</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground">
                    Profile Image
                  </Label>
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileImagePreview} />
                      <AvatarFallback className="text-lg">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {profileImagePreview
                          ? "Change your profile picture"
                          : "Upload a profile picture"}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <Label
                          htmlFor="profile-image-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          {profileImagePreview
                            ? "Change Image"
                            : "Choose Image"}
                        </Label>

                        {profileImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeProfileImage}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {profileImage && (
                        <div className="text-xs text-muted-foreground">
                          Selected: {profileImage.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-foreground"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                        className={`w-full ${
                          formErrors.firstName ? "border-destructive" : ""
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-destructive">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-foreground"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                        className={`w-full ${
                          formErrors.lastName ? "border-destructive" : ""
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-destructive">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className={`w-full ${
                        formErrors.email ? "border-destructive" : ""
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+966501234567"
                      className={`w-full ${
                        formErrors.phone ? "border-destructive" : ""
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-destructive">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-sm font-medium text-foreground"
                    >
                      Role *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => {
                        handleInputChange("role", value);
                        // Clear hotel selection when role changes
                        if (!requiresHotel(value)) {
                          handleInputChange("hotelId", "");
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          formErrors.role ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-sm text-destructive">
                        {formErrors.role}
                      </p>
                    )}
                  </div>

                  {/* Hotel Selection for Hotel-related Roles */}
                  {requiresHotel(formData.role) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Hotel *
                      </Label>
                      {console.log("Add form - SearchableDropdown props:", {
                        value: formData.hotelId,
                        role: formData.role,
                        requiresHotel: requiresHotel(formData.role),
                        dropdownHotels: dropdownHotels.length,
                        dropdownLoading: dropdownLoading,
                      })}
                      <SearchableDropdown
                        value={formData.hotelId}
                        onChange={(value) => {
                          console.log(
                            "Hotel selection changed (add form):",
                            value
                          );
                          handleInputChange("hotelId", value);
                        }}
                        data={dropdownHotels}
                        dataKey="id"
                        labelKey="name"
                        searchKey="searchableText"
                        placeholder="Select hotel"
                        searchPlaceholder="Search hotels..."
                        showBadge={true}
                        badgeVariant="secondary"
                        disabled={dropdownLoading}
                        loadingMessage="Loading hotels..."
                        emptyMessage={
                          dropdownError
                            ? "Error loading hotels"
                            : "No hotels found"
                        }
                        className={
                          formErrors.hotelId ? "border-destructive" : ""
                        }
                        renderOption={(hotel) => (
                          <div className="flex flex-col py-2 px-3 hover:bg-accent rounded-sm cursor-pointer">
                            <div className="font-medium text-sm">
                              {hotel.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {[
                                hotel.city?.name,
                                hotel.state?.name,
                                hotel.country?.name,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        )}
                        renderSelected={(selectedItems, localData) => {
                          if (selectedItems.length === 0) {
                            return "Select hotel";
                          }

                          // First try to find hotel in loaded dropdown data
                          const hotel = localData.find(
                            (h) => h.id === selectedItems[0]
                          );
                          if (hotel) {
                            return hotel.name;
                          }

                          // If not found in dropdown data, try to get name from user data
                          const hotelNameFromUser = getHotelNameFromUserData(
                            editUser,
                            selectedItems[0]
                          );
                          if (hotelNameFromUser) {
                            return hotelNameFromUser;
                          }

                          // Fallback to loading state or ID
                          return dropdownLoading
                            ? "Loading..."
                            : selectedItems[0];
                        }}
                      />
                      {formErrors.hotelId && (
                        <p className="text-sm text-destructive">
                          {formErrors.hotelId}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className={`w-full ${
                        formErrors.password ? "border-destructive" : ""
                      }`}
                    />
                    {formErrors.password && (
                      <p className="text-sm text-destructive">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="border-t bg-background px-6 py-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid() || loading || isSubmitting}
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  {loading || isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit User Modal */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="w-96">
          <div className="h-full flex flex-col relative z-50">
            <SheetHeader className="pb-6 px-6">
              <SheetTitle>Edit User</SheetTitle>
              <SheetDescription>Update user information</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground">
                    Profile Image
                  </Label>
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileImagePreview} />
                      <AvatarFallback className="text-lg">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {profileImagePreview
                          ? "Change your profile picture"
                          : "Upload a profile picture"}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                          id="edit-profile-image-upload"
                        />
                        <Label
                          htmlFor="edit-profile-image-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          {profileImagePreview
                            ? "Change Image"
                            : "Choose Image"}
                        </Label>

                        {(profileImage || profileImagePreview) && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeProfileImage}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {profileImage && (
                        <div className="text-xs text-muted-foreground">
                          Selected: {profileImage.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="editFirstName"
                        className="text-sm font-medium text-foreground"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="editFirstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                        className={`w-full ${
                          formErrors.firstName ? "border-destructive" : ""
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-destructive">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="editLastName"
                        className="text-sm font-medium text-foreground"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="editLastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                        className={`w-full ${
                          formErrors.lastName ? "border-destructive" : ""
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-destructive">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="editEmail"
                      className="text-sm font-medium text-foreground"
                    >
                      Email *
                    </Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className={`w-full ${
                        formErrors.email ? "border-destructive" : ""
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="editPhone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone
                    </Label>
                    <Input
                      id="editPhone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+966501234567"
                      className={`w-full ${
                        formErrors.phone ? "border-destructive" : ""
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-destructive">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="editRole"
                      className="text-sm font-medium text-foreground"
                    >
                      Role *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => {
                        handleInputChange("role", value);
                        // Clear hotel selection when role changes
                        if (!requiresHotel(value)) {
                          handleInputChange("hotelId", "");
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          formErrors.role ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-sm text-destructive">
                        {formErrors.role}
                      </p>
                    )}
                  </div>

                  {/* Hotel Selection for Hotel-related Roles */}
                  {requiresHotel(formData.role) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Hotel *
                      </Label>
                      {console.log("Edit form - SearchableDropdown props:", {
                        value: formData.hotelId,
                        role: formData.role,
                        requiresHotel: requiresHotel(formData.role),
                        dropdownHotels: dropdownHotels.length,
                        dropdownLoading: dropdownLoading,
                        ownedHotels: formData.ownedHotels,
                        hotelStaffs: formData.hotelStaffs,
                        formDataKeys: Object.keys(formData),
                      })}
                      <SearchableDropdown
                        value={formData.hotelId}
                        onChange={(value) => {
                          console.log(
                            "Hotel selection changed (edit form):",
                            value
                          );
                          handleInputChange("hotelId", value);

                          // Update hotel associations based on role
                          if (formData.role === "hotelOwner") {
                            setFormData((prev) => ({
                              ...prev,
                              ownedHotels: value ? [value] : [],
                            }));
                          } else if (formData.role === "hotelStaff") {
                            setFormData((prev) => ({
                              ...prev,
                              hotelStaffs: value
                                ? [
                                    {
                                      hotelId: value,
                                      role: "staff",
                                      isActive: true,
                                    },
                                  ]
                                : [],
                            }));
                          }
                        }}
                        data={dropdownHotels}
                        dataKey="id"
                        labelKey="name"
                        searchKey="searchableText"
                        placeholder="Select hotel"
                        searchPlaceholder="Search hotels..."
                        showBadge={true}
                        badgeVariant="secondary"
                        disabled={dropdownLoading}
                        loadingMessage="Loading hotels..."
                        emptyMessage={
                          dropdownError
                            ? "Error loading hotels"
                            : "No hotels found"
                        }
                        className={
                          formErrors.hotelId ? "border-destructive" : ""
                        }
                        renderOption={(hotel) => (
                          <div className="flex flex-col py-2 px-3 hover:bg-accent rounded-sm cursor-pointer">
                            <div className="font-medium text-sm">
                              {hotel.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {[
                                hotel.city?.name,
                                hotel.state?.name,
                                hotel.country?.name,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        )}
                        renderSelected={(selectedItems, localData) => {
                          if (selectedItems.length === 0) {
                            return "Select hotel";
                          }

                          // First try to find hotel in loaded dropdown data
                          const hotel = localData.find(
                            (h) => h.id === selectedItems[0]
                          );
                          if (hotel) {
                            return hotel.name;
                          }

                          // If not found in dropdown data, try to get name from user data
                          const hotelNameFromUser = getHotelNameFromUserData(
                            editUser,
                            selectedItems[0]
                          );
                          if (hotelNameFromUser) {
                            return hotelNameFromUser;
                          }

                          // Fallback to loading state or ID
                          return dropdownLoading
                            ? "Loading..."
                            : selectedItems[0];
                        }}
                      />
                      {formErrors.hotelId && (
                        <p className="text-sm text-destructive">
                          {formErrors.hotelId}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="border-t bg-background px-6 py-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid() || loading || isSubmitting}
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  {loading || isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UserModals;
