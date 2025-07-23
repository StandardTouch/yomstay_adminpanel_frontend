import React from "react";
import { X } from "lucide-react";

export const AmenityItem = ({ amenity, onDelete }) => (
  <div className="flex items-center gap-2 p-2 border rounded-md">
    <img src={amenity.icon} alt={amenity.name} className="w-10 h-10" />
    <p>{amenity.name}</p>
    <X size={16} className="cursor-pointer text-red-500" onClick={onDelete} />
  </div>
); 