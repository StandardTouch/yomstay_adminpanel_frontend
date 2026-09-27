import React, { memo, useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { ImageCard } from "./ImageCard";
import { useApi } from "@/contexts/ApiContext";
import { showError, showSuccess } from "@/utils/toast";

const HotelImagesSection = memo(
  ({ hotelId, images = [], onUpdateImages, onImageUpload }) => {
    const api = useApi();
    const [deletingIndex, setDeletingIndex] = useState(null);

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

    // This used to drop the image from React state and stop there. Nothing
    // was ever sent to the server, so the image came back on the next page
    // load and never left the public site.
    const handleDeleteImage = useCallback(
      async (index) => {
        // A second click while the first delete is still in flight would
        // delete the wrong image, because the list shifts underneath.
        if (deletingIndex !== null) return;

        const image = images[index];
        const removeLocally = () =>
          onUpdateImages(images.filter((_, i) => i !== index));

        // An image picked but not uploaded yet has no id, so there is
        // nothing on the server to delete.
        if (!image?.id || !hotelId) {
          removeLocally();
          return;
        }

        setDeletingIndex(index);
        try {
          await api.admin.deleteHotelImage(hotelId, image.id);
          removeLocally();
          showSuccess("Image deleted");
        } catch (error) {
          showError(
            error?.response?.data?.message ||
              "Could not delete the image. Please try again."
          );
        } finally {
          setDeletingIndex(null);
        }
      },
      [api, deletingIndex, hotelId, images, onUpdateImages]
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
