import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddButton from "../../../../components/AddButton";
import { Spinner } from "../../../../common/components/spinner";

// Import optimized section components
import HotelImagesSection from "./components/HotelImagesSection";
import HotelAmenitiesSection from "./components/HotelAmenitiesSection";
import HotelReviewsSection from "./components/HotelReviewsSection";

// New components for additional functionality
import HotelRoomsSection from "./components/HotelRoomsSection";
import HotelFinancialSection from "./components/HotelFinancialSection";
import HotelOverviewSection from "./components/HotelOverviewSection";
import HotelThematicsSection from "./components/HotelThematicsSection";
import HotelConditionsSection from "./components/HotelConditionsSection";
import HotelDocumentsSection from "./components/HotelDocumentsSection";

const OptimizedSingleHotel = ({
  hotel,
  setShow,
  onAddHotel,
  defaultAmenities = [],
  updating = false,
}) => {
  // Initialize fields with safe defaults
  const [fields, setFields] = useState({
    name: hotel?.name || "",
    description: hotel?.description || "",
    address: hotel?.address || "",
    neighborhood: hotel?.neighborhood || "",
    state: hotel?.state?.name || "",
    city: hotel?.city?.name || "",
    country: hotel?.country?.name || "",
    countryId: hotel?.country?.id || "",
    images: hotel?.images || [],
    starRating: hotel?.starRating || 0,
    numberOfRooms: hotel?.numberOfRooms || 0,
    postalCode: hotel?.postalCode || "",
    amenities: hotel?.amenities || [],
    faq: hotel?.faq || [],
    reviews: hotel?.reviews || [],
    // New fields from API
    status: hotel?.status || "pending",
    location: hotel?.location || { lat: null, lng: null },
    taxes: hotel?.taxes || [],
    platform: hotel?.platform || {
      commissionPercentage: 0,
      platformTaxPercentage: 0,
    },
    rooms: hotel?.rooms || [],
    freeCancellationPolicy: hotel?.freeCancellationPolicy || false,
    // Latest API additions
    thematics: hotel?.thematics || [],
    conditions: hotel?.conditions || [],
    documentRequirements: hotel?.documentRequirements || [],
    documentProgress: hotel?.documentProgress || {
      totalRequired: 0,
      totalUploaded: 0,
      totalApproved: 0,
      completionPercentage: 0,
    },
  });

  // Update fields when hotel data loads
  useEffect(() => {
    if (hotel) {
      setFields({
        name: hotel?.name || "",
        description: hotel?.description || "",
        address: hotel?.address || "",
        neighborhood: hotel?.neighborhood || "",
        state: hotel?.state?.name || "",
        city: hotel?.city?.name || "",
        country: hotel?.country?.name || "",
        countryId: hotel?.country?.id || "",
        stateId: hotel?.state?.id || "",
        cityId: hotel?.city?.id || "",
        images: hotel?.images || [],
        starRating: hotel?.starRating || 0,
        numberOfRooms: hotel?.numberOfRooms || 0,
        postalCode: hotel?.postalCode || "",
        amenities: hotel?.amenities || [],
        faq: hotel?.faq || [],
        reviews: hotel?.reviews || [],
        // New fields from API
        status: hotel?.status || "pending",
        location: hotel?.location || { lat: null, lng: null },
        taxes: hotel?.taxes || [],
        platform: hotel?.platform || {
          commissionPercentage: 0,
          platformTaxPercentage: 0,
        },
        rooms: hotel?.rooms || [],
        freeCancellationPolicy: hotel?.freeCancellationPolicy || false,
        // Latest API additions
        thematics: hotel?.thematics || [],
        conditions: hotel?.conditions || [],
        documentRequirements: hotel?.documentRequirements || [],
        documentProgress: hotel?.documentProgress || {
          totalRequired: 0,
          totalUploaded: 0,
          totalApproved: 0,
          completionPercentage: 0,
        },
      });
    }
  }, [hotel]);

  // Memoized field change handler
  const handleFieldChange = useCallback((key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Memoized section update handlers
  const handleUpdateImages = useCallback(
    (images) => {
      handleFieldChange("images", images);
    },
    [handleFieldChange]
  );

  const handleUpdateAmenities = useCallback(
    (amenities) => {
      handleFieldChange("amenities", amenities);
    },
    [handleFieldChange]
  );

  const handleUpdateFaqs = useCallback(
    (faqs) => {
      handleFieldChange("faq", faqs);
    },
    [handleFieldChange]
  );

  const handleUpdateRooms = useCallback(
    (rooms) => {
      handleFieldChange("rooms", rooms);
    },
    [handleFieldChange]
  );

  const handleUpdateTaxes = useCallback(
    (taxes) => {
      handleFieldChange("taxes", taxes);
    },
    [handleFieldChange]
  );

  const handleUpdatePlatform = useCallback(
    (platform) => {
      handleFieldChange("platform", platform);
    },
    [handleFieldChange]
  );

  const handleUpdateThematics = useCallback(
    (thematics) => {
      handleFieldChange("thematics", thematics);
    },
    [handleFieldChange]
  );

  const handleUpdateConditions = useCallback(
    (conditions) => {
      handleFieldChange("conditions", conditions);
    },
    [handleFieldChange]
  );

  const handleUpdateDocuments = useCallback(
    (documentRequirements) => {
      handleFieldChange("documentRequirements", documentRequirements);
    },
    [handleFieldChange]
  );

  // Memoized image upload handler
  const handleImageUpload = useCallback(
    (file) => {
      const newImage = {
        id: Math.random().toString(),
        url: URL.createObjectURL(file),
        isPrimary: fields.images.length === 0, // First image is primary by default
      };
      const updatedImages = [...fields.images, newImage];
      handleUpdateImages(updatedImages);
    },
    [fields.images, handleUpdateImages]
  );

  // Memoized hotel update handler
  const handleHotelUpdate = useCallback(() => {
    const updatedHotel = {
      id: hotel.id,
      ...fields,
      city: { name: fields.city },
      state: { name: fields.state },
      country: { name: fields.country },
      amenities: fields.amenities,
    };
    onAddHotel(updatedHotel);
  }, [hotel?.id, fields, onAddHotel]);

  // Memoized cancel handler
  const handleCancel = useCallback(() => {
    setShow(false);
  }, [setShow]);

  // Memoized tab sections for better performance
  const tabSections = useMemo(
    () => ({
      overview: (
        <HotelOverviewSection
          fields={fields}
          onFieldChange={handleFieldChange}
        />
      ),
      images: (
        <HotelImagesSection
          images={fields.images}
          onUpdateImages={handleUpdateImages}
          onImageUpload={handleImageUpload}
        />
      ),
      rooms: (
        <HotelRoomsSection
          rooms={fields.rooms}
          onUpdateRooms={handleUpdateRooms}
        />
      ),
      amenities: (
        <HotelAmenitiesSection
          amenitiesList={fields.amenities}
          onUpdateAmenities={handleUpdateAmenities}
          defaultAmenities={defaultAmenities}
          faqs={fields.faq}
          onUpdateFaqs={handleUpdateFaqs}
        />
      ),
      thematics: (
        <HotelThematicsSection
          thematics={fields.thematics}
          onUpdateThematics={handleUpdateThematics}
        />
      ),
      conditions: (
        <HotelConditionsSection
          conditions={fields.conditions}
          onUpdateConditions={handleUpdateConditions}
        />
      ),
      documents: (
        <HotelDocumentsSection
          documentRequirements={fields.documentRequirements}
          documentProgress={fields.documentProgress}
          onUpdateDocuments={handleUpdateDocuments}
        />
      ),
      reviews: <HotelReviewsSection reviews={fields.reviews} />,
      financial: (
        <HotelFinancialSection
          taxes={fields.taxes}
          platform={fields.platform}
          onUpdateTaxes={handleUpdateTaxes}
          onUpdatePlatform={handleUpdatePlatform}
        />
      ),
    }),
    [
      fields,
      handleFieldChange,
      handleUpdateImages,
      handleImageUpload,
      handleUpdateAmenities,
      handleUpdateRooms,
      handleUpdateTaxes,
      handleUpdatePlatform,
      handleUpdateThematics,
      handleUpdateConditions,
      handleUpdateDocuments,
      defaultAmenities,
    ]
  );

  return (
    <div className="w-full bg-inherit flex flex-col gap-4 pb-10 relative">
      {/* Loading Overlay */}
      {updating && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Updating hotel...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-6">
          Update Hotel
          {updating && (
            <span className="ml-2 text-sm text-blue-600">(Updating...)</span>
          )}
        </h1>
        <div className="flex flex-row gap-2">
          <AddButton
            buttonValue="Cancel"
            onAdd={handleCancel}
            disabled={updating}
          />
          <AddButton
            buttonValue={updating ? "Updating..." : "Update"}
            onAdd={handleHotelUpdate}
            disabled={updating}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-scroll md:overflow-hidden rounded-md">
          <TabsList className="flex gap-2 *:cursor-pointer z-20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="images">Images & Media</TabsTrigger>
            <TabsTrigger value="rooms">Rooms & Pricing</TabsTrigger>
            <TabsTrigger value="amenities">Amenities & Policies</TabsTrigger>
            <TabsTrigger value="thematics">Thematics</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
            <TabsTrigger value="financial">Financial Settings</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="overview" className="border rounded-md p-2">
          {tabSections.overview}
        </TabsContent>

        <TabsContent value="images" className="border rounded-md p-2">
          {tabSections.images}
        </TabsContent>

        <TabsContent value="rooms" className="border rounded-md p-2">
          {tabSections.rooms}
        </TabsContent>

        <TabsContent value="amenities" className="border rounded-md p-2">
          {tabSections.amenities}
        </TabsContent>

        <TabsContent value="thematics" className="border rounded-md p-2">
          {tabSections.thematics}
        </TabsContent>

        <TabsContent value="conditions" className="border rounded-md p-2">
          {tabSections.conditions}
        </TabsContent>

        <TabsContent value="documents" className="border rounded-md p-2">
          {tabSections.documents}
        </TabsContent>

        <TabsContent value="reviews" className="border rounded-md p-2">
          {tabSections.reviews}
        </TabsContent>

        <TabsContent value="financial" className="border rounded-md p-2">
          {tabSections.financial}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizedSingleHotel;
