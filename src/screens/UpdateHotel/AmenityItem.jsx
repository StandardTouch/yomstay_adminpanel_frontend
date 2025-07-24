import React from "react";
import { X } from "lucide-react";
import AlertBox from "../../components/AlertBox";

export const AmenityItem = ({ amenity, onDelete, onAdd, CheckSheet }) => (
  <div className="relative" >
    <div className=" cursor-pointer flex items-center gap-2 p-2 border rounded-md" onClick={onAdd}>
      <img src={amenity.icon} alt={amenity.name} className="w-15 h-15" />
      <p>{amenity.name}</p>
    </div>
    <div className=" absolute top-0 right-2 flex flex-col justify-evenly gap-1 h-full ">
      {CheckSheet === "amenitySheet" ? <div className="cursor-pointer bg-red-500 hover:bg-red-700 text-white p-0.5 rounded-2xl" onClick={onDelete}><X size={16} /></div> :
        <AlertBox Check="amenity" onDelete={onDelete} />}
    </div>
  </div>
); 