import React, { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import HtmlEditor from "@/components/ui/html-editor";

const HotelDetailsSection = memo(({ fields, onFieldChange }) => {
  const handleFieldChange = useCallback(
    (key, value) => {
      onFieldChange(key, value);
    },
    [onFieldChange]
  );

  const renderStars = useCallback(() => {
    return [1, 2, 3, 4, 5].map((star) => {
      let icon;
      if (fields.starRating >= star) {
        icon = <FaStar className="text-yellow-400" />;
      } else if (fields.starRating > star - 1) {
        icon = <FaStarHalfAlt className="text-yellow-400" />;
      } else {
        icon = <FaRegStar className="text-gray-300" />;
      }

      return (
        <button
          key={star}
          type="button"
          onClick={() => handleFieldChange("starRating", star)}
          className="focus:outline-none"
        >
          {icon}
        </button>
      );
    });
  }, [fields.starRating, handleFieldChange]);

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Hotel Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hotel Name */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">Hotel Name</label>
          <Input
            type="text"
            value={fields.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Enter hotel name"
          />
        </div>

        {/* Star Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">Star Rating</label>
          <div className="flex gap-1">{renderStars()}</div>
        </div>

        {/* Number of Rooms */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">Number of Rooms</label>
          <Input
            type="number"
            value={fields.numberOfRooms}
            onChange={(e) =>
              handleFieldChange("numberOfRooms", parseInt(e.target.value) || 0)
            }
            placeholder="Enter number of rooms"
            min="0"
          />
        </div>

        {/* Postal Code */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">Postal Code</label>
          <Input
            type="text"
            value={fields.postalCode}
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-lg">Description</label>
        <HtmlEditor
          value={fields.description || ""}
          onChange={(content) => handleFieldChange("description", content)}
          placeholder="Enter hotel description"
        />
      </div>
    </div>
  );
});

HotelDetailsSection.displayName = "HotelDetailsSection";

export default HotelDetailsSection;
