import React, { memo } from "react";
import { ReviewItem } from "./ReviewItem";

const HotelReviewsSection = memo(({ reviews = [] }) => {
  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="text-sm text-gray-600">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => <ReviewItem key={idx} review={review} />)
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews available for this hotel.</p>
            <p className="text-sm">
              Reviews will appear here once guests start rating this hotel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

HotelReviewsSection.displayName = "HotelReviewsSection";

export default HotelReviewsSection;
