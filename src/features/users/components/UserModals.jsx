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
import { showSuccess, showError } from "../../../utils/toast";
import SearchableDropdown from "../../../common/components/SearchableDropdown";

import { Badge } from "@/components/ui/badge";

const UserModals = ({
  addOpen,
  setAddOpen,
  editOpen,
  setEditOpen,
  editUser,
  onUpdateUser,
  roleOptions,
  apiClient,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUsersLoading);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    password: "",
    hotelId: "",
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Hotel fetching function
  const fetchHotelsForDropdown = async () => {
    try {
      const response = await apiClient.get("/hotels?page=1&pageSize=100");

      if (response.success && response.data?.hotels) {
        return response.data.hotels.map((hotel) => ({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location || hotel.city || "",
          badge: hotel.status || "active",
        }));
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
      return [];
    }
  };

  // Check if role requires hotel selection
  const requiresHotel = (role) => {
    return role === "hotelOwner" || role === "hotelStaff";
  };

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
      });
      setProfileImage(null);
      setProfileImagePreview(null);
    }

    if (editOpen && editUser) {
      setFormData({
        email: editUser.clerkUser?.email || editUser.localUser?.email || "",
        firstName:
          editUser.clerkUser?.firstName || editUser.localUser?.firstName || "",
        lastName:
          editUser.clerkUser?.lastName || editUser.localUser?.lastName || "",
        phone: editUser.localUser?.phone || "",
        role:
          editUser.clerkUser?.publicMetadata?.role ||
          editUser.localUser?.role ||
          "",
        password: "",
        hotelId: editUser.localUser?.hotelId || "",
      });
      setProfileImagePreview(editUser.localUser?.profileImageUrl || null);
      setProfileImage(null);
    }
  }, [addOpen, editOpen, editUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

    if (addOpen) {
      // Create user
      try {
        const userData = {
          ...formData,
          profileImage,
        };

        // Add hotelId if role requires it
        if (requiresHotel(formData.role) && formData.hotelId) {
          userData.hotelId = formData.hotelId;
        }

        await dispatch(createUser({ userData, apiClient })).unwrap();

        showSuccess("User created successfully!");
        setAddOpen(false);
        // dispatch(fetchUsers()); // Refresh users after creation - Removed as per edit hint
      } catch (error) {
        showError(error || "Failed to create user");
      }
    } else if (editOpen && editUser) {
      // Update user
      try {
        const userData = {
          ...formData,
          profileImage,
        };

        // Add hotelId if role requires it
        if (requiresHotel(formData.role) && formData.hotelId) {
          userData.hotelId = formData.hotelId;
        }

        await dispatch(
          updateUser({
            id: editUser.clerkUser?.id || editUser.id,
            userData,
            profileImage,
            apiClient,
          })
        ).unwrap();

        showSuccess("User updated successfully!");
        setEditOpen(false);
        setEditUser(null);
        // dispatch(fetchUsers()); // Refresh users after update - Removed as per edit hint
      } catch (error) {
        showError(error || "Failed to update user");
      }
    }
  };

  const isFormValid = () => {
    if (addOpen) {
      const baseValid =
        formData.email &&
        formData.firstName &&
        formData.lastName &&
        formData.role &&
        formData.password;
      if (requiresHotel(formData.role)) {
        return baseValid && formData.hotelId;
      }
      return baseValid;
    }

    const baseValid =
      formData.email &&
      formData.firstName &&
      formData.lastName &&
      formData.role;
    if (requiresHotel(formData.role)) {
      return baseValid && formData.hotelId;
    }
    return baseValid;
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
                        className="w-full"
                      />
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
                        className="w-full"
                      />
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
                      className="w-full"
                    />
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
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-sm font-medium text-foreground"
                    >
                      Role *
                    </Label>
                    <SearchableDropdown
                      value={formData.role}
                      onChange={(value) => {
                        handleInputChange("role", value);
                        // Clear hotel selection when role changes
                        if (!requiresHotel(value)) {
                          handleInputChange("hotelId", "");
                        }
                      }}
                      data={roleOptions}
                      dataKey="value"
                      labelKey="label"
                      placeholder="Select role"
                      searchPlaceholder="Search roles..."
                    />
                  </div>

                  {/* Hotel Selection for Hotel-related Roles */}
                  {requiresHotel(formData.role) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Hotel *
                      </Label>
                      <SearchableDropdown
                        value={formData.hotelId}
                        onChange={(value) =>
                          handleInputChange("hotelId", value)
                        }
                        fetchData={fetchHotelsForDropdown}
                        dataKey="id"
                        labelKey="name"
                        searchKey="name"
                        placeholder="Select hotel"
                        searchPlaceholder="Search hotels..."
                        showBadge={true}
                        badgeVariant="secondary"
                        renderOption={(hotel) => (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{hotel.name}</span>
                              {hotel.location && (
                                <span className="text-xs text-muted-foreground">
                                  {hotel.location}
                                </span>
                              )}
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {hotel.badge}
                            </Badge>
                          </div>
                        )}
                      />
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
                      className="w-full"
                    />
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
                  disabled={!isFormValid() || loading}
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  {loading ? "Creating..." : "Create User"}
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
                        className="w-full"
                      />
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
                        className="w-full"
                      />
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
                      className="w-full"
                    />
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
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="editRole"
                      className="text-sm font-medium text-foreground"
                    >
                      Role *
                    </Label>
                    <SearchableDropdown
                      value={formData.role}
                      onChange={(value) => {
                        handleInputChange("role", value);
                        // Clear hotel selection when role changes
                        if (!requiresHotel(value)) {
                          handleInputChange("hotelId", "");
                        }
                      }}
                      data={roleOptions}
                      dataKey="value"
                      labelKey="label"
                      placeholder="Select role"
                      searchPlaceholder="Search roles..."
                    />
                  </div>

                  {/* Hotel Selection for Hotel-related Roles */}
                  {requiresHotel(formData.role) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Hotel *
                      </Label>
                      <SearchableDropdown
                        value={formData.hotelId}
                        onChange={(value) =>
                          handleInputChange("hotelId", value)
                        }
                        fetchData={fetchHotelsForDropdown}
                        dataKey="id"
                        labelKey="name"
                        searchKey="name"
                        placeholder="Select hotel"
                        searchPlaceholder="Search hotels..."
                        showBadge={true}
                        badgeVariant="secondary"
                        renderOption={(hotel) => (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{hotel.name}</span>
                              {hotel.location && (
                                <span className="text-xs text-muted-foreground">
                                  {hotel.location}
                                </span>
                              )}
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {hotel.badge}
                            </Badge>
                          </div>
                        )}
                      />
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
                  disabled={!isFormValid() || loading}
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  {loading ? "Updating..." : "Update User"}
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
