import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../../contexts/ApiContext";
import {
  fetchSingleHotel,
  updateHotelOverview,
  updateHotelAmenitiesAndFaqs,
  updateHotelThematics,
  updateHotelConditions,
  updateHotelTaxes,
  clearSingleHotel,
  clearErrors,
} from "../../singleHotelSlice";
import {
  selectSingleHotel,
  selectSingleHotelLoading,
  selectSingleHotelError,
  selectSingleHotelUpdatingOverview,
  selectSingleHotelUpdatingAmenities,
  selectSingleHotelUpdatingThematics,
  selectSingleHotelUpdatingConditions,
  selectSingleHotelUpdatingTaxes,
  selectSingleHotelOverviewError,
  selectSingleHotelAmenitiesError,
  selectSingleHotelThematicsError,
  selectSingleHotelConditionsError,
  selectSingleHotelTaxesError,
  selectIsAnyUpdateInProgress,
} from "../../singleHotelSelectors";
import OptimizedSingleHotel from "./OptimizedSingleHotel";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { showError, showSuccess } from "../../../../utils/toast";
import { Spinner } from "../../../../common/components/spinner";

const SingleHotelScreen = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Hotel data and loading
  const hotel = useSelector(selectSingleHotel);
  const loading = useSelector(selectSingleHotelLoading);
  const error = useSelector(selectSingleHotelError);

  // Section-specific loading states
  const updatingOverview = useSelector(selectSingleHotelUpdatingOverview);
  const updatingAmenities = useSelector(selectSingleHotelUpdatingAmenities);
  const updatingThematics = useSelector(selectSingleHotelUpdatingThematics);
  const updatingConditions = useSelector(selectSingleHotelUpdatingConditions);
  const updatingTaxes = useSelector(selectSingleHotelUpdatingTaxes);
  const isAnyUpdateInProgress = useSelector(selectIsAnyUpdateInProgress);

  // Section-specific errors
  const overviewError = useSelector(selectSingleHotelOverviewError);
  const amenitiesError = useSelector(selectSingleHotelAmenitiesError);
  const thematicsError = useSelector(selectSingleHotelThematicsError);
  const conditionsError = useSelector(selectSingleHotelConditionsError);
  const taxesError = useSelector(selectSingleHotelTaxesError);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Fetch single hotel by ID
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient && hotelId) {
      dispatch(fetchSingleHotel({ hotelId, apiClient }));
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient, hotelId]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  useEffect(() => {
    if (overviewError) showError(`Overview: ${overviewError}`);
  }, [overviewError]);

  useEffect(() => {
    if (amenitiesError) showError(`Amenities: ${amenitiesError}`);
  }, [amenitiesError]);

  useEffect(() => {
    if (thematicsError) showError(`Thematics: ${thematicsError}`);
  }, [thematicsError]);

  useEffect(() => {
    if (conditionsError) showError(`Conditions: ${conditionsError}`);
  }, [conditionsError]);

  useEffect(() => {
    if (taxesError) showError(`Taxes: ${taxesError}`);
  }, [taxesError]);

  // Handle back navigation with unsaved changes warning
  const handleBack = useCallback(() => {
    if (hasUnsavedChanges && !isAnyUpdateInProgress) {
      setPendingNavigation("/dashboard/hotels");
      setShowUnsavedChangesDialog(true);
    } else {
      navigate("/dashboard/hotels");
    }
  }, [hasUnsavedChanges, isAnyUpdateInProgress, navigate]);

  // Confirm navigation when there are unsaved changes
  const handleConfirmNavigation = useCallback(() => {
    setShowUnsavedChangesDialog(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  }, [pendingNavigation, navigate]);

  // Section-specific update handlers
  const handleUpdateOverview = useCallback(
    async (overviewData) => {
      try {
        await dispatch(
          updateHotelOverview({ hotelId, hotelData: overviewData, apiClient })
        ).unwrap();

        showSuccess("Hotel overview updated successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to update hotel overview:", error);
        showError(error || "Failed to update hotel overview");
      }
    },
    [dispatch, hotelId, apiClient]
  );

  const handleUpdateAmenities = useCallback(
    async (amenities, faq) => {
      try {
        await dispatch(
          updateHotelAmenitiesAndFaqs({ hotelId, amenities, faq, apiClient })
        ).unwrap();

        showSuccess("Amenities and FAQs updated successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to update amenities:", error);
        showError(error || "Failed to update amenities and FAQs");
      }
    },
    [dispatch, hotelId, apiClient]
  );

  const handleUpdateThematics = useCallback(
    async (thematics) => {
      try {
        await dispatch(
          updateHotelThematics({ hotelId, thematics, apiClient })
        ).unwrap();

        showSuccess("Thematics updated successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to update thematics:", error);
        showError(error || "Failed to update thematics");
      }
    },
    [dispatch, hotelId, apiClient]
  );

  const handleUpdateConditions = useCallback(
    async (conditions) => {
      try {
        await dispatch(
          updateHotelConditions({ hotelId, conditions, apiClient })
        ).unwrap();

        showSuccess("Conditions updated successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to update conditions:", error);
        showError(error || "Failed to update conditions");
      }
    },
    [dispatch, hotelId, apiClient]
  );

  const handleUpdateTaxes = useCallback(
    async (taxes) => {
      try {
        await dispatch(
          updateHotelTaxes({ hotelId, taxes, apiClient })
        ).unwrap();

        showSuccess("Taxes updated successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to update taxes:", error);
        showError(error || "Failed to update taxes");
      }
    },
    [dispatch, hotelId, apiClient]
  );

  // Loading state
  if (loading) {
    return <Spinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Hotel
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  // Hotel not found
  if (!hotel && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">🏨</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Hotel Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The hotel you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  // Don't render until hotel data is loaded
  if (!hotel) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          disabled={isAnyUpdateInProgress}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hotels
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hotel.name}
            {isAnyUpdateInProgress && (
              <Loader2 className="inline-block h-5 w-5 animate-spin ml-2" />
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {hotel.city?.name}, {hotel.country?.name}
          </p>
        </div>
      </div>

      {/* Optimized Single Hotel Component */}
      <OptimizedSingleHotel
        hotel={hotel}
        onUpdateOverview={handleUpdateOverview}
        onUpdateAmenities={handleUpdateAmenities}
        onUpdateThematics={handleUpdateThematics}
        onUpdateConditions={handleUpdateConditions}
        onUpdateTaxes={handleUpdateTaxes}
        updatingStates={{
          overview: updatingOverview,
          amenities: updatingAmenities,
          thematics: updatingThematics,
          conditions: updatingConditions,
          taxes: updatingTaxes,
        }}
        onUnsavedChanges={setHasUnsavedChanges}
        defaultAmenities={[]} // TODO: Fetch from API when available
      />

      {/* Unsaved Changes Dialog */}
      <AlertDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All
              unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation}>
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SingleHotelScreen;
