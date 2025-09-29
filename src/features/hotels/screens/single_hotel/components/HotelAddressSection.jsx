import React, { memo, useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import HotelLocationMap from "./HotelLocationMap";

const HotelAddressSection = memo(({ fields, onFieldChange }) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const handleFieldChange = useCallback(
    (key, value) => {
      onFieldChange(key, value);
    },
    [onFieldChange]
  );

  const handleLocationChange = useCallback(
    (latitude, longitude) => {
      onFieldChange("location", { lat: latitude, lng: longitude });
      setIsEditingLocation(false);
    },
    [onFieldChange]
  );

  const handleToggleEdit = useCallback((editing) => {
    setIsEditingLocation(editing);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Address Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-lg">Address</label>
          <Input
            type="text"
            value={fields.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            placeholder="Enter hotel address"
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">City</label>
          <Input
            type="text"
            value={fields.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            placeholder="Enter city name"
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">State</label>
          <Input
            type="text"
            value={fields.state}
            onChange={(e) => handleFieldChange("state", e.target.value)}
            placeholder="Enter state name"
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2">
          <label className="text-lg">Country</label>
          <Input
            type="text"
            value={fields.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            placeholder="Enter country name"
          />
        </div>
      </div>

      {/* Mapbox Location Map */}
      <div className="mt-6">
        <HotelLocationMap
          latitude={fields.location?.lat}
          longitude={fields.location?.lng}
          address={fields.address}
          isEditing={isEditingLocation}
          onLocationChange={handleLocationChange}
          onToggleEdit={handleToggleEdit}
        />
      </div>
    </div>
  );
});

HotelAddressSection.displayName = "HotelAddressSection";

export default HotelAddressSection;
