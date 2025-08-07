import React from "react";
import { Star } from "lucide-react";

export const ReviewItem = ({ review }) => (
  <div className="flex flex-col gap-2 border p-2 rounded">
    <div className="flex items-center gap-2 relative">
      <img src={review.user.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={review.name} className="w-10 h-10 rounded-full" />
      <div className="flex gap-2">
        <p>{review.user.firstName}</p>
        <p>{review.user.lastName}</p>
      </div>
      <p className="flex items-center gap-1 absolute right-2">{review.rating} <Star size={16} className="text-yellow-500" /></p>
    </div>
    <p>{review.comment}</p>
  </div>
); 