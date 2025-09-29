import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Edit3, Check, X } from "lucide-react";

const HotelLocationMap = ({
  latitude,
  longitude,
  onLocationChange,
  address = "",
  isEditing = false,
  onToggleEdit,
}) => {
  console.log("HotelLocationMap rendered with isEditing:", isEditing);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    lat: latitude,
    lng: longitude,
  });

  // Update tempLocation when props change (after data loads)
  useEffect(() => {
    setTempLocation({
      lat: latitude,
      lng: longitude,
    });
  }, [latitude, longitude]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set your Mapbox access token
    const accessToken =
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
      "pk.eyJ1IjoieWFzZWVuIiwiYSI6ImNsdGJ6dGJ6dGJ6dGJ6In0.example";
    console.log("Mapbox access token:", accessToken ? "Present" : "Missing");
    mapboxgl.accessToken = accessToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDarkMode
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v12",
      center: [longitude || 0, latitude || 0],
      zoom: latitude && longitude ? 15 : 2,
      interactive: true, // Always interactive, we'll handle clicks based on editing state
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Wait for map to load
    map.current.on("load", () => {
      console.log("Map loaded successfully");
      setIsMapReady(true);

      // Add marker if coordinates exist
      if (latitude && longitude) {
        addMarker(latitude, longitude);
        // Center map on coordinates
        map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
      }
    });

    // Add a test click handler to see if map is clickable
    map.current.on("click", (e) => {
      console.log("Map clicked (test handler) - coordinates:", e.lngLat);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isEditing, isDarkMode]);

  // Update map style when dark mode changes
  useEffect(() => {
    if (map.current && isMapReady) {
      const newStyle = isDarkMode
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v12";
      map.current.setStyle(newStyle);
    }
  }, [isDarkMode, isMapReady]);

  // Add marker to map
  const addMarker = useCallback(
    (lat, lng) => {
      if (!map.current || !isMapReady) {
        console.log("Cannot add marker - map not ready or not available");
        return;
      }

      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }

      // Create marker element
      const el = document.createElement("div");
      el.className = "hotel-marker";
      el.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
      el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

      // Add marker to map
      marker.current = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);
    },
    [isMapReady]
  );

  // Update marker position
  const updateMarker = useCallback(
    (lat, lng) => {
      if (!map.current) {
        console.log("Cannot update marker - map not available");
        return;
      }

      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        // Create new marker if it doesn't exist
        addMarker(lat, lng);
      }

      map.current.flyTo({ center: [lng, lat], zoom: 15 });
    },
    [addMarker]
  );

  // Handle map click events when editing state changes
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    const handleMapClick = (e) => {
      console.log("Map clicked, isEditing:", isEditing);
      if (isEditing) {
        const { lng, lat } = e.lngLat;
        console.log("Setting new location:", lat, lng);
        setTempLocation({ lat, lng });
        updateMarker(lat, lng);
      }
    };

    // Add click listener
    map.current.on("click", handleMapClick);
    console.log("Map click listener added, isEditing:", isEditing);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick);
        console.log("Map click listener removed");
      }
    };
  }, [isMapReady, isEditing, updateMarker]);

  // Handle location change
  const handleLocationChange = useCallback(() => {
    if (onLocationChange) {
      onLocationChange(tempLocation.lat, tempLocation.lng);
    }
  }, [tempLocation, onLocationChange]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setTempLocation({ lat: latitude, lng: longitude });
    if (marker.current) {
      updateMarker(latitude, longitude);
    }
    if (onToggleEdit) {
      onToggleEdit(false);
    }
  }, [latitude, longitude, updateMarker, onToggleEdit]);

  // Handle coordinate input changes
  const handleLatitudeChange = useCallback(
    (e) => {
      const value = parseFloat(e.target.value) || null;
      setTempLocation((prev) => ({ ...prev, lat: value }));
      if (value && tempLocation.lng) {
        updateMarker(value, tempLocation.lng);
      }
    },
    [tempLocation.lng, updateMarker]
  );

  const handleLongitudeChange = useCallback(
    (e) => {
      const value = parseFloat(e.target.value) || null;
      setTempLocation((prev) => ({ ...prev, lng: value }));
      if (value && tempLocation.lat) {
        updateMarker(tempLocation.lat, value);
      }
    },
    [tempLocation.lat, updateMarker]
  );

  // Update marker when coordinates change from props
  useEffect(() => {
    if (isMapReady && latitude && longitude) {
      updateMarker(latitude, longitude);
    }
  }, [latitude, longitude, isMapReady, updateMarker]);

  // Update marker when tempLocation changes (from user input)
  useEffect(() => {
    if (isMapReady && tempLocation.lat && tempLocation.lng) {
      updateMarker(tempLocation.lat, tempLocation.lng);
    }
  }, [tempLocation, isMapReady, updateMarker]);

  // Ensure marker is added when coordinates are available
  useEffect(() => {
    if (isMapReady && latitude && longitude && !marker.current) {
      addMarker(latitude, longitude);
    }
  }, [isMapReady, latitude, longitude, addMarker]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Hotel Location</h3>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Edit button clicked");
              onToggleEdit && onToggleEdit(true);
            }}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Location
          </Button>
        )}
      </div>

      {/* Address Display */}
      {address && (
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Address</Label>
          <Input type="text" value={address} readOnly className="bg-muted" />
        </div>
      )}

      {/* Coordinates Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latitude */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Latitude</Label>
          <Input
            type="number"
            step="any"
            value={
              isEditing
                ? tempLocation.lat?.toFixed(6) || ""
                : latitude?.toFixed(6) || ""
            }
            onChange={isEditing ? handleLatitudeChange : undefined}
            readOnly={!isEditing}
            placeholder="Enter latitude"
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        {/* Longitude */}
        <div className="flex flex-col gap-2">
          <Label className="text-lg">Longitude</Label>
          <Input
            type="number"
            step="any"
            value={
              isEditing
                ? tempLocation.lng?.toFixed(6) || ""
                : longitude?.toFixed(6) || ""
            }
            onChange={isEditing ? handleLongitudeChange : undefined}
            readOnly={!isEditing}
            placeholder="Enter longitude"
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg border border-input"
          style={{ minHeight: "384px" }}
        />

        {/* Map Instructions */}
        {isEditing && (
          <div className="absolute top-4 left-4 bg-background p-3 rounded-lg shadow-lg border border-input max-w-xs">
            <p className="text-sm text-foreground">
              <strong>Click on the map</strong> to set the hotel location, or
              use the location button to find your current position.
            </p>
          </div>
        )}

        {/* Loading State */}
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-dashed rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Controls */}
      {isEditing && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelEdit}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleLocationChange}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Location
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelLocationMap;
