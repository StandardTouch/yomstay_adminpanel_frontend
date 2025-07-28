import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { MdEditSquare } from "react-icons/md";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { AmenityItem } from "./UpdateHotel/AmenityItem";
import AddButton from "../components/AddButton";
import DragDrop from "./UpdateHotel/DragDrop";


export default function GlobalAmenities() {

    const Amenities = [
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
    ]

    const [amenities, setAmenities] = useState(Amenities);
    const [addOpen, setAddOpen] = useState(false);
    const [addAmenity, setAddAmenity] = useState({
        id: Math.random().toString(),
        name: "",
        icon: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!addAmenity.name) return alert("Please fill out all fields");
        setAmenities((prevamenity) => {
            const amenityExists = prevamenity.some((amenity) => amenity.id === addAmenity.id);
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
        handleCancel();
    }

    const [image, setImage] = useState(null);

    const handleCancel = () => {
        setAddOpen(false);
        setImage(null);
        setAddAmenity({ id: Math.random().toString(), name: "", icon: "" });
    };

    return (
        <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Global Amenities</h1>
                <AddButton buttonValue="Add Amenity" onAdd={() => setAddOpen(true)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {amenities.map((amenity) => (
                    <AmenityItem key={amenity.id || idx} amenity={amenity} onAdd={() => { setAddOpen(true); setAddAmenity(amenity); setImage(amenity.icon); }} onDelete={() => setAmenities(amenities.filter((a) => a.id !== amenity.id))} />
                ))}
            </div>

            <Sheet open={addOpen} onOpenChange={handleCancel}>
                <SheetContent side="right" className="max-w-md w-full overflow-y-auto ">
                    <SheetHeader>
                        <SheetTitle>Add Amenity</SheetTitle>
                        <SheetDescription></SheetDescription>
                    </SheetHeader>
                    <form className="px-3">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="name">Amenity Name</label>
                            <Input placeholder="Amenity Name" id="name" value={addAmenity.name} onChange={(e) => setAddAmenity({ ...addAmenity, name: e.target.value })} className="w-full" />
                            <DragDrop image={image} setImage={setImage} setAddAmenity={setAddAmenity} addAmenity={addAmenity} />
                        </div>
                        <SheetFooter className="flex flex-col gap-3 px-0">
                            <Button type="submit" className="w-full cursor-pointer" onClick={handleSubmit}>Add Amenities</Button>
                            <SheetClose asChild>
                                <Button type="button" variant="outline" className="w-full cursor-pointer">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}