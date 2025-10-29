import React, { memo, useMemo, useCallback } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AlertBox from "@/components/AlertBox";
import { Button } from "@/components/ui/button";
import HtmlContent from "@/components/ui/html-content";

function HotelCard({ hotel, showHotel, showAlert }) {
  // Debug logging to see the actual hotel data structure
  console.log("HotelCard - hotel data:", hotel);
  console.log("HotelCard - hotel.images:", hotel?.images);
  console.log("HotelCard - hotel.featuredImage:", hotel?.featuredImage);
  console.log("HotelCard - images array length:", hotel?.images?.length);

  // Memoized helper function to get display image
  const getDisplayImage = useCallback((hotel) => {
    // First try featured image if available
    if (hotel?.featuredImage?.url) {
      return hotel.featuredImage;
    }

    // Then try images array
    if (
      hotel?.images &&
      Array.isArray(hotel.images) &&
      hotel.images.length > 0
    ) {
      // Try to find primary image first
      const primaryImage = hotel.images.find(
        (image) => image?.isPrimary === true
      );
      if (primaryImage?.url) {
        return primaryImage;
      }

      // Fallback to first image with URL
      const firstImage = hotel.images.find((image) => image?.url);
      if (firstImage?.url) {
        return firstImage;
      }
    }

    return null;
  }, []);

  const displayImage = useMemo(
    () => getDisplayImage(hotel),
    [hotel, getDisplayImage]
  );

  // Memoized callbacks for event handlers
  const handleCardClick = useCallback(() => {
    // Card click now handled by showHotel function
    showHotel();
  }, [showHotel]);

  const handleHeaderClick = useCallback(() => {
    showHotel();
  }, [showHotel]);

  const handleAlertClick = useCallback(() => {
    showAlert();
  }, [showAlert]);

  const handleImageError = useCallback(
    (e) => {
      console.log("Image failed to load:", displayImage?.url);
      e.target.style.display = "none";
    },
    [displayImage?.url]
  );

  return (
    <Card
      key={hotel.id}
      className="min-[800px]:flex-col min-[1010px]:flex-row flex-col gap-2 px-2 py-3 shadow-sm hover:shadow-muted-foreground duration-300 transition-shadow cursor-pointer relative"
      onClick={handleCardClick}
    >
      <CardHeader
        className="flex flex-col justify-center items-center px-2 pb-0 w-full "
        onClick={handleHeaderClick}
      >
        {displayImage ? (
          <img
            src={displayImage.url}
            alt={displayImage.altText || hotel.name || "Hotel image"}
            className="w-full object-cover rounded-md h-48"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">🏨</div>
            <span className="text-gray-600 text-sm font-medium">
              No image available
            </span>
            <span className="text-gray-500 text-xs">
              Hotel image will appear here
            </span>
          </div>
        )}
      </CardHeader>

      <div
        className="flex flex-col w-full justify-between "
        onClick={handleHeaderClick}
      >
        <CardContent className="px-2 flex flex-col gap-4 text-left justify-between h-full">
          <div className=" w-full flex justify-between items-start ">
            <CardTitle className=" leading-normal ">
              {hotel.name || "Unnamed Hotel"}
            </CardTitle>

            <Badge variant="secondary">⭐ {hotel.starRating || 0}</Badge>
          </div>
          <div className="border-t-2 pt-1 ">
            <p className="font-medium">Description</p>
            <HtmlContent
              content={hotel.description}
              className="text-sm text-muted-foreground line-clamp-3"
            />
          </div>
          <div className="border-t-2 pt-1">
            <p className="font-medium">
              Address : {hotel.address || "No address available"}
            </p>
            <div className="text-xs text-muted-foreground">
              <p>City : {hotel.city?.name || "N/A"}</p>
              <p>Country : {hotel.country?.name || "N/A"}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className=" px-2 pt-4 justify-between relative">
          <p>{hotel.numberOfRooms || 0} - Rooms</p>
        </CardFooter>
      </div>
      {showAlert && (
        <AlertBox
          Check="Hotel"
          hotelName={hotel.name || "Unnamed Hotel"}
          onDelete={handleAlertClick}
        />
      )}
      {showAlert === false && (
        <div className="absolute bottom-2 right-2 flex gap-2 ">
          <Button variant="outline" className=" cursor-pointer ">
            Approved
          </Button>
          <AlertBox
            Check="Reject"
            hotelName={hotel.name || "Unnamed Hotel"}
            onDelete={handleAlertClick}
          />
        </div>
      )}
    </Card>
  );
}

// Export memoized component for better performance
export default memo(HotelCard);
