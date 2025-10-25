import React, { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Plus } from "lucide-react";
// import { MdEditSquare } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { AmenityItem } from "@/common/components/hotel/AmenityItem";
import AddButton from "@/components/AddButton";
import EmojiPicker from "emoji-picker-react";

export default function GlobalAmenities() {
  const Amenities = [
    {
      id: "f73c3a27-333a-4c51-8b8b-84d796ba0312",
      name: "Swimming Pool",
      describation: "A large outdoor pool",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3ca-200d-2642-fe0f.png",
    },
    {
      id: "758ea51b-ae02-4401-b682-0cf486facfcb",
      name: "Fireplace",
      describation: "A fireplace in the living room",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png",
    },
    {
      id: "d710ab4c-a23f-40ce-8062-deb9eff069be",
      name: "Tennis Court",
      describation: "A tennis court",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3d3.png",
    },
    {
      id: "5e009d4f-c4ff-420f-9a38-3457c54f67d2",
      name: "Sea View",
      describation: "A room with a view of the sea",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f30a.png",
    },
    {
      id: "048ac46a-3ce1-47c1-9437-1925f93d3018",
      name: "Game Room",
      describation: "A room with games",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3ae.png",
    },
    {
      id: "ea6efa49-b2b1-4af8-b0d2-43bd954ffac1",
      name: "Sauna",
      describation: "A sauna room",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f486-200d-2640-fe0f.png",
    },
    {
      id: "61e69213-a485-4ef2-90e0-5bb697088f66",
      name: "Hot Tub",
      describation: "A hot tub",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f6c1.png",
    },
    {
      id: "65ab2ad8-1047-410e-9c97-23dca2ae30c9",
      name: "Golf Course",
      describation: "A golf course",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/26f3.png",
    },
  ];

  const RoomAmenities = [
    {
      id: "1",
      name: "Swimming Pool",
      describation: "A large outdoor pool",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3ca-200d-2642-fe0f.png",
    },
    {
      id: "2",
      name: "Fireplace",
      describation: "A fireplace in the living room",
      icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png",
    },
  ];

  const [amenities, setAmenities] = useState(Amenities);
  const [roomAmenities, setRoomAmenities] = useState(RoomAmenities);
  const [addOpen, setAddOpen] = useState(false);
  const [amenitieType, setAmenitieType] = useState("Hotel");
  const [btnOpen, setBtnOpen] = useState(false);
  const [addAmenity, setAddAmenity] = useState({
    id: Math.random().toString(),
    name: "",
    describation: "",
    icon: "",
  });
  const [newemoji, setNewemoji] = useState("");
  const [amenityType, setAmenityType] = useState("hotel");

  const onEmojiClick = useEffect(() => {
    setAddAmenity({ ...addAmenity, icon: newemoji });
  }, [newemoji]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amenitieType) return alert("Please select Amenity Type");
    if (!addAmenity.name || !addAmenity.describation)
      return alert("Please fill out all fields ");
    // Add new hotel amenity
    if (amenitieType === "Hotel") {
      setAmenities((prevamenity) => {
        const amenityExists = prevamenity.some(
          (amenity) => amenity.id === addAmenity.id
        );
        if (amenityExists) {
          // Replace the existing amenity with the new one
          return prevamenity.map((amenity) =>
            amenity.id === addAmenity.id ? addAmenity : amenity
          );
        } else {
          // Add new amenity if ID doesn't exist
          return [addAmenity, ...prevamenity];
        }
      });
    }
    // Add new room amenity
    if (amenitieType === "Room") {
      setRoomAmenities((prevamenity) => {
        const amenityExists = prevamenity.some(
          (amenity) => amenity.id === addAmenity.id
        );
        if (amenityExists) {
          // Replace the existing amenity with the new one
          return prevamenity.map((amenity) =>
            amenity.id === addAmenity.id ? addAmenity : amenity
          );
        } else {
          // Add new amenity if ID doesn't exist
          return [addAmenity, ...prevamenity];
        }
      });
    }
    handleCancel();
  };

  const handleCancel = () => {
    setAddOpen(false);
    setAmenitieType("");
    setAddAmenity({ id: Math.random().toString(), name: "", icon: "" });
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Global Amenities</h1>
        <AddButton
          buttonValue="Add Amenity"
          onAdd={() => {
            setAddOpen(true);
            setBtnOpen(false);
          }}
        />
      </div>
      <div className=" flex gap-2 mt-4">
        <Button
          className={
            amenityType === "hotel"
              ? ""
              : "bg-accent text-accent-foreground hover:bg-accent/15 border cursor-pointer"
          }
          onClick={() => {
            setAmenityType("hotel");
            setAmenitieType("Hotel");
          }}
        >
          Hotel Amenities
        </Button>
        <Button
          className={
            amenityType === "room"
              ? ""
              : "bg-accent text-accent-foreground hover:bg-accent/15 border cursor-pointer"
          }
          onClick={() => {
            setAmenityType("room");
            setAmenitieType("Room");
          }}
        >
          Room Amenities
        </Button>
      </div>
      {amenityType === "hotel" && (
        <div className="mt-4">
          <div className="text-xl font-bold">Hotel Amenities</div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-1 ">
            {amenities.map((amenity) => (
              <AmenityItem
                key={amenity.id || idx}
                amenity={amenity}
                onAdd={() => {
                  setAddOpen(true);
                  setBtnOpen(true);
                  setAmenitieType("Hotel");
                  setAddAmenity(amenity);
                }}
                onDelete={() =>
                  setAmenities(amenities.filter((a) => a.id !== amenity.id))
                }
              />
            ))}
          </div>
        </div>
      )}
      {amenityType === "room" && (
        <div>
          <div className="text-xl font-bold mt-4">Room Amenities</div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-1 ">
            {roomAmenities.map((amenity) => (
              <AmenityItem
                key={amenity.id || idx}
                amenity={amenity}
                onAdd={() => {
                  setAddOpen(true);
                  setAmenitieType("Room");
                  setAddAmenity(amenity);
                }}
                onDelete={() =>
                  setRoomAmenities(
                    roomAmenities.filter((a) => a.id !== amenity.id)
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      <Sheet open={addOpen} onOpenChange={handleCancel}>
        <SheetContent side="right" className="max-w-md w-full overflow-y-auto ">
          <SheetHeader>
            <SheetTitle>Add {amenitieType} Amenity</SheetTitle>
          </SheetHeader>
          <form className="px-3">
            <div className="flex flex-col gap-3">
              <label className="text-sm" htmlFor="name">
                Amenity Name
              </label>
              <Input
                placeholder="Amenity Name"
                id="name"
                value={addAmenity.name}
                onChange={(e) => {
                  setAddAmenity({ ...addAmenity, name: e.target.value });
                }}
                className="w-full"
              />
              <label className="text-sm" htmlFor="describation">
                Amenity Describation
              </label>
              <Textarea
                id="describation"
                placeholder="Amenity Describation"
                value={addAmenity.describation}
                onChange={(e) => {
                  setAddAmenity({
                    ...addAmenity,
                    describation: e.target.value,
                  });
                }}
                className="w-full"
              ></Textarea>
              {/* <span>{addAmenity.icon}</span> */}
              <p className="text-sm">Select Icon</p>
              {addAmenity.icon && (
                <img src={addAmenity.icon} className="w-10 h-10" alt="" />
              )}
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  // setNewemoji( emoji.emoji);
                  setNewemoji(emoji.imageUrl);
                  // console.log( emoji.imageUrl);
                  onEmojiClick();
                }}
                height={350}
                width={"90%"}
                // previewConfig={{ showPreview: false }}
                skinTonesDisabled={true}
              />
            </div>
            <SheetFooter className="flex flex-col gap-3 px-0">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                onClick={handleSubmit}
              >
                {btnOpen ? "Update" : "Add"} {amenitieType} Amenities
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
