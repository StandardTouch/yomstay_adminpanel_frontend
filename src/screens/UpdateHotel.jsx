import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Plus } from "lucide-react";
import { MdOutlineStar } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose, } from "@/components/ui/sheet";

function UpdateHotel({ hotel, setShow, onAddHotel }) {
  const [hotelName, setHotelName] = useState(hotel.name);
  const [hotelDescription, setHotelDescription] = useState(hotel.description);
  const [hotelAddress, setHotelAddress] = useState(hotel.address);
  const [hotelState, setHotelState] = useState(hotel.state.name);
  const [hotelCity, setHotelCity] = useState(hotel.city.name);
  const [hotelCountry, setHotelCountry] = useState(hotel.country.name);
  const [hotelImages, setHotelImages] = useState(hotel.images);
  const [rating, setRating] = useState(hotel.starRating);
  const [numberOfRooms, setNumberOfRooms] = useState(hotel.numberOfRooms);
  const [postCode, setPostCode] = useState(hotel.postalCode);
  const [amenities, setAmenities] = useState(hotel.amenities);
  const [faqs, setFaqs] = useState(hotel.faq);
  const [reviews, setReviews] = useState(hotel.reviews);
  const [addOpen, setAddOpen] = useState(false); // State to control the visibility of the add hotel form
  const [addFaq, setAddFaq] = useState({ question: "", answer: "" });
  const [addAmenity, setAddAmenity] = useState({id: Math.random().toString(), name: "", icon: "" });
  const [showFaqForm, setShowFaqForm] = useState(false)

  // Function to add a new hotel
  const addHotel = () => {
    onAddHotel({
      id: hotel.id,
      name: hotelName,
      description: hotelDescription,
      address: hotelAddress,
      city: { name: hotelCity },
      state: { name: hotelState },
      country: { name: hotelCountry },
      images: hotelImages,
      starRating: rating,
      numberOfRooms: numberOfRooms,
      postalCode: postCode,
      amenities: amenities,
      faq: faqs,
      reviews: reviews,
    });
    setShow(false);
  };

  // Function to handle star rating
  const handleStarClick = (event, starValue) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const isHalf = clickX < width / 2;
    const newRating = isHalf ? starValue - 0.5 : starValue;
    setRating(newRating);
  };

  return (
    <div className="w-full bg-inherit flex flex-col gap-4 pb-10">
      {/* Heading and Buttons */}
      <div className="flex flex-col md:flex-row justify-between w-full">
        {/* Heading Name */}
        <h1 className="text-2xl font-bold mb-6">Update Hotel</h1>
        {/* Buttons */}
        <div className="flex flex-row gap-2">
          {/* Cancel Button */}
          <Button className="cursor-pointer" onClick={() => setShow(false)}>
            Cancel
          </Button>
          {/* Update Button */}
          <Button className="cursor-pointer" onClick={addHotel}>
            Update
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="images" className="w-full ">
        <div className="w-full overflow-scroll md:overflow-hidden rounded-md">
          <TabsList className="flex gap-2 *:cursor-pointer z-20">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="amenities" onClick={() => setShowFaqForm(false)}>Amenities</TabsTrigger>
            <TabsTrigger value="faqs" onClick={() => setShowFaqForm(true)}>Faqs</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
        </div>

        {/* Images Tab */}
        <TabsContent value="images" className="border rounded-md p-2">
          <div className="flex flex-col gap-2 p-1">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <h2 className="text-2xl font-semibold">Images</h2>
              <p>Select a featured image by clicking on the star icon</p>
            </div>
            <div className="flex md:flex-row flex-wrap border rounded-md">
              {hotelImages.map((image, index) => (
                <div className="md:w-1/4 w-1/2 p-1 relative" key={index}>
                  <img src={image.url} alt="hotel" className="rounded w-full min-h-40 h-full object-cover" />
                  <div className="absolute top-2 right-2 z-10 flex flex-row gap-2">
                    {/* Star Button */}
                    <Badge className="cursor-pointer" onClick={() => { const updatedImages = hotelImages.map((img) => ({ ...img, isPrimary: img.id === image.id, })); setHotelImages(updatedImages); }} >
                      {image.isPrimary ? ( <MdOutlineStar /> ) : ( <Star className="dark:text-black" /> )}
                    </Badge>

                    {/* Delete Button */}
                    <button className="cursor-pointer w-fit p-0.5 px-0.5 rounded-2xl h-fit bg-white" onClick={() => { hotelImages.splice(index, 1); setHotelImages([...hotelImages]); }} >
                      <X className="dark:text-black p-1" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add Image */}
              <div className="md:w-1/4 w-1/2 p-1">
                <div className="flex flex-col justify-center items-center w-full min-h-40 h-full rounded dark:bg-slate-800 bg-slate-300">
                  <label htmlFor="addImage" className="cursor-pointer flex flex-col justify-center items-center w-full h-full text-sm" >
                    <Upload className="w-6" />
                    Upload Image
                  </label>
                  <input type="file" id="addImage" className="hidden" accept="image/*" onChange={(e) => { const addImage = { altText: e.target.files[0].name, id: Math.random().toString(), url: URL.createObjectURL(e.target.files[0]), }; setHotelImages((prevImages) => [...prevImages, addImage]); }} />
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
          {/* Hotel Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="hotelName" className="text-lg">
              Name
            </label>
            <Input type="text" className="w-full p-3" id="hotelName" required value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
          </div>

          {/* Hotel Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-lg">
              Description
            </label>
            <Input type="text" className="w-full p-3" id="description" required value={hotelDescription} onChange={(e) => setHotelDescription(e.target.value)} />
          </div>

          {/* Hotel Rating */}
          <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="rating" className="text-lg">
                Star Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  let icon;
                  if (rating >= star) {
                    icon = <FaStar className="text-yellow-400" />;
                  } else if (rating >= star - 0.5) {
                    icon = <FaStarHalfAlt className="text-yellow-400" />;
                  } else {
                    icon = <FaRegStar className="text-gray-400" />;
                  }

                  return (
                    <div key={star} className="w-6 h-6 cursor-pointer" onClick={(e) => handleStarClick(e, star)} >
                      {icon}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Number of Rooms */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="numberOfRooms" className="text-lg">
                Number of Rooms
              </label>
              <Input type="number" className="w-full p-3" id="numberOfRooms" required value={numberOfRooms} onChange={(e) => setNumberOfRooms(e.target.value)} />
            </div>
          </div>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address" className="flex flex-col gap-2 border rounded-md p-3" >
          <h2 className="text-2xl font-semibold">Address</h2>
          {/* Hotel Full Address */}
          <div className="flex flex-col w-full gap-2 mt-2">
            <div className="flex flex-col md:flex-row w-full *:w-full gap-2">
              {/* Address */}
              <div className="flex flex-col gap-2 ">
                <label htmlFor="address" className="text-lg">
                  Address
                </label>
                <Input type="text" className="w-full p-3" id="address" required value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
              </div>
              {/* City */}
              <div className="flex flex-col gap-2 ">
                <label htmlFor="city" className="text-lg">
                  City
                </label>
                <Input type="text" className="w-full p-3" id="city" required value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-2 *:w-full">
              {/* Postal Code */}
              <div className="flex flex-col gap-2">
                <label htmlFor="postalCode" className="text-lg">
                  Postal Code
                </label>
                <Input type="text" className="w-full p-3" id="postalCode" required value={postCode} onChange={(e) => setPostCode(e.target.value)} />
              </div>

              {/* State */}
              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="text-lg">
                  State
                </label>
                <Input type="text" className="w-full p-3" id="state" required value={hotelState} onChange={(e) => setHotelState(e.target.value)} />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-lg">
                  Country
                </label>
                <Input type="text" className="w-full p-3" id="country" required value={hotelCountry} onChange={(e) => setHotelCountry(e.target.value)} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="flex flex-col gap-2 border rounded-md p-3" >
          {/* Amenities */}
          <div className="flex flex-wrap gap-2 justify-between mt-2">
            <div className="flex justify-between items-center gap-2 w-full">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <Button className="gap-2 cursor-pointer" onClick={() => { setAddOpen(true); }} >
                <Plus size={16} />
                Add Amenities
              </Button>
            </div>
            <div className="flex flex-wrap w-full gap-2">
              {amenities.map((amenity) => (
                <div className="flex items-center gap-2 p-2 border rounded-md" key={amenity.id} >
                  <img key={amenity.id} src={amenity.icon} alt={amenity.name} className="w-10 h-10" />
                  <p>{amenity.name}</p>
                  <X size={16} className="cursor-pointer text-red-500" onClick={() => setAmenities(amenities.filter((a) => a.id !== amenity.id))} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Faqs Tab */}
        <TabsContent value="faqs" className="flex flex-col gap-2 border rounded-md p-3" >
          <div>
            <div className="flex justify-between items-center gap-2 mb-2">
              <h2 className="text-2xl font-semibold">Faq</h2>
              <Button className="gap-2 cursor-pointer" onClick={() => {
                // setFaqs([{ question: "", answer: "" }, ...faqs]);
                setAddOpen(true);
              }} >
                <Plus size={16} /> Add Faq
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, index) => (
                <div key={index} className="flex flex-col gap-2 border p-2 rounded relative" >
                  <label htmlFor={`faq-${index}`} className="text-lg">
                    Question
                  </label>
                  <Input type="text" className="w-full p-3" id={`faq-${index}`} required value={faq.question} onChange={(e) => { const newFaqs = [...faqs]; newFaqs[index] = { ...faq, question: e.target.value }; setFaqs(newFaqs); } } />
                  <label htmlFor={`faq-${index}-answer`} className="text-lg">
                    Answer
                  </label>
                  <Textarea required name="answer" id={`faq-${index}-answer`} value={faq.answer} onChange={(e) => {
                     const newFaqs = [...faqs];
                     if (e.target.value === "") {
                      newFaqs[index] = { ...faq, answer: e.target.value };
                       setFaqs(newFaqs);
                     }
                        }} ></Textarea>
                  <Badge type="button" onClick={() => { const newFaqs = [...faqs]; newFaqs.splice(index, 1); setFaqs(newFaqs); }} variant="destructive" className="absolute top-2 right-2 cursor-pointer" >
                    Remove
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="flex flex-col gap-2 border rounded-md p-3" >
          <div className="flex flex-col gap-2">
            {reviews.map((review, index) => (
              <div key={index} className="flex flex-col gap-2 border p-2 rounded" >
                <div className="flex items-center gap-2 relative">
                  {review.user.profileImageUrl === "" && (<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt={review.name} className="w-10 h-10 rounded-full" />)}
                  {review.user.profileImageUrl !== null ? (<img src={review.user.profileImageUrl} alt={review.name} className="w-10 h-10 rounded-full" />) : (<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt={review.name} className="w-10 h-10 rounded-full" />)}
                  <div className="flex gap-2">
                    <p>{review.user.firstName}</p>
                    <p>{review.user.lastName}</p>
                  </div>
                  <p className="flex items-center gap-1 absolute right-2">
                    {review.rating} <Star size={16} className="text-yellow-500" />
                  </p>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Add Hotel</SheetTitle>
          </SheetHeader>
          {/* Add */}
          <form className="px-3">
            {/* Faq */}
            {showFaqForm && (
              <section>
                {/* Question */}
                <div>
                  <label htmlFor="question">Question</label>
                  <Input type="text" className="w-full p-3" id="question" required value={addFaq.question} onChange={(e) => setAddFaq({ ...addFaq, question: e.target.value })} />
                </div>
                {/* Answer */}
                <div>
                  <label htmlFor="answer">Answer</label>
                  <Textarea required name="answer" id="answer" value={addFaq.answer} onChange={(e) => setAddFaq({ ...addFaq, answer: e.target.value })}></Textarea>
                </div>
              </section>
            )}

            {/* Amenities */}
            {!showFaqForm && (
              <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Name</label>
                  <Input type="text" className="w-full p-3" id="name" required value={addFaq.name} onChange={(e) => setAddAmenity({ ...addAmenity, name: e.target.value })} />
                </div>
                <div className="flex flex-col justify-between items-center w-full h-10 ">
                  <label htmlFor="icon" className="w-full h-full flex items-center text-center rounded-md cursor-pointer dark:bg-slate-800 bg-slate-300 ">
                    <p className="text-xs w-full">Upload Icon Image</p>
                  </label>
                  <input type="file" className="w-full p-3 hidden" id="icon" required value={addFaq.icon} onChange={(e) => setAddAmenity({ ...addAmenity, icon: URL.createObjectURL(e.target.files[0]) })} />
                </div>
              </section>
            )}

            <SheetFooter className="flex flex-col gap-3 px-0">
              {showFaqForm ? (
                <Button type="submit" className="w-full cursor-pointer" onClick={(e) => { e.preventDefault();
                {addFaq.question === "" || addFaq.answer === "" ? alert("Please fill out all fields") : setFaqs([addFaq, ...faqs]); }
                setAddFaq({ question: "", answer: "" }); setAddOpen(false); }} >
                  Add Faq
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer" onClick={(e) => { e.preventDefault(); {addAmenity.name === "" || addAmenity.icon === "" ? alert("Please fill out all fields") : setAmenities([addAmenity, ...amenities]); } setAddAmenity({id: Math.random().toString(), name: "", icon: "" }); setAddOpen(false); }} >
                  Add Amenities
                </Button>
              )}

              <SheetClose asChild>
                <Button type="button" variant="outline" className="w-full cursor-pointer" >
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
