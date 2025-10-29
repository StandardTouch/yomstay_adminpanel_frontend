import React, { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import HtmlEditor from "@/components/ui/html-editor";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HotelLocationMap from "./HotelLocationMap";
import {
  CountriesDropdown,
  StatesDropdown,
  CitiesDropdown,
} from "../../../../locations";
import {
  selectCountriesFormatted,
  selectStatesFormatted,
  selectCitiesFormatted,
} from "../../../../locations/locationSelectors";

const HotelOverviewSection = memo(({ fields, onFieldChange }) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const countries = useSelector(selectCountriesFormatted);
  const states = useSelector(selectStatesFormatted);
  const cities = useSelector(selectCitiesFormatted);

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
    <div className="flex flex-col gap-6 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Hotel Overview</h2>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hotel Name */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Hotel Name</Label>
          <Input
            type="text"
            value={fields.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Enter hotel name"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Status</Label>
          <Select
            value={fields.status}
            onValueChange={(value) => handleFieldChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Star Rating</Label>
          <div className="flex gap-1">{renderStars()}</div>
        </div>

        {/* Number of Rooms */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Number of Rooms</Label>
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
          <Label className="text-lg">Postal Code</Label>
          <Input
            type="text"
            value={fields.postalCode}
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
            placeholder="Enter postal code"
          />
        </div>

        {/* Free Cancellation Policy */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Free Cancellation Policy</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="free-cancellation"
              checked={fields.freeCancellationPolicy}
              onCheckedChange={(checked) =>
                handleFieldChange("freeCancellationPolicy", checked)
              }
            />
            <Label htmlFor="free-cancellation">
              {fields.freeCancellationPolicy ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label className="text-lg">Address</Label>
            <Input
              type="text"
              value={fields.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder="Enter hotel address"
            />
          </div>

          {/* Neighborhood */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg">Neighborhood</Label>
            <Input
              type="text"
              value={fields.neighborhood}
              onChange={(e) =>
                handleFieldChange("neighborhood", e.target.value)
              }
              placeholder="Enter neighborhood"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-2">
            <CountriesDropdown
              value={fields.countryId}
              onValueChange={(countryId) => {
                // Find the selected country to get its name
                const selectedCountry = countries?.find(
                  (c) => c.value === countryId
                );
                handleFieldChange("countryId", countryId);
                handleFieldChange("country", selectedCountry?.label || "");
                // Clear state and city when country changes
                handleFieldChange("stateId", "");
                handleFieldChange("state", "");
                handleFieldChange("cityId", "");
                handleFieldChange("city", "");
              }}
              placeholder="Select a country"
              label="Country"
              required
            />
          </div>

          {/* State */}
          <div className="flex flex-col gap-2">
            <StatesDropdown
              value={fields.stateId}
              countryId={fields.countryId}
              onValueChange={(stateId) => {
                // Find the selected state to get its name
                const selectedState = states?.find((s) => s.value === stateId);
                handleFieldChange("stateId", stateId);
                handleFieldChange("state", selectedState?.label || "");
                // Clear city when state changes
                handleFieldChange("cityId", "");
                handleFieldChange("city", "");
              }}
              placeholder="Select a state"
              label="State"
              required
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-2">
            <CitiesDropdown
              value={fields.cityId}
              countryId={fields.countryId}
              stateId={fields.stateId}
              onValueChange={(cityId) => {
                // Find the selected city to get its name
                const selectedCity = cities?.find((c) => c.value === cityId);
                handleFieldChange("cityId", cityId);
                handleFieldChange("city", selectedCity?.label || "");
              }}
              placeholder="Select a city"
              label="City"
              required
            />
          </div>
        </div>
      </div>

      {/* Mapbox Location Map */}
      <div className="space-y-4">
        <HotelLocationMap
          latitude={fields.location?.lat}
          longitude={fields.location?.lng}
          address={fields.address}
          isEditing={isEditingLocation}
          onLocationChange={handleLocationChange}
          onToggleEdit={handleToggleEdit}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label className="text-lg">Description</Label>
        <HtmlEditor
          value={fields.description || ""}
          onChange={(content) => handleFieldChange("description", content)}
          placeholder="Enter hotel description"
        />
      </div>
    </div>
  );
});

HotelOverviewSection.displayName = "HotelOverviewSection";

export default HotelOverviewSection;
