import React from "react";
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
import AlertBox from "@/components/AlertBox";
import { Button } from "@/components/ui/button";
export default function HotelCard({ hotel, setIndex, showHotel, showAlert }) {
  return (
    <Card
      key={hotel.id}
      className="min-[800px]:flex-col min-[1010px]:flex-row flex-col gap-2 px-2 py-3 shadow-sm hover:shadow-muted-foreground duration-300 transition-shadow cursor-pointer relative"
      onClick={() => setIndex(hotel.id)}
    >
      <CardHeader
        className="flex flex-col justify-center items-center px-2 pb-0 w-full "
        onClick={showHotel}
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
        onClick={showHotel}
      >
        <CardContent className="px-2 flex flex-col gap-4 text-left justify-between h-full">
          <div className=" w-full flex justify-between items-start ">
            <CardTitle className=" leading-normal ">{hotel.name}</CardTitle>

            <Badge variant="secondary">⭐ {hotel.starRating}</Badge>
          </div>
          <div className="border-t-2 pt-1 ">
            <p className="font-medium">Description</p>
            <p className="text-sm text-muted-foreground">{hotel.description}</p>
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
      {showAlert && (
        <AlertBox Check="Hotel" hotelName={hotel.name} onDelete={showAlert} />
      )}
      {showAlert === false && (
        <div className="absolute bottom-2 right-2 flex gap-2 ">
          <Button variant="outline" className=" cursor-pointer ">Approved</Button>
          <AlertBox Check="Reject" hotelName={hotel.name} onDelete={showAlert} />
        </div>
      )}
    </Card>
  );
}
