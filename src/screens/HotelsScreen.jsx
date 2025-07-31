import React, { use, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UpdateHotel from "./UpdateHotel";
import { ChevronDown, Hand, Plus, Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import AlertBox from "../components/AlertBox";
import AddButton from "../components/AddButton";
import { Description } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HotelsScreen() {
  const Hotels = [
    {
      id: "41b3d380-5837-445d-a2f0-965398f303e9",
      name: "Heller, Kling and Graham Hotel",
      status: "approved",
      address: "8800 Toy Neck",
      postalCode: "14942",
      description:
        "Aestivus caput turpis stella cicuta villa animadverto harum careo verus. Unus cohibeo atrocitas commodi vespillo aspernatur.",
      ownerId: "4a632c30-0ba8-4ea7-8549-dce67d0f8fdf",
      createdAt: "2025-06-30T11:09:23.447Z",
      updatedAt: "2025-06-30T11:09:23.447Z",
      starRating: 3,
      numberOfRooms: 141,
      location: {
        lat: 57.70589438947562,
        lng: 157.7157639323622,
      },
      country: {
        id: "687e8e0e-a887-4290-ae68-c3eb2c75ea18",
        name: "United States",
      },
      state: {
        id: "052e3d52-0ebf-4993-aa27-8b9c51408f9c",
        name: "California",
      },
      city: {
        id: "005ce719-7776-4693-bc9d-74b0bf7219c1",
        name: "Santa Ynez",
      },
      images: [
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1a",
          url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&w=800&q=80",
          altText: "Swimming pool",
          isPrimary: false,
          order: 1,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1b",
          url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&w=800&q=80",
          altText: "Conference room",
          isPrimary: false,
          order: 2,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1c",
          url: "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&w=800&q=80",
          altText: "Deluxe room",
          isPrimary: false,
          order: 3,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1d",
          url: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&w=800&q=80",
          altText: "Hotel exterior",
          isPrimary: true,
          order: 4,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1e",
          url: "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&w=800&q=80",
          altText: "Conference room",
          isPrimary: false,
          order: 5,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1f",
          url: "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&w=800&q=80",
          altText: "Bar and lounge",
          isPrimary: false,
          order: 6,
        },
      ],
      amenities: [
        {
          id: "f73c3a27-333a-4c51-8b8b-84d796ba0312",
          name: "Swimming Pool",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3ca.png",
        },
        {
          id: "758ea51b-ae02-4401-b682-0cf486facfcb",
          name: "Fireplace",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f525.png",
        },
        {
          id: "d710ab4c-a23f-40ce-8062-deb9eff069be",
          name: "Tennis Court",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3be.png",
        },
        {
          id: "5e009d4f-c4ff-420f-9a38-3457c54f67d2",
          name: "Sea View",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f30a.png",
        },
        {
          id: "048ac46a-3ce1-47c1-9437-1925f93d3018",
          name: "Game Room",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3ae.png",
        },
        {
          id: "65ab2ad8-1047-410e-9c97-23dca2ae30c9",
          name: "Golf Course",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/26f3.png",
        },
      ],
      faq: [
        {
          question: "Is there a concierge service?",
          answer:
            "Vestrum volubilis statim umerus unus vesica tenuis. Celebrer est ustilo demonstro cohors candidus.",
        },
        {
          question: "Is parking available at the hotel?",
          answer:
            "Aggredior calamitas animadverto vinum stips vindico tutis supplanto. Defluo copiose delego itaque autem tutamen tondeo arca adflicto aeternus.",
        },
        {
          question: "Can I store my luggage after check-out?",
          answer:
            "Vicinus talis cuius voluptatum vapulus. Teneo sapiente cunae deduco curatio.",
        },
        {
          question: "Is there a fitness center or gym?",
          answer:
            "Degenero tres audentia acerbitas aestivus dedecor eaque. Solio cunabula vergo.",
        },
        {
          question: "Is there an airport shuttle service?",
          answer:
            "Veritas carpo cilicium. A animus tenus praesentium adsidue aspernatur taceo demergo clarus valde.",
        },
      ],
      reviews: [
        {
          id: "3ecfbeb2-3b8d-4ac3-9a5d-372754b51ea8",
          user: {
            id: "308fd3c3-6eb4-4b46-b04e-bf6d0fba2c2d",
            firstName: "Patience",
            lastName: "Hintz",
            profileImageUrl:
              "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/26f3.png",
          },
          rating: 2,
          comment:
            "Tantum coadunatio quae aestivus cunae amaritudo approbo virga aduro. Unus tum xiphias quaerat aveho deinde argentum. Cribro usque contigo eaque sortitus vobis quae aequus vaco.",
          createdAt: "2025-02-09T09:09:41.870Z",
        },
        {
          id: "93ab2e93-07a7-4ae0-a7ab-8278c7bfcf7f",
          user: {
            id: "4a632c30-0ba8-4ea7-8549-dce67d0f8fdf",
            firstName: "Jamil",
            lastName: "Marvin",
            profileImageUrl: null,
          },
          rating: 2,
          comment:
            "Victoria censura uterque tubineus autus condico cotidie distinctio esse. Aliquam cotidie ut compello conservo delectus eos pauper demulceo temeritas. Comis adsidue candidus summopere creta vita tergo abscido.",
          createdAt: "2024-08-07T15:39:02.005Z",
        },
        {
          id: "8fccc0c8-af05-4096-80f7-1222cc470a41",
          user: {
            id: "a1762fc6-9f3f-4868-9bc1-420f3812b1dd",
            firstName: "Baby",
            lastName: "Simonis",
            profileImageUrl: null,
          },
          rating: 1,
          comment:
            "Nobis verus calco turpis. Totam vigor tenuis copiose claudeo aqua tantillus. Ciminatio xiphias uterque terror succedo sursum valde tertius ultra vita.",
          createdAt: "2023-10-06T13:20:17.933Z",
        },
      ],
      avgReview: 1.7,
      totalReviews: 3,
    },
    {
      id: "1b3d380-5837-445d-a2f0-965398f303e9",
      name: "Kling and Graham Hotel",
      status: "approved",
      address: "8800 Toy Neck",
      postalCode: "14942",
      description:
        "Aestivus caput turpis stella cicuta villa animadverto harum careo verus. Unus cohibeo atrocitas commodi vespillo aspernatur.",
      ownerId: "4a632c30-0ba8-4ea7-8549-dce67d0f8fdf",
      createdAt: "2025-06-30T11:09:23.447Z",
      updatedAt: "2025-06-30T11:09:23.447Z",
      starRating: 2.5,
      numberOfRooms: 51,
      location: {
        lat: 57.70589438947562,
        lng: 157.7157639323622,
      },
      country: {
        id: "687e8e0e-a887-4290-ae68-c3eb2c75ea18",
        name: "United States",
      },
      state: {
        id: "052e3d52-0ebf-4993-aa27-8b9c51408f9c",
        name: "California",
      },
      city: {
        id: "005ce719-7776-4693-bc9d-74b0bf7219c1",
        name: "Santa Ynez",
      },
      images: [
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1a",
          url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&w=800&q=80",
          altText: "Swimming pool",
          isPrimary: true,
          order: 1,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1b",
          url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&w=800&q=80",
          altText: "Conference room",
          isPrimary: false,
          order: 2,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1c",
          url: "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&w=800&q=80",
          altText: "Deluxe room",
          isPrimary: false,
          order: 3,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1d",
          url: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&w=800&q=80",
          altText: "Hotel exterior",
          isPrimary: false,
          order: 4,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1e",
          url: "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&w=800&q=80",
          altText: "Conference room",
          isPrimary: false,
          order: 5,
        },
        {
          id: "005ce719-7776-4693-bc9d-74b0bf7219c1f",
          url: "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&w=800&q=80",
          altText: "Bar and lounge",
          isPrimary: false,
          order: 6,
        },
      ],
      amenities: [
        {
          id: "f73c3a27-333a-4c51-8b8b-84d796ba0312",
          name: "Swimming Pool",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3ca.png",
        },
        {
          id: "758ea51b-ae02-4401-b682-0cf486facfcb",
          name: "Fireplace",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f525.png",
        },
        {
          id: "d710ab4c-a23f-40ce-8062-deb9eff069be",
          name: "Tennis Court",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3be.png",
        },
        {
          id: "5e009d4f-c4ff-420f-9a38-3457c54f67d2",
          name: "Sea View",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f30a.png",
        },
        {
          id: "048ac46a-3ce1-47c1-9437-1925f93d3018",
          name: "Game Room",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3ae.png",
        },
        {
          id: "ea6efa49-b2b1-4af8-b0d2-43bd954ffac1",
          name: "Sauna",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f9d6-200d-2642-fe0f.png",
        },
        {
          id: "61e69213-a485-4ef2-90e0-5bb697088f66",
          name: "Hot Tub",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f9d6.png",
        },
        {
          id: "65ab2ad8-1047-410e-9c97-23dca2ae30c9",
          name: "Golf Course",
          icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/26f3.png",
        },
      ],
      faq: [
        {
          question: "Is there a concierge service?",
          answer:
            "Vestrum volubilis statim umerus unus vesica tenuis. Celebrer est ustilo demonstro cohors candidus.",
        },
        {
          question: "Is parking available at the hotel?",
          answer:
            "Aggredior calamitas animadverto vinum stips vindico tutis supplanto. Defluo copiose delego itaque autem tutamen tondeo arca adflicto aeternus.",
        },
        {
          question: "Can I store my luggage after check-out?",
          answer:
            "Vicinus talis cuius voluptatum vapulus. Teneo sapiente cunae deduco curatio.",
        },
        {
          question: "Is there a fitness center or gym?",
          answer:
            "Degenero tres audentia acerbitas aestivus dedecor eaque. Solio cunabula vergo.",
        },
        {
          question: "Is there an airport shuttle service?",
          answer:
            "Veritas carpo cilicium. A animus tenus praesentium adsidue aspernatur taceo demergo clarus valde.",
        },
      ],
      reviews: [
        {
          id: "3ecfbeb2-3b8d-4ac3-9a5d-372754b51ea8",
          user: {
            id: "308fd3c3-6eb4-4b46-b04e-bf6d0fba2c2d",
            firstName: "Patience",
            lastName: "Hintz",
            profileImageUrl:
              "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/26f3.png",
          },
          rating: 2,
          comment:
            "Tantum coadunatio quae aestivus cunae amaritudo approbo virga aduro. Unus tum xiphias quaerat aveho deinde argentum. Cribro usque contigo eaque sortitus vobis quae aequus vaco.",
          createdAt: "2025-02-09T09:09:41.870Z",
        },
        {
          id: "93ab2e93-07a7-4ae0-a7ab-8278c7bfcf7f",
          user: {
            id: "4a632c30-0ba8-4ea7-8549-dce67d0f8fdf",
            firstName: "Jamil",
            lastName: "Marvin",
            profileImageUrl: null,
          },
          rating: 2,
          comment:
            "Victoria censura uterque tubineus autus condico cotidie distinctio esse. Aliquam cotidie ut compello conservo delectus eos pauper demulceo temeritas. Comis adsidue candidus summopere creta vita tergo abscido.",
          createdAt: "2024-08-07T15:39:02.005Z",
        },
        {
          id: "8fccc0c8-af05-4096-80f7-1222cc470a41",
          user: {
            id: "a1762fc6-9f3f-4868-9bc1-420f3812b1dd",
            firstName: "Baby",
            lastName: "Simonis",
            profileImageUrl: null,
          },
          rating: 1,
          comment:
            "Nobis verus calco turpis. Totam vigor tenuis copiose claudeo aqua tantillus. Ciminatio xiphias uterque terror succedo sursum valde tertius ultra vita.",
          createdAt: "2023-10-06T13:20:17.933Z",
        },
      ],
      avgReview: 1.7,
      totalReviews: 3,
    },
  ];

  const [hotellist, setHotellist] = useState(Hotels); // State to store the list of hotels
  const [hotelIndex, setHotelIndex] = useState("0"); // State to store the index of the selected hotel
  const [show, setShow] = useState(false); // State to control the visibility of the modal
  const [addOpen, setAddOpen] = useState(false); // State to control the visibility of the add hotel form
  const [addHotel, setAddHotel] = useState({
    // State to store the details of the new hotel
    id: Math.random().toString(),
    name: "",
    status: "approved",
    address: "",
    postalCode: "",
    description: "",
    ownerId: "",
    createdAt: "",
    updatedAt: "",
    starRating: 1,
    numberOfRooms: 1,
    location: {
      lat: "",
      lng: "",
    },
    country: {
      id: Math.random().toString(),
      name: "",
    },
    state: {
      id: Math.random().toString(),
      name: "",
    },
    city: {
      id: Math.random().toString(),
      name: "",
    },
    images: [],
    amenities: [],
    faq: [],
    reviews: [],
    avgReview: 1.7,
    totalReviews: 3,
  });

  // Function to update a hotel
  const updateNewHotel = (newHotel) => {
    setHotellist((prevHotels) => {
      const hotelExists = prevHotels.some((hotel) => hotel.id === newHotel.id);

      if (hotelExists) {
        // Replace the existing hotel with the new one
        return prevHotels.map((hotel) =>
          hotel.id === newHotel.id ? newHotel : hotel
        );
      } else {
        // Add new hotel if ID doesn't exist
        return [...prevHotels, newHotel];
      }
    });
  };

  // Function to add a new hotel
  function HandleAddHotel(event) {
    event.preventDefault();
    setAddHotel({ ...addHotel, id: Math.random().toString() });
    if (addHotel.name === "") return;
    if (addHotel.description === "") return;
    if (addHotel.address === "") return;
    if (addHotel.city === "") return;
    if (addHotel.state === "") return;
    if (addHotel.country === "") return;
    if (addHotel.numberOfRooms === 0) return;
    setHotellist((prevHotels) => [addHotel, ...prevHotels]);
    setAddHotel({ images: [] });
    setAddOpen(false);
  }
  // Add a state variable to store the filter text
  const [filterText, setFilterText] = useState({
    country: "",
    city: "",
    starRating: "",
  });
  const [checkform, setCheckform] = useState("Add Hotel");
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter the hotel list based on the filter text
  const filteredHotels = hotellist.filter((hotel) => {
    return (
      hotel.country.name
        .toLowerCase()
        .includes(filterText.country.toLowerCase()) &&
      hotel.starRating.toString().includes(filterText.starRating) &&
      hotel.city.name.toLowerCase().includes(filterText.city.toLowerCase())
    );
  });

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      {/* Header */}
      {!show && (
        <div className="mb-6 flex justify-between">
          <h1 className="text-2xl font-bold ">Hotels</h1>
          <div className="flex gap-2">
            <AddButton
              buttonValue="Filter"
              onAdd={() => {
                setFilterOpen(!filterOpen);
                setCheckform("Filter");
              }}
            />
            <AddButton
              buttonValue="Add Hotel"
              onAdd={() => {
                setAddOpen(true);
                setCheckform("Add Hotel");
              }}
            />
          </div>
        </div>
      )}

      {
        <div
          className={`${
            filterOpen
              ? "p-2 flex gap-2 border shadow rounded-md mb-3 transition-hight duration-300 h-fit"
              : " h-0 overflow-hidden"
          }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-1 w-full border shadow p-1 rounded-md cursor-pointer">
              {filterText.country === "" ? "Country" : filterText.country} <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 h-56">
              <DropdownMenuItem
                onClick={() => setFilterText({ ...filterText, country: "" })}
              >
                All Country
              </DropdownMenuItem>
              {[...new Set(hotellist.map((hotel) => hotel.country.name))]
                .sort()
                .map((countryName) => (
                  <DropdownMenuItem
                    key={countryName}
                    value={countryName}
                    onClick={() => {
                      setFilterText({ ...filterText, country: countryName });
                    }}
                  >
                    {countryName}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-1 w-full border shadow p-1 rounded-md cursor-pointer">
              {filterText.city === "" ? "City" : filterText.city} <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 h-56">
              <DropdownMenuItem
                onClick={() => setFilterText({ ...filterText, city: "" })}
              >
                All City
              </DropdownMenuItem>
              {[...new Set(hotellist.map((hotel) => hotel.city.name))]
                .sort()
                .map((cityName) => (
                  <DropdownMenuItem
                    key={cityName}
                    value={cityName}
                    onClick={() => {
                      setFilterText({ ...filterText, city: cityName });
                    }}
                  >
                    {cityName}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-1 w-full border shadow p-1 rounded-md cursor-pointer">
              {filterText.starRating === "" ? "Rating" : filterText.starRating} <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 h-56">
              <DropdownMenuItem
                onClick={() => setFilterText({ ...filterText, starRating: "" })}
              >
                All Rating
              </DropdownMenuItem>
              {[...new Set(hotellist.map((hotel) => hotel.starRating))]
                .sort((a, b) => a - b)
                .map((starRating) => (
                  <DropdownMenuItem
                    key={starRating}
                    value={starRating}
                    onClick={() => {
                      setFilterText({ ...filterText, starRating: starRating });
                    }}
                  >
                    {starRating}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }

      {/* Modal for updating a hotel */}
      {show && (
        <UpdateHotel
          hotel={hotellist[hotelIndex]}
          setShow={setShow}
          defaultAmenities={Hotels[hotelIndex].amenities}
          onAddHotel={updateNewHotel}
        />
      )}

      {/* List of hotels */}
      {!show && (
        <div className=" flex flex-col gap-4  ">
          {/* Hotels List */}
          {filteredHotels.length === 0 && (
            <div className="flex flex-col gap-2 items-center justify-center h-50">
              <p className="text-center text-muted-foreground">
                No result found
              </p>
            </div>
          )}
          {filteredHotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="min-[800px]:flex-col min-[1010px]:flex-row flex-col gap-2 px-2 py-3 shadow-sm hover:shadow-muted-foreground duration-300 transition-shadow cursor-pointer relative"
              onClick={() => {
                setHotelIndex(hotellist.indexOf(hotel));
              }}
            >
              <CardHeader
                className="flex flex-col justify-center items-center px-2 pb-0 w-full "
                onClick={() => setShow(true)}
              >
                {hotel.images.find((image) => image.isPrimary) && (
                  <img
                    src={hotel.images.find((image) => image.isPrimary).url}
                    alt={hotel.images.find((image) => image.isPrimary).altText}
                    className="w-full object-cover rounded-md"
                  />
                )}
              </CardHeader>

              <div
                className="flex flex-col w-full justify-between "
                onClick={() => setShow(true)}
              >
                <CardContent className="px-2 flex flex-col gap-4 text-left justify-between h-full">
                  <div className=" w-full flex justify-between items-start ">
                    <CardTitle className="leading-normal">
                      {hotel.name}
                    </CardTitle>

                    <Badge variant="secondary">⭐ {hotel.starRating}</Badge>
                  </div>
                  <div className="border-t-2 pt-1 ">
                    <p className="font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">
                      {hotel.description}
                    </p>
                  </div>
                  <div className="border-t-2 pt-1">
                    <p className="font-medium">Address : {hotel.address}</p>
                    <div className="text-xs text-muted-foreground">
                      <p>City : {hotel.city.name}</p>
                      <p>Country : {hotel.country.name}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className=" px-2 pt-4 justify-between relative">
                  <p>{hotel.numberOfRooms} - Rooms</p>
                </CardFooter>
              </div>
              <AlertBox
                Check="Hotel"
                hotelName={hotel.name}
                onDelete={() => {
                  setHotellist(
                    hotellist.filter((item) => item.id !== hotel.id)
                  );
                }}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Add New Hotel */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            {checkform === "Add Hotel" ? (
              <SheetTitle>Add Hotel</SheetTitle>
            ) : (
              <SheetTitle>Filter</SheetTitle>
            )}
            <Description></Description>
          </SheetHeader>
          <form
            onSubmit={HandleAddHotel}
            className="h-full px-5 overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 py-4">
              {/* Hotel Name */}
              <Input
                placeholder="Hotel Name"
                onChange={(e) =>
                  setAddHotel({ ...addHotel, name: e.target.value })
                }
                required
              />

              {/* Description */}
              <Input
                placeholder="Description"
                onChange={(e) =>
                  setAddHotel({ ...addHotel, description: e.target.value })
                }
                required
              />

              <div className="flex gap-4">
                {/* Address */}
                <Input
                  placeholder="Address"
                  onChange={(e) =>
                    setAddHotel({ ...addHotel, address: e.target.value })
                  }
                  required
                />

                {/* City */}
                <Input
                  placeholder="City"
                  onChange={(e) =>
                    setAddHotel({
                      ...addHotel,
                      city: { name: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                {/* Country */}
                <Input
                  placeholder="Country"
                  onChange={(e) =>
                    setAddHotel({
                      ...addHotel,
                      country: { name: e.target.value },
                    })
                  }
                  required
                />

                {/* Postal Code */}
                <Input
                  placeholder="Postal Code"
                  onChange={(e) =>
                    setAddHotel({ ...addHotel, postalCode: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                {/* State */}
                <Input
                  placeholder="State"
                  onChange={(e) =>
                    setAddHotel({
                      ...addHotel,
                      state: { name: e.target.value },
                    })
                  }
                  required
                />

                {/* Number of Rooms */}
                <Input
                  placeholder="Number of Rooms"
                  onChange={(e) =>
                    setAddHotel({
                      ...addHotel,
                      numberOfRooms: e.target.value,
                    })
                  }
                  type="number"
                  required
                />
              </div>

              <div className=" flex flex-col justify-center items-center w-full h-30 rounded dark:bg-slate-800 bg-slate-300 ">
                {/* Upload Image */}
                <label
                  htmlFor="addImage"
                  className="cursor-pointer flex flex-col justify-center items-center w-full h-full text-sm "
                >
                  {addHotel.images[0] ? (
                    <img
                      src={addHotel.images[0].url}
                      alt={addHotel.images[0].altText}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <Upload className=" w-6 " />
                      <p className="text-sm">Upload Image</p>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name=""
                  id="addImage"
                  className="hidden"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    setAddHotel({
                      ...addHotel,
                      images: [
                        {
                          url: URL.createObjectURL(e.target.files[0]),
                          altText: e.target.files[0].name,
                          isPrimary: true,
                          order: 1,
                        },
                      ],
                    });
                  }}
                />
              </div>
            </div>

            <SheetFooter className="flex flex-col gap-3 px-0">
              <Button
                type="submit"
                onClick={HandleAddHotel}
                className="w-full cursor-pointer"
              >
                Add Hotel
              </Button>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
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
