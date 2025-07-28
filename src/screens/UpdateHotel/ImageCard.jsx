import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, X } from "lucide-react";
import { MdOutlineStar } from "react-icons/md";
import AlertBox from "../../components/AlertBox";

export const ImageCard = ({ image, isPrimary, onSetPrimary, onDelete }) => (
  <div className="md:w-1/4 w-1/2 p-1 relative">
    <img src={image.url} alt="hotel" className="rounded w-full min-h-40 h-full object-cover" />
    <div className="absolute top-2 right-2 z-10 flex flex-row gap-2">
      <Badge className="cursor-pointer " onClick={onSetPrimary}>
        {isPrimary ? <MdOutlineStar /> : <Star className="dark:text-black " />}
      </Badge>
      <AlertBox Check="Image" onDelete={onDelete} />
    </div>
  </div>
); 