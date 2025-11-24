import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { useApi } from "../../../contexts/ApiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { AmenityItem } from "@/common/components/hotel/AmenityItem";
import AddButton from "@/components/AddButton";
import EmojiPicker from "emoji-picker-react";
import ConfirmationPopup from "@/common/components/Popup/ConfirmationPopup";
import { Trash2 } from "lucide-react";
import {
  fetchAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  setAmenitiesFilters,
  setAmenitiesType,
  setAmenitiesLocale,
  setAmenitiesPagination,
} from "../amenitiesSlice";
import {
  selectAmenities,
  selectAmenitiesLoading,
  selectAmenitiesError,
  selectAmenitiesFilters,
  selectAmenitiesPagination,
  selectHotelAmenities,
  selectRoomAmenities,
  selectFilteredAmenities,
} from "../amenitiesSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Spinner } from "@/common/components/spinner";

export default function GlobalAmenities() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const apiClient = useApi();

  // Redux state
  const amenities = useSelector(selectAmenities);
  const loading = useSelector(selectAmenitiesLoading);
  const error = useSelector(selectAmenitiesError);
  const filters = useSelector(selectAmenitiesFilters);
  const pagination = useSelector(selectAmenitiesPagination);
  const hotelAmenities = useSelector(selectHotelAmenities);
  const roomAmenities = useSelector(selectRoomAmenities);

  // Local state
  const [addOpen, setAddOpen] = useState(false);
  const [amenitieType, setAmenitieType] = useState("Hotel");
  const [btnOpen, setBtnOpen] = useState(false);
  const [addAmenity, setAddAmenity] = useState({
    id: null,
    name: "",
    displayName: "",
    description: "",
    displayNameAr: "",
    descriptionAr: "",
    icon: "",
    type: "hotel",
  });
  const [amenityType, setAmenityType] = useState("hotel");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    amenity: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // AR toggle state (locale)
  const isArabic = filters.locale === "ar";

  // Sync local amenityType with Redux filter on mount
  useEffect(() => {
    if (filters.type && filters.type !== amenityType) {
      setAmenityType(filters.type);
      setAmenitieType(filters.type === "hotel" ? "Hotel" : "Room");
    }
  }, [filters.type]);

  // Fetch amenities on mount and when filters change
  // Note: API now returns both English and Arabic, so locale is only for display
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchAmenities({
          apiClient,
          type: filters.type,
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm || undefined,
        })
      );
    }
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    apiClient,
    filters.type,
    pagination.page,
    pagination.limit,
    searchTerm,
  ]);

  // Handle type filter change
  const handleTypeChange = (type) => {
    setAmenityType(type);
    setAmenitieType(type === "hotel" ? "Hotel" : "Room");
    dispatch(setAmenitiesType(type === "hotel" ? "hotel" : "room"));
  };

  // Handle AR toggle
  const handleLocaleToggle = (checked) => {
    dispatch(setAmenitiesLocale(checked ? "ar" : "en"));
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setAmenitiesFilters({ search: searchTerm || "" }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setAmenitiesPagination({ page: newPage }));
  };

  // Get current amenities based on type filter
  const currentAmenities =
    amenityType === "hotel" ? hotelAmenities : roomAmenities;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!addAmenity.name || !addAmenity.displayName || !addAmenity.type) {
      showError("Please fill in the name, display name, and type fields");
      return;
    }

    // Check if we're updating or creating
    const isUpdate = btnOpen && addAmenity.id;

    if (isUpdate) {
      // Update existing amenity
      try {
        // Build update payload - name can be updated
        const updateData = {};

        // Always include name if provided (can be updated)
        if (addAmenity.name) {
          updateData.name = addAmenity.name;
        }

        // Always include type
        if (addAmenity.type || amenityType) {
          updateData.type = addAmenity.type || amenityType;
        }

        // Always send both English and Arabic fields
        if (addAmenity.displayName) {
          updateData.displayName = addAmenity.displayName;
        }
        if (addAmenity.description !== undefined) {
          updateData.description = addAmenity.description || null;
        }
        if (addAmenity.displayNameAr) {
          updateData.displayNameAr = addAmenity.displayNameAr;
        }
        if (addAmenity.descriptionAr !== undefined) {
          updateData.descriptionAr = addAmenity.descriptionAr || null;
        }

        // Add icon if provided
        if (addAmenity.icon !== undefined) {
          updateData.icon = addAmenity.icon || null;
        }

        const result = await dispatch(
          updateAmenity({
            id: addAmenity.id,
            amenityData: updateData,
            locale: filters.locale,
            apiClient,
          })
        ).unwrap();

        showSuccess("Amenity updated successfully");
        handleCancel();
        
        // Refresh the list to get updated data
        dispatch(
          fetchAmenities({
            apiClient,
            type: filters.type,
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm || undefined,
          })
        );
      } catch (error) {
        console.error("Failed to update amenity:", error);
        // Error is already handled by the thunk and shown via toast
      }
    } else {
      // Create new amenity
      try {
        // Build create payload - required fields: name, displayName, type
        const createData = {
          name: addAmenity.name.trim().toLowerCase().replace(/\s+/g, "-"), // Ensure lowercase, no spaces
          displayName: addAmenity.displayName,
          type: addAmenity.type || amenityType,
        };

        // Add optional fields
        if (addAmenity.description) {
          createData.description = addAmenity.description;
        }
        if (addAmenity.displayNameAr) {
          createData.displayNameAr = addAmenity.displayNameAr;
        }
        if (addAmenity.descriptionAr) {
          createData.descriptionAr = addAmenity.descriptionAr;
        }
        if (addAmenity.icon) {
          createData.icon = addAmenity.icon;
        }

        const result = await dispatch(
          createAmenity({
            amenityData: createData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Amenity created successfully");
        handleCancel();

        // Refresh the list to show the new amenity
        dispatch(
          fetchAmenities({
            apiClient,
            type: filters.type,
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm || undefined,
          })
        );
      } catch (error) {
        console.error("Failed to create amenity:", error);
        // Error is already handled by the thunk and shown via toast
      }
    }
  };

  const handleCancel = () => {
    setAddOpen(false);
    setBtnOpen(false);
    setAmenitieType("Hotel");
    setAddAmenity({
      id: null,
      name: "",
      displayName: "",
      description: "",
      displayNameAr: "",
      descriptionAr: "",
      icon: "",
      type: "hotel",
    });
  };

  // Delete handlers
  const handleDeleteClick = (amenity) => {
    setDeleteModal({
      open: true,
      amenity,
    });
  };

  const handleDeleteModalClose = () => {
    setDeleteModal({
      open: false,
      amenity: null,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.amenity || !deleteModal.amenity.id) {
      return;
    }

    setDeleteLoading(true);
    try {
      await dispatch(
        deleteAmenity({
          id: deleteModal.amenity.id,
          apiClient,
        })
      ).unwrap();

      showSuccess("Amenity deleted successfully");
      handleDeleteModalClose();

      // Refresh the list to update the count
      dispatch(
        fetchAmenities({
          apiClient,
          type: filters.type,
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm || undefined,
        })
      );
    } catch (error) {
      console.error("Failed to delete amenity:", error);
      // Error is already handled by the thunk and shown via toast
    } finally {
      setDeleteLoading(false);
    }
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  if (!isLoaded) return <Spinner />;
  if (!isSignedIn) return <div>Please sign in.</div>;

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Global Amenities</h1>
        <div className="flex items-center gap-4">
          {/* AR Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="ar-toggle" className="text-sm">
              English
            </Label>
            <Switch
              id="ar-toggle"
              checked={isArabic}
              onCheckedChange={handleLocaleToggle}
            />
            <Label htmlFor="ar-toggle" className="text-sm">
              Arabic
            </Label>
          </div>
          <AddButton
            buttonValue="Add Amenity"
            onAdd={() => {
              setAddOpen(true);
              setBtnOpen(false);
              setAddAmenity({
                id: null,
                name: "",
                displayName: "",
                description: "",
                displayNameAr: "",
                descriptionAr: "",
                icon: "",
                type: amenityType,
              });
            }}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search amenities..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-md"
        />
      </div>

      {/* Type Filter Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          className={
            amenityType === "hotel"
              ? ""
              : "bg-accent text-accent-foreground hover:bg-accent/15 border cursor-pointer"
          }
          onClick={() => handleTypeChange("hotel")}
        >
          Hotel Amenities
        </Button>
        <Button
          className={
            amenityType === "room"
              ? ""
              : "bg-accent text-accent-foreground hover:bg-accent/15 border cursor-pointer"
          }
          onClick={() => handleTypeChange("room")}
        >
          Room Amenities
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {/* Amenities List */}
      {!loading && !error && (
        <>
          {amenityType === "hotel" && (
            <div className="mt-4">
              <div className="text-xl font-bold">
                Hotel Amenities ({hotelAmenities.length})
              </div>
              {hotelAmenities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hotel amenities found
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-1 ">
                  {hotelAmenities.map((amenity) => {
                    // Use locale toggle to determine which language to display
                    const displayName = isArabic
                      ? amenity.ar?.displayName || amenity.displayName
                      : amenity.displayName;
                    const description = isArabic
                      ? amenity.ar?.description || amenity.description
                      : amenity.description;

                    return (
                      <AmenityItem
                        key={amenity.id}
                        amenity={{
                          ...amenity,
                          name: displayName || amenity.name,
                          describation: description || amenity.description,
                          icon: amenity.icon || amenity.iconUrl || null,
                        }}
                        onAdd={() => {
                          setAddOpen(true);
                          setBtnOpen(true);
                          setAmenitieType("Hotel");
                          setAddAmenity({
                            id: amenity.id,
                            name: amenity.name || "",
                            displayName: amenity.displayName || "",
                            description: amenity.description || "",
                            displayNameAr: amenity.ar?.displayName || "",
                            descriptionAr: amenity.ar?.description || "",
                            icon: amenity.icon || "",
                            type: amenity.type || "hotel",
                          });
                        }}
                      onDelete={() => handleDeleteClick(amenity)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {amenityType === "room" && (
            <div>
              <div className="text-xl font-bold mt-4">
                Room Amenities ({roomAmenities.length})
              </div>
              {roomAmenities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No room amenities found
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-1 ">
                  {roomAmenities.map((amenity) => {
                    // Use locale toggle to determine which language to display
                    const displayName = isArabic
                      ? amenity.ar?.displayName || amenity.displayName
                      : amenity.displayName;
                    const description = isArabic
                      ? amenity.ar?.description || amenity.description
                      : amenity.description;

                    return (
                      <AmenityItem
                        key={amenity.id}
                        amenity={{
                          ...amenity,
                          name: displayName || amenity.name,
                          describation: description || amenity.description,
                          icon: amenity.icon || amenity.iconUrl || null,
                        }}
                        onAdd={() => {
                          setAddOpen(true);
                          setBtnOpen(true);
                          setAmenitieType("Room");
                          setAddAmenity({
                            id: amenity.id,
                            name: amenity.name || "",
                            displayName: amenity.displayName || "",
                            description: amenity.description || "",
                            displayNameAr: amenity.ar?.displayName || "",
                            descriptionAr: amenity.ar?.description || "",
                            icon: amenity.icon || "",
                            type: amenity.type || "room",
                          });
                        }}
                      onDelete={() => handleDeleteClick(amenity)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total)
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Amenity Sheet */}
      <Sheet open={addOpen} onOpenChange={handleCancel}>
        <SheetContent side="right" className="max-w-md w-full overflow-y-auto ">
          <SheetHeader>
            <SheetTitle>
              {btnOpen ? "Edit" : "Add"} {amenitieType} Amenity
            </SheetTitle>
            <SheetDescription>
              Enter the amenity details in both English and Arabic
            </SheetDescription>
          </SheetHeader>
          <form className="px-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              {/* Name field - always required */}
              <label className="text-sm font-medium" htmlFor="name">
                Name (Unique Identifier) *
              </label>
              <Input
                placeholder="e.g., wifi, pool, tv"
                id="name"
                value={addAmenity.name}
                onChange={(e) => {
                  setAddAmenity({ ...addAmenity, name: e.target.value });
                }}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier (must be unique across all amenities)
              </p>

              {/* Display Name - English */}
              <label className="text-sm font-medium" htmlFor="displayName">
                Display Name (English) *
              </label>
              <Input
                placeholder="e.g., Free WiFi"
                id="displayName"
                value={addAmenity.displayName}
                onChange={(e) => {
                  setAddAmenity({
                    ...addAmenity,
                    displayName: e.target.value,
                  });
                }}
                className="w-full"
                required
                dir="ltr"
              />

              {/* Display Name - Arabic */}
              <label className="text-sm font-medium" htmlFor="displayNameAr">
                Display Name (Arabic)
              </label>
              <Input
                placeholder="e.g., واي فاي مجاني"
                id="displayNameAr"
                value={addAmenity.displayNameAr || ""}
                onChange={(e) => {
                  setAddAmenity({
                    ...addAmenity,
                    displayNameAr: e.target.value,
                  });
                }}
                className="w-full"
                dir="rtl"
              />

              {/* Description - English */}
              <label className="text-sm font-medium" htmlFor="description">
                Description (English)
              </label>
              <Textarea
                id="description"
                placeholder="Detailed description of the amenity"
                value={addAmenity.description || ""}
                onChange={(e) => {
                  setAddAmenity({
                    ...addAmenity,
                    description: e.target.value,
                  });
                }}
                className="w-full"
                dir="ltr"
              />

              {/* Description - Arabic */}
              <label className="text-sm font-medium" htmlFor="descriptionAr">
                Description (Arabic)
              </label>
              <Textarea
                id="descriptionAr"
                placeholder="وصف تفصيلي للميزة"
                value={addAmenity.descriptionAr || ""}
                onChange={(e) => {
                  setAddAmenity({
                    ...addAmenity,
                    descriptionAr: e.target.value,
                  });
                }}
                className="w-full"
                dir="rtl"
              />

              {/* Type selector */}
              <label className="text-sm font-medium" htmlFor="type">
                Type *
              </label>
              <Select
                value={addAmenity.type || amenityType}
                onValueChange={(value) => {
                  setAddAmenity({ ...addAmenity, type: value });
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select amenity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                </SelectContent>
              </Select>

              {/* Icon picker */}
              <div>
                <label className="text-sm font-medium">Icon</label>
                {addAmenity.icon && (
                  <div className="mb-2">
                    <img
                      src={addAmenity.icon}
                      className="w-10 h-10 rounded"
                      alt="Selected icon"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setAddAmenity((prev) => ({
                          ...prev,
                          icon: "",
                        }));
                      }}
                    >
                      Remove Icon
                    </Button>
                  </div>
                )}
                <EmojiPicker
                  onEmojiClick={(emoji) => {
                    setAddAmenity((prev) => ({
                      ...prev,
                      icon: emoji.imageUrl,
                    }));
                  }}
                  height={350}
                  width={"100%"}
                  skinTonesDisabled={true}
                  theme={
                    resolvedTheme === "dark" || theme === "dark"
                      ? "dark"
                      : resolvedTheme === "light" || theme === "light"
                      ? "light"
                      : "auto"
                  }
                />
              </div>
            </div>
            <SheetFooter className="flex flex-col gap-3 px-0 mt-4">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `${btnOpen ? "Update" : "Add"} ${amenitieType} Amenity`}
              </Button>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      <ConfirmationPopup
        isOpen={deleteModal.open}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Amenity"
        description={
          deleteModal.amenity
            ? `Are you sure you want to delete the amenity "${
                isArabic
                  ? deleteModal.amenity.ar?.displayName ||
                    deleteModal.amenity.displayName
                  : deleteModal.amenity.displayName
              }"? This action cannot be undone.`
            : "Are you sure you want to delete this amenity? This action cannot be undone."
        }
        confirmText="Delete Amenity"
        cancelText="Cancel"
        variant="danger"
        icon={Trash2}
        isLoading={deleteLoading}
      />
    </div>
  );
}
