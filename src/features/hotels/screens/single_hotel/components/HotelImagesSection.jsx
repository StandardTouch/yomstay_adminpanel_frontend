import React, { memo, useCallback } from "react";
import { Upload } from "lucide-react";
import { ImageCard } from "./ImageCard";

const HotelImagesSection = memo(
  ({ images = [], onUpdateImages, onImageUpload }) => {
    const handleSetPrimary = useCallback(
      (imageId) => {
        const updatedImages = images.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }));
        onUpdateImages(updatedImages);
      },
      [images, onUpdateImages]
    );

    const handleDeleteImage = useCallback(
      (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        onUpdateImages(updatedImages);
      },
      [images, onUpdateImages]
    );

    const handleFileUpload = useCallback(
      (e) => {
        const file = e.target.files[0];
        if (file) {
          onImageUpload(file);
        }
      },
      [onImageUpload]
    );

    const featuredImage = images.find((img) => img.isPrimary);

    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h2 className="text-2xl font-semibold">Images</h2>
        </div>

        {/* Featured Image Display */}
        {featuredImage && (
          <div className="flex flex-col gap-2">
            <p>Featured Image</p>
            <img
              src={featuredImage.url}
              alt="Featured hotel"
              className="rounded-md md:w-1/4 w-1/2 p-1"
            />
          </div>
        )}

        <p>Select a featured image by clicking on the star icon</p>

        {/* Images Grid */}
        <div className="flex md:flex-row flex-wrap border rounded-md">
          {images.map((image, idx) => (
            <ImageCard
              key={image.id || idx}
              image={image}
              isPrimary={!!image.isPrimary}
              onSetPrimary={() => handleSetPrimary(image.id)}
              onDelete={() => handleDeleteImage(idx)}
            />
          ))}

          {/* Upload Button */}
          <div className="md:w-1/4 w-1/2 p-1">
            <div className="flex flex-col justify-center items-center w-full min-h-40 h-full rounded dark:bg-slate-800 bg-slate-300">
              <label
                htmlFor="addImage"
                className="cursor-pointer flex flex-col justify-center items-center w-full h-full text-sm"
              >
                <Upload className="w-6" />
                Upload Image
              </label>
              <input
                type="file"
                id="addImage"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HotelImagesSection.displayName = "HotelImagesSection";

export default HotelImagesSection;
