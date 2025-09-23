import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Description } from "@radix-ui/react-dialog";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddNewHotel({
  addOpen,
  setAddOpen,
  addHotel,
  setAddHotel,
  HandleAddHotel,
  checkform,
}) {
  return (
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
              onChange={(e) => {
                setAddHotel({
                  ...addHotel,
                  name: e.target.value,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  status: "approved",
                  id: Math.random().toString(),
                  starRating: 2,
                  amenities: [],
                  faq: [],
                  reviews: [],
                });
              }}
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
                    city: {
                      name: e.target.value,
                      id: Math.random().toString(),
                    },
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
                    country: {
                      name: e.target.value,
                      id: Math.random().toString(),
                    },
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
                    state: {
                      name: e.target.value,
                      id: Math.random().toString(),
                    },
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
            {/* <Button
              type="submit"
              onClick={HandleAddHotel}
              className="w-full cursor-pointer"
            >
              Add Hotel
            </Button> */}
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
  );
}
