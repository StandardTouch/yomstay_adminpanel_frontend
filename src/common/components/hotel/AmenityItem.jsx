import React from "react";
import { X } from "lucide-react";
import AlertBox from "@/components/AlertBox";

export const AmenityItem = ({ amenity, onDelete, onAdd, CheckSheet }) => (
  <div className="relative">
    <div
      className=" cursor-pointer flex items-center gap-2 p-4 border rounded-md h-full min-h-18 hover:shadow-lg dark:hover:border-accent-foreground"
      onClick={onAdd}
    >
      {amenity.icon ? (
        amenity.icon.startsWith("http") || amenity.icon.startsWith("/") ? (
          <img
            src={amenity.icon}
            alt={amenity.name}
            className="w-10 h-10 rounded"
            onError={(e) => {
              // Hide image if it fails to load
              e.target.style.display = "none";
            }}
          />
        ) : (
          // If icon is an emoji or identifier, try to display as emoji
          <span className="text-3xl w-10 h-10 flex items-center justify-center">
            {amenity.icon}
          </span>
        )
      ) : null}
      <div>
        <p>
          {amenity.name ? (
            <>
              {amenity.name.slice(0, 15)}
              {amenity.name.length > 15 && "..."}
            </>
          ) : (
            "Untitled"
          )}
        </p>
        <p className="text-sm text-accent-foreground">
          {amenity.describation || amenity.description ? (
            <>
              {(amenity.describation || amenity.description).slice(0, 15)}
              {(amenity.describation || amenity.description).length > 15 &&
                "..."}
            </>
          ) : (
            "No description"
          )}
        </p>
      </div>
    </div>
    <div className=" absolute top-0 right-2 flex flex-col justify-evenly gap-1 h-full ">
      {CheckSheet === "amenitySheet" ? (
        <div
          className="cursor-pointer bg-red-500 hover:bg-red-700 text-white p-0.5 rounded-2xl"
          onClick={onDelete}
        >
          <X size={16} />
        </div>
      ) : (
        <AlertBox Check="Amenity" onDelete={onDelete} />
      )}
    </div>
  </div>
);
