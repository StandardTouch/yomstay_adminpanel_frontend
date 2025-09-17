import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import UpdateHotel from "../single_hotel/singleHotel";
import { ChevronDown, Hand, Hotel, Plus, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddButton from "@/components/AddButton";
import HotelCard from "@/features/hotels/components/hotelCard";
import AllHotels from "./hotel_list";
import AddNewHotel from "../add_new_hotel/addNewHotel";

export default function HotelsScreen() {
  const Hotels = AllHotels;

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
    setAddHotel({
      ...addHotel,
      id: Math.random().toString(),
    });
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

      {!show && (
        <div
          className={`${
            filterOpen
              ? "p-2 flex gap-2 border shadow rounded-md mb-3 transition-hight duration-300 h-fit"
              : " h-0 overflow-hidden"
          }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-1 w-full border shadow p-1 rounded-md cursor-pointer">
              {filterText.country === "" ? "Country" : filterText.country}{" "}
              <ChevronDown size={16} />
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
              {filterText.city === "" ? "City" : filterText.city}{" "}
              <ChevronDown size={16} />
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
              {filterText.starRating === "" ? "Rating" : filterText.starRating}{" "}
              <ChevronDown size={16} />
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
          <Button
            onClick={() => {
              setFilterText({ country: "", city: "", starRating: "" });
            }}
          >
            Clear
          </Button>
        </div>
      )}

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
            <HotelCard
              hotel={hotel}
              key={hotel.id}
              setIndex={() => {
                setHotelIndex(hotellist.indexOf(hotel));
              }}
              showHotel={() => setShow(true)}
              showAlert={() => {
                setHotellist(hotellist.filter((item) => item.id !== hotel.id));
              }}
            />
          ))}
        </div>
      )}

      {/* Add New Hotel */}
      <AddNewHotel
        addOpen={addOpen}
        addHotel={addHotel}
        setAddHotel={setAddHotel}
        setShow={setShow}
        setAddOpen={setAddOpen}
        HandleAddHotel={HandleAddHotel}
        checkform={checkform}
      />
    </div>
  );
}
