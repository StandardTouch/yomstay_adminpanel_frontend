import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../../contexts/ApiContext";
import {
  fetchSingleHotel,
  updateSingleHotel,
  clearSingleHotel,
  clearErrors,
} from "../../singleHotelSlice";
import {
  selectSingleHotel,
  selectSingleHotelLoading,
  selectSingleHotelError,
  selectSingleHotelUpdating,
  selectSingleHotelUpdateError,
} from "../../singleHotelSelectors";
import OptimizedSingleHotel from "./OptimizedSingleHotel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { showError, showSuccess } from "../../../../utils/toast";
import { Spinner } from "../../../../common/components/spinner";

const SingleHotelScreen = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  const hotel = useSelector(selectSingleHotel);
  const loading = useSelector(selectSingleHotelLoading);
  const error = useSelector(selectSingleHotelError);
  const updating = useSelector(selectSingleHotelUpdating);
  const updateError = useSelector(selectSingleHotelUpdateError);

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
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle update errors
  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError]);

  const handleBack = () => {
    navigate("/dashboard/hotels");
  };

  const handleUpdateHotel = async (updatedHotel) => {
    try {
      const result = await dispatch(
        updateSingleHotel({ hotelId, hotelData: updatedHotel, apiClient })
      ).unwrap();

      showSuccess("Hotel updated successfully!");
      console.log("Hotel updated:", result);
    } catch (error) {
      console.error("Failed to update hotel:", error);
      showError(error || "Failed to update hotel");
    }
  };

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
          disabled={updating}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hotels
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hotel.name}
            {updating && (
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
        setShow={() => handleBack()}
        onAddHotel={handleUpdateHotel}
        defaultAmenities={[]} // TODO: Fetch from API when available
        updating={updating}
      />
    </div>
  );
};

export default SingleHotelScreen;
