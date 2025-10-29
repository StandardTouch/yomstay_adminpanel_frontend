import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
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
  onUpdateOverview,
  onUpdateAmenities,
  onUpdateThematics,
  onUpdateConditions,
  onUpdateTaxes,
  updatingStates = {},
  onUnsavedChanges,
  defaultAmenities = [],
}) => {
  // Tab switching and unsaved changes
  const [currentTab, setCurrentTab] = useState("overview");
  const [showTabSwitchDialog, setShowTabSwitchDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [sectionHasChanges, setSectionHasChanges] = useState({
    overview: false,
    amenities: false,
    thematics: false,
    conditions: false,
    taxes: false,
  });

  // Section-specific states
  const [overviewFields, setOverviewFields] = useState({
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
    starRating: hotel?.starRating || 0,
    numberOfRooms: hotel?.numberOfRooms || 0,
    postalCode: hotel?.postalCode || "",
    status: hotel?.status || "pending",
    location: hotel?.location || { lat: null, lng: null },
    freeCancellationPolicy: hotel?.freeCancellationPolicy || false,
    countryCode: hotel?.countryCode || "",
  });

  const [amenitiesFields, setAmenitiesFields] = useState({
    amenities: hotel?.amenities || [],
    faq: hotel?.faq || [],
  });

  const [thematicsFields, setThematicsFields] = useState({
    thematics: hotel?.thematics || [],
  });

  const [conditionsFields, setConditionsFields] = useState({
    conditions: hotel?.conditions || [],
  });

  const [taxesFields, setTaxesFields] = useState({
    taxes: hotel?.taxes || [],
    platform: hotel?.platform || {
      commissionPercentage: 0,
      platformTaxPercentage: 0,
    },
  });

  // Separate states for read-only or different endpoints
  const [imagesFields, setImagesFields] = useState({
    images: hotel?.images || [],
  });

  const [roomsFields, setRoomsFields] = useState({
    rooms: hotel?.rooms || [],
  });

  const [documentsFields, setDocumentsFields] = useState({
    documentRequirements: hotel?.documentRequirements || [],
    documentProgress: hotel?.documentProgress || {
      totalRequired: 0,
      totalUploaded: 0,
      totalApproved: 0,
      completionPercentage: 0,
    },
  });

  const [reviewsFields] = useState({
    reviews: hotel?.reviews || [],
  });

  // Update section fields when hotel data loads/changes
  useEffect(() => {
    if (hotel) {
      setOverviewFields({
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
        starRating: hotel?.starRating || 0,
        numberOfRooms: hotel?.numberOfRooms || 0,
        postalCode: hotel?.postalCode || "",
        status: hotel?.status || "pending",
        location: hotel?.location || { lat: null, lng: null },
        freeCancellationPolicy: hotel?.freeCancellationPolicy || false,
        countryCode: hotel?.countryCode || "",
      });

      setAmenitiesFields({
        amenities: hotel?.amenities || [],
        faq: hotel?.faq || [],
      });

      setThematicsFields({
        thematics: hotel?.thematics || [],
      });

      setConditionsFields({
        conditions: hotel?.conditions || [],
      });

      setTaxesFields({
        taxes: hotel?.taxes || [],
        platform: hotel?.platform || {
          commissionPercentage: 0,
          platformTaxPercentage: 0,
        },
      });

      setImagesFields({
        images: hotel?.images || [],
      });

      setRoomsFields({
        rooms: hotel?.rooms || [],
      });

      setDocumentsFields({
        documentRequirements: hotel?.documentRequirements || [],
        documentProgress: hotel?.documentProgress || {
          totalRequired: 0,
          totalUploaded: 0,
          totalApproved: 0,
          completionPercentage: 0,
        },
      });

      // Reset unsaved changes tracking when hotel data updates
      setSectionHasChanges({
        overview: false,
        amenities: false,
        thematics: false,
        conditions: false,
        taxes: false,
      });
    }
  }, [hotel]);

  // Notify parent of unsaved changes
  useEffect(() => {
    const hasAnyChanges = Object.values(sectionHasChanges).some(
      (changed) => changed
    );
    onUnsavedChanges?.(hasAnyChanges);
  }, [sectionHasChanges, onUnsavedChanges]);

  // Tab switching handler with unsaved changes check
  const handleTabChange = useCallback(
    (newTab) => {
      const currentSection = getCurrentSection(currentTab);
      if (currentSection && sectionHasChanges[currentSection]) {
        setPendingTab(newTab);
        setShowTabSwitchDialog(true);
      } else {
        setCurrentTab(newTab);
      }
    },
    [currentTab, sectionHasChanges]
  );

  const getCurrentSection = (tab) => {
    const sectionMap = {
      overview: "overview",
      amenities: "amenities",
      thematics: "thematics",
      conditions: "conditions",
      financial: "taxes",
    };
    return sectionMap[tab];
  };

  const handleConfirmTabSwitch = useCallback(() => {
    setShowTabSwitchDialog(false);
    if (pendingTab) {
      // Reset unsaved changes for current section
      const currentSection = getCurrentSection(currentTab);
      if (currentSection) {
        setSectionHasChanges((prev) => ({ ...prev, [currentSection]: false }));
      }
      setCurrentTab(pendingTab);
      setPendingTab(null);
    }
  }, [pendingTab, currentTab]);

  // Section-specific update handlers
  const handleOverviewChange = useCallback((key, value) => {
    setOverviewFields((prev) => ({ ...prev, [key]: value }));
    setSectionHasChanges((prev) => ({ ...prev, overview: true }));
  }, []);

  const handleAmenitiesChange = useCallback((amenities) => {
    setAmenitiesFields((prev) => ({ ...prev, amenities }));
    setSectionHasChanges((prev) => ({ ...prev, amenities: true }));
  }, []);

  const handleFaqsChange = useCallback((faq) => {
    setAmenitiesFields((prev) => ({ ...prev, faq }));
    setSectionHasChanges((prev) => ({ ...prev, amenities: true }));
  }, []);

  const handleThematicsChange = useCallback((thematics) => {
    setThematicsFields({ thematics });
    setSectionHasChanges((prev) => ({ ...prev, thematics: true }));
  }, []);

  const handleConditionsChange = useCallback((conditions) => {
    setConditionsFields({ conditions });
    setSectionHasChanges((prev) => ({ ...prev, conditions: true }));
  }, []);

  const handleTaxesChange = useCallback((taxes) => {
    setTaxesFields((prev) => ({ ...prev, taxes }));
    setSectionHasChanges((prev) => ({ ...prev, taxes: true }));
  }, []);

  const handlePlatformChange = useCallback((platform) => {
    setTaxesFields((prev) => ({ ...prev, platform }));
    setSectionHasChanges((prev) => ({ ...prev, taxes: true }));
  }, []);

  // Image handlers (different endpoint, will be implemented later)
  const handleImagesChange = useCallback((images) => {
    setImagesFields({ images });
  }, []);

  const handleImageUpload = useCallback(
    (file) => {
      const newImage = {
        id: Math.random().toString(),
        url: URL.createObjectURL(file),
        isPrimary: imagesFields.images.length === 0,
      };
      const updatedImages = [...imagesFields.images, newImage];
      handleImagesChange(updatedImages);
    },
    [imagesFields.images, handleImagesChange]
  );

  // Room handlers (different endpoint, will be implemented later)
  const handleRoomsChange = useCallback((rooms) => {
    setRoomsFields({ rooms });
  }, []);

  // Document handlers (different endpoint, will be implemented later)
  const handleDocumentsChange = useCallback((documentRequirements) => {
    setDocumentsFields((prev) => ({ ...prev, documentRequirements }));
  }, []);

  // Section update button handlers
  const handleUpdateOverviewClick = useCallback(() => {
    onUpdateOverview?.(overviewFields);
    setSectionHasChanges((prev) => ({ ...prev, overview: false }));
  }, [onUpdateOverview, overviewFields]);

  const handleUpdateAmenitiesClick = useCallback(() => {
    onUpdateAmenities?.(amenitiesFields.amenities, amenitiesFields.faq);
    setSectionHasChanges((prev) => ({ ...prev, amenities: false }));
  }, [onUpdateAmenities, amenitiesFields]);

  const handleUpdateThematicsClick = useCallback(() => {
    onUpdateThematics?.(thematicsFields.thematics);
    setSectionHasChanges((prev) => ({ ...prev, thematics: false }));
  }, [onUpdateThematics, thematicsFields]);

  const handleUpdateConditionsClick = useCallback(() => {
    onUpdateConditions?.(conditionsFields.conditions);
    setSectionHasChanges((prev) => ({ ...prev, conditions: false }));
  }, [onUpdateConditions, conditionsFields]);

  const handleUpdateTaxesClick = useCallback(() => {
    onUpdateTaxes?.(taxesFields.taxes);
    setSectionHasChanges((prev) => ({ ...prev, taxes: false }));
  }, [onUpdateTaxes, taxesFields]);

  // Reset section to original hotel data
  const handleResetSection = useCallback(
    (section) => {
      switch (section) {
        case "overview":
          setOverviewFields({
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
            starRating: hotel?.starRating || 0,
            numberOfRooms: hotel?.numberOfRooms || 0,
            postalCode: hotel?.postalCode || "",
            status: hotel?.status || "pending",
            location: hotel?.location || { lat: null, lng: null },
            freeCancellationPolicy: hotel?.freeCancellationPolicy || false,
            countryCode: hotel?.countryCode || "",
          });
          break;
        case "amenities":
          setAmenitiesFields({
            amenities: hotel?.amenities || [],
            faq: hotel?.faq || [],
          });
          break;
        case "thematics":
          setThematicsFields({
            thematics: hotel?.thematics || [],
          });
          break;
        case "conditions":
          setConditionsFields({
            conditions: hotel?.conditions || [],
          });
          break;
        case "taxes":
          setTaxesFields({
            taxes: hotel?.taxes || [],
            platform: hotel?.platform || {
              commissionPercentage: 0,
              platformTaxPercentage: 0,
            },
          });
          break;
      }
      setSectionHasChanges((prev) => ({ ...prev, [section]: false }));
    },
    [hotel]
  );

  // Memoized tab sections for better performance
  const tabSections = useMemo(
    () => ({
      overview: (
        <HotelOverviewSection
          fields={overviewFields}
          onFieldChange={handleOverviewChange}
        />
      ),
      images: (
        <HotelImagesSection
          images={imagesFields.images}
          onUpdateImages={handleImagesChange}
          onImageUpload={handleImageUpload}
        />
      ),
      rooms: (
        <HotelRoomsSection
          rooms={roomsFields.rooms}
          onUpdateRooms={handleRoomsChange}
        />
      ),
      amenities: (
        <HotelAmenitiesSection
          amenitiesList={amenitiesFields.amenities}
          onUpdateAmenities={handleAmenitiesChange}
          defaultAmenities={defaultAmenities}
          faqs={amenitiesFields.faq}
          onUpdateFaqs={handleFaqsChange}
        />
      ),
      thematics: (
        <HotelThematicsSection
          thematics={thematicsFields.thematics}
          onUpdateThematics={handleThematicsChange}
        />
      ),
      conditions: (
        <HotelConditionsSection
          conditions={conditionsFields.conditions}
          onUpdateConditions={handleConditionsChange}
        />
      ),
      documents: (
        <HotelDocumentsSection
          documentRequirements={documentsFields.documentRequirements}
          documentProgress={documentsFields.documentProgress}
          onUpdateDocuments={handleDocumentsChange}
        />
      ),
      reviews: <HotelReviewsSection reviews={reviewsFields.reviews} />,
      financial: (
        <HotelFinancialSection
          taxes={taxesFields.taxes}
          platform={taxesFields.platform}
          onUpdateTaxes={handleTaxesChange}
          onUpdatePlatform={handlePlatformChange}
        />
      ),
    }),
    [
      overviewFields,
      amenitiesFields,
      thematicsFields,
      conditionsFields,
      taxesFields,
      imagesFields,
      roomsFields,
      documentsFields,
      reviewsFields,
      handleOverviewChange,
      handleAmenitiesChange,
      handleFaqsChange,
      handleThematicsChange,
      handleConditionsChange,
      handleTaxesChange,
      handlePlatformChange,
      handleImagesChange,
      handleImageUpload,
      handleRoomsChange,
      handleDocumentsChange,
      defaultAmenities,
    ]
  );

  return (
    <div className="w-full bg-inherit flex flex-col gap-4 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-6">Update Hotel</h1>
        <div className="text-sm text-gray-600">
          {Object.values(sectionHasChanges).some((v) => v) && (
            <span className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              You have unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
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
        <TabsContent value="overview" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Hotel Overview</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleResetSection("overview")}
                disabled={
                  updatingStates.overview || !sectionHasChanges.overview
                }
              >
                Reset
              </Button>
              <Button
                onClick={handleUpdateOverviewClick}
                disabled={
                  updatingStates.overview || !sectionHasChanges.overview
                }
              >
                {updatingStates.overview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Overview"
                )}
              </Button>
            </div>
          </div>
          {tabSections.overview}
        </TabsContent>

        <TabsContent value="images" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Images & Media</h2>
            <div className="text-sm text-gray-500">
              Separate endpoint required (Coming soon)
            </div>
          </div>
          {tabSections.images}
        </TabsContent>

        <TabsContent value="rooms" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Rooms & Pricing</h2>
            <div className="text-sm text-gray-500">
              Separate endpoint required (Coming soon)
            </div>
          </div>
          {tabSections.rooms}
        </TabsContent>

        <TabsContent value="amenities" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Amenities & FAQs</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleResetSection("amenities")}
                disabled={
                  updatingStates.amenities || !sectionHasChanges.amenities
                }
              >
                Reset
              </Button>
              <Button
                onClick={handleUpdateAmenitiesClick}
                disabled={
                  updatingStates.amenities || !sectionHasChanges.amenities
                }
              >
                {updatingStates.amenities ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Amenities"
                )}
              </Button>
            </div>
          </div>
          {tabSections.amenities}
        </TabsContent>

        <TabsContent value="thematics" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Thematics</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleResetSection("thematics")}
                disabled={
                  updatingStates.thematics || !sectionHasChanges.thematics
                }
              >
                Reset
              </Button>
              <Button
                onClick={handleUpdateThematicsClick}
                disabled={
                  updatingStates.thematics || !sectionHasChanges.thematics
                }
              >
                {updatingStates.thematics ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Thematics"
                )}
              </Button>
            </div>
          </div>
          {tabSections.thematics}
        </TabsContent>

        <TabsContent value="conditions" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Conditions</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleResetSection("conditions")}
                disabled={
                  updatingStates.conditions || !sectionHasChanges.conditions
                }
              >
                Reset
              </Button>
              <Button
                onClick={handleUpdateConditionsClick}
                disabled={
                  updatingStates.conditions || !sectionHasChanges.conditions
                }
              >
                {updatingStates.conditions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Conditions"
                )}
              </Button>
            </div>
          </div>
          {tabSections.conditions}
        </TabsContent>

        <TabsContent value="documents" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Documents</h2>
            <div className="text-sm text-gray-500">
              Separate endpoint required (Coming soon)
            </div>
          </div>
          {tabSections.documents}
        </TabsContent>

        <TabsContent value="reviews" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
            <div className="text-sm text-gray-500">Read-only</div>
          </div>
          {tabSections.reviews}
        </TabsContent>

        <TabsContent value="financial" className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Financial Settings (Taxes)
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleResetSection("taxes")}
                disabled={updatingStates.taxes || !sectionHasChanges.taxes}
              >
                Reset
              </Button>
              <Button
                onClick={handleUpdateTaxesClick}
                disabled={updatingStates.taxes || !sectionHasChanges.taxes}
              >
                {updatingStates.taxes ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Taxes"
                )}
              </Button>
            </div>
          </div>
          {tabSections.financial}
        </TabsContent>
      </Tabs>

      {/* Tab Switch Warning Dialog */}
      <AlertDialog
        open={showTabSwitchDialog}
        onOpenChange={setShowTabSwitchDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in this section. Switching tabs will
              discard these changes. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Current Tab</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTabSwitch}>
              Discard Changes & Switch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OptimizedSingleHotel;
