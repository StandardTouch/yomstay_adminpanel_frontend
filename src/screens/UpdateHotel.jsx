import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Plus } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ImageCard } from "./UpdateHotel/ImageCard";
import { AmenityItem } from "./UpdateHotel/AmenityItem";
import { FaqItem } from "./UpdateHotel/FaqItem";
import { ReviewItem } from "./UpdateHotel/ReviewItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddButton from "../components/AddButton";
import DragDrop from "./UpdateHotel/DragDrop";

function UpdateHotel({ hotel, setShow, onAddHotel, defaultAmenities }) {
  const [fields, setFields] = useState({
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
    state: hotel.state.name,
    city: hotel.city.name,
    country: hotel.country.name,
    images: hotel.images,
    starRating: hotel.starRating,
    numberOfRooms: hotel.numberOfRooms,
    postalCode: hotel.postalCode,
    amenities: hotel.amenities,
    faq: hotel.faq,
    reviews: hotel.reviews,
  });

  const [modal, setModal] = useState({ open: false, type: "amenity" });
  const [addFaq, setAddFaq] = useState({ question: "", answer: "" });
  const [addAmenity, setAddAmenity] = useState({
    id: Math.random().toString(),
    name: "",
    icon: "",
  });
  const [amenitiesList, setAmenitiesList] = useState(hotel.amenities);

  const handleField = (key, value) =>
    setFields((f) => ({ ...f, [key]: value }));

  const addHotel = () => {
    onAddHotel({
      id: hotel.id,
      ...fields,
      amenities: amenitiesList,
      city: { name: fields.city },
      state: { name: fields.state },
      country: { name: fields.country },
    });
    setShow(false);
  };

  const handleStarClick = (event, starValue) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const isHalf = clickX < width / 2;
    const newRating = isHalf ? starValue - 0.5 : starValue;
    handleField("starRating", newRating);
  };

  // Modal submit handlers
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!addFaq.question || !addFaq.answer)
      return alert("Please fill out all fields");
    handleField("faq", [addFaq, ...fields.faq]);
    setAddFaq({ question: "", answer: "" });
    setModal({ ...modal, open: false });
  };
  const handleAddAmenity = (e) => {
    e.preventDefault();
    const amenityExists = amenitiesList.some(
      (item) => item.id === addAmenity.id
    );
    if (!amenityExists) {
      if (!addAmenity.name) return alert("Please fill out all fields");
      setAmenitiesList([addAmenity, ...amenitiesList]);
      handleField("amenities", [addAmenity, ...fields.amenities]);
      handleCancel();
      return;
    } else {
      alert("This amenity is already added.");
      handleCancel();
    }
  };

  const [image, setImage] = useState(null);

  const handleCancel = () => {
    setImage(null);
    setAddAmenity({ id: Math.random().toString(), name: "", icon: "" });
    setAddFaq({ question: "", answer: "" });
    setModal({ ...modal, open: false });
  };

  // console.log(defaultAmenities);

  return (
    <div className="w-full bg-inherit flex flex-col gap-4 pb-10">
      <div className="flex flex-col md:flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-6">Update Hotel</h1>
        <div className="flex flex-row gap-2">
          <AddButton buttonValue="Cancel" onAdd={() => setShow(false)} />
          <AddButton buttonValue="Update" onAdd={addHotel} />
        </div>
      </div>
      <Tabs defaultValue="images" className="w-full ">
        <div className="w-full overflow-scroll md:overflow-hidden rounded-md">
          <TabsList className="flex gap-2 *:cursor-pointer z-20">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="faqs">Faqs</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
        </div>
        {/* Images Tab */}
        <TabsContent value="images" className="border rounded-md p-2">
          <div className="flex flex-col gap-2 p-1">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <h2 className="text-2xl font-semibold">Images</h2>
            </div>
            <div className="flex flex-col gap-2">
              <p>Featured Image</p>
              <img
                src={fields.images.find((img) => img.isPrimary)?.url}
                alt="hotel"
                className=" rounded-md md:w-1/4 w-1/2 p-1 "
              />
            </div>
            <p>Select a featured image by clicking on the star icon</p>
            <div className="flex md:flex-row flex-wrap border rounded-md">
              {fields.images.map((image, idx) => (
                <ImageCard
                  key={image.id || idx}
                  image={image}
                  isPrimary={!!image.isPrimary}
                  onSetPrimary={() =>
                    handleField(
                      "images",
                      fields.images.map((img) => ({
                        ...img,
                        isPrimary: img.id === image.id,
                      }))
                    )
                  }
                  onDelete={() =>
                    handleField(
                      "images",
                      fields.images.filter((_, i) => i !== idx)
                    )
                  }
                />
              ))}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const addImage = {
                        altText: file.name,
                        id: Math.random().toString(),
                        url: URL.createObjectURL(file),
                      };
                      handleField("images", [...fields.images, addImage]);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* Details Tab */}
        <TabsContent
          value="details"
          className="flex flex-col gap-2 border rounded-md p-3"
        >
          <h2 className="text-2xl font-semibold">Details</h2>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Name</label>
            <Input
              type="text"
              className="w-full p-3"
              required
              value={fields.name}
              onChange={(e) => handleField("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Description</label>
            <Input
              type="text"
              className="w-full p-3"
              required
              value={fields.description}
              onChange={(e) => handleField("description", e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg">Star Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  let icon;
                  if (fields.starRating >= star)
                    icon = <FaStar className="text-yellow-400" />;
                  else if (fields.starRating >= star - 0.5)
                    icon = <FaStarHalfAlt className="text-yellow-400" />;
                  else icon = <FaRegStar className="text-gray-400" />;
                  return (
                    <div
                      key={star}
                      className="w-6 h-6 cursor-pointer"
                      onClick={(e) => handleStarClick(e, star)}
                    >
                      {icon}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg">Number of Rooms</label>
              <Input
                type="number"
                className="w-full p-3"
                required
                value={fields.numberOfRooms}
                onChange={(e) => handleField("numberOfRooms", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        {/* Address Tab */}
        <TabsContent
          value="address"
          className="flex flex-col gap-2 border rounded-md p-3"
        >
          <h2 className="text-2xl font-semibold">Address</h2>
          <div className="flex flex-col w-full gap-2 mt-2">
            <div className="flex flex-col md:flex-row w-full *:w-full gap-2">
              <div className="flex flex-col gap-2 ">
                <label className="text-lg">Address</label>
                <Input
                  type="text"
                  className="w-full p-3"
                  required
                  value={fields.address}
                  onChange={(e) => handleField("address", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="text-lg">City</label>
                <Input
                  type="text"
                  className="w-full p-3"
                  required
                  value={fields.city}
                  onChange={(e) => handleField("city", e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-2 *:w-full">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Postal Code</label>
                <Input
                  type="text"
                  className="w-full p-3"
                  required
                  value={fields.postalCode}
                  onChange={(e) => handleField("postalCode", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">State</label>
                <Input
                  type="text"
                  className="w-full p-3"
                  required
                  value={fields.state}
                  onChange={(e) => handleField("state", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Country</label>
                <Input
                  type="text"
                  className="w-full p-3"
                  required
                  value={fields.country}
                  onChange={(e) => handleField("country", e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        {/* Amenities Tab */}
        <TabsContent
          value="amenities"
          className="flex flex-col gap-2 border rounded-md p-3"
        >
          <div className="flex flex-wrap gap-2 justify-between mt-2">
            <div className="flex justify-between items-center gap-2 w-full">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <AddButton
                buttonValue="Add Amenities"
                onAdd={() => setModal({ open: true, type: "amenity" })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
              {amenitiesList.map((amenity, idx) => (
                <AmenityItem
                  key={amenity.id || idx}
                  amenity={amenity}
                  onDelete={() =>
                    setAmenitiesList(amenitiesList.filter((_, i) => i !== idx))
                  }
                />
              ))}
            </div>
          </div>
        </TabsContent>
        {/* Faqs Tab */}
        <TabsContent
          value="faqs"
          className="flex flex-col gap-2 border rounded-md p-3"
        >
          <div>
            <div className="flex justify-between items-center gap-2 mb-2">
              <h2 className="text-2xl font-semibold">Faq</h2>
              <AddButton
                buttonValue="Add Faq"
                onAdd={() => setModal({ open: true, type: "faq" })}
              />
            </div>
            <div className="flex flex-col gap-2">
              {fields.faq.map((faq, idx) => (
                <FaqItem
                  key={idx}
                  faq={faq}
                  onChange={(newFaq) =>
                    handleField(
                      "faq",
                      fields.faq.map((f, i) => (i === idx ? newFaq : f))
                    )
                  }
                  onDelete={() =>
                    handleField(
                      "faq",
                      fields.faq.filter((_, i) => i !== idx)
                    )
                  }
                />
              ))}
            </div>
          </div>
        </TabsContent>
        {/* Reviews Tab */}
        <TabsContent
          value="reviews"
          className="flex flex-col gap-2 border rounded-md p-3"
        >
          <div>
            <h2 className="text-2xl font-semibold">Reviews</h2>
          </div>
          <div className="flex flex-col gap-2">
            {fields.reviews.map((review, idx) => (
              <ReviewItem key={idx} review={review} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {/* Modal for Add Faq/Amenity */}
      <Sheet
        open={modal.open}
        onOpenChange={(open) => {
          setModal((m) => ({ ...m, open }));
          handleCancel();
        }}
      >
        <SheetContent side="right" className="max-w-md w-full overflow-y-auto ">
          <SheetHeader>
            <SheetTitle>
              {modal.type === "faq" ? "Add Faq" : "Add Amenity"}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <form className="px-3">
            {modal.type === "faq" ? (
              <section>
                <div>
                  <label htmlFor="question">Question</label>
                  <Input
                    type="text"
                    className="w-full p-3"
                    id="question"
                    required
                    value={addFaq.question}
                    onChange={(e) =>
                      setAddFaq({ ...addFaq, question: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="answer">Answer</label>
                  <Textarea
                    required
                    id="answer"
                    value={addFaq.answer}
                    onChange={(e) =>
                      setAddFaq({ ...addFaq, answer: e.target.value })
                    }
                  />
                </div>
              </section>
            ) : (
              <section className="flex flex-col gap-3 text-start">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full border py-2 rounded-md cursor-pointer">
                    Click to Select or Add Amenity
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Dialog>
                      <DialogTrigger className="p-2 cursor-pointer dark:hover:bg-zinc-800 hover:bg-zinc-100 rounded-md w-full">
                        Click to Add New Amenity
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Amenity</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-2 text-start">
                            <label htmlFor="name">Add Amenity</label>
                            <Input
                              type="text"
                              className="w-full p-3"
                              id="name"
                              required
                              value={addAmenity.name}
                              onChange={(e) =>
                                setAddAmenity({
                                  ...addAmenity,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <DragDrop
                            setAddAmenity={setAddAmenity}
                            addAmenity={addAmenity}
                            image={image}
                            setImage={setImage}
                          />
                          <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            onClick={handleAddAmenity}
                          >
                            Add Amenities
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {defaultAmenities.map((amenity, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onClick={() => {
                          setAddAmenity(amenity);
                          setImage(amenity.icon);
                        }}
                        className="cursor-pointer w-80"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={amenity.icon}
                            alt=""
                            className="w-10 h-10"
                          />
                          {amenity.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  {addAmenity.name && addAmenity.icon && (
                    <AmenityItem
                      CheckSheet="amenitySheet"
                      amenity={addAmenity}
                      onDelete={() => {
                        setAddAmenity({ name: "", icon: "" });
                        setImage("");
                      }}
                    />
                  )}
                </div>
              </section>
            )}
            <SheetFooter className="flex flex-col gap-3 px-0">
              {modal.type === "faq" ? (
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  onClick={handleAddFaq}
                >
                  Add Faq
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  onClick={handleAddAmenity}
                >
                  Add Amenities
                </Button>
              )}
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full cursor-pointer"
                >
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default UpdateHotel;
