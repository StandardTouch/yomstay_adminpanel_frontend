import React from "react";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const AmenityItem = ({ amenity, onDelete, onAdd }) => (
  <div className="relative" >
    <div className=" cursor-pointer flex items-center gap-2 p-2 border rounded-md" onClick={onAdd}>
      <img src={amenity.icon} alt={amenity.name} className="w-15 h-15" />
      <p>{amenity.name}</p>
    </div>
    {/* <X size={16} className="cursor-pointer text-red-500" onClick={onDelete} /> */}
    <div className=" absolute top-0 right-2 flex flex-col justify-evenly gap-1 h-full ">
    <AlertDialog>
      <AlertDialogTrigger><div className="cursor-pointer bg-red-500 hover:bg-red-700 text-white p-0.5 rounded-2xl"><X size={16} /></div></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your amenity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-700 text-white cursor-pointer" onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  </div>
); 