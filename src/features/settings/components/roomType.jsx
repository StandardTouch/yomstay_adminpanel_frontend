import React, { use, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accessibility,
  Bed,
  BedDouble,
  Briefcase,
  Building,
  Crown,
  Link,
  SquarePen,
  Users,
} from "lucide-react";

export default function RoomType() {
  const [roomData, setRoomData] = useState([
    {
      id: "ba5eed45-6b5c-4c41-8e6b-306071176ffe",
      name: "standard",
      displayName: "Standard Room",
      description:
        "Comfortable room with essential amenities for a pleasant stay",
      icon: <Bed />,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "3a283a2b-3603-4fbf-bf61-6872dcff7b88",
      name: "deluxe",
      displayName: "Deluxe Room",
      description: "Spacious room with enhanced amenities and comfort",
      icon: <BedDouble />,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: "bfb03b5f-9b18-4e43-b57d-29a36b023cfd",
      name: "suite",
      displayName: "Suite",
      description:
        "Luxurious suite with separate living area and premium amenities",
      icon: <Building />,
      isActive: false,
      sortOrder: 3,
    },
    {
      id: "376a59ae-f150-4f82-9706-43b586611320",
      name: "executive",
      displayName: "Executive Room",
      description:
        "Premium room designed for business travelers with work facilities",
      icon: <Briefcase />,
      isActive: true,
      sortOrder: 4,
    },
    {
      id: "d8fc33d0-2de4-41cf-ae2c-b6265736dba2",
      name: "presidential",
      displayName: "Presidential Suite",
      description:
        "Ultimate luxury accommodation with premium services and amenities",
      icon: <Crown />,
      isActive: true,
      sortOrder: 5,
    },
    {
      id: "206dfab9-3b31-4731-9bbe-59466a56ffcd",
      name: "family",
      displayName: "Family Room",
      description: "Spacious room designed for families with children",
      icon: <Users />,
      isActive: false,
      sortOrder: 6,
    },
    {
      id: "b4b4a214-e5ae-4c07-bd25-1d69c7d09c3c",
      name: "connecting",
      displayName: "Connecting Rooms",
      description:
        "Adjacent rooms with internal connection for families or groups",
      icon: <Link />,
      isActive: true,
      sortOrder: 7,
    },
    {
      id: "5d1cf9cb-3f7d-4033-81c9-2d6226a4aea7",
      name: "accessible",
      displayName: "Accessible Room",
      description: "Specially designed room with accessibility features",
      icon: <Accessibility />,
      isActive: true,
      sortOrder: 8,
    },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    id: Math.random().toString(),
    name: "",
    displayName: "",
    description: "",
    icon: "",
    isActive: false,
    sortOrder: 0,
  });

  const icons = [
    <Bed />,
    <BedDouble />,
    <Building />,
    <Briefcase />,
    <Crown />,
    <Users />,
    <Link />,
    <Accessibility />,
  ];

  // Handle drag start
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Handle drop
  const handleDrop = (e, targetIndex) => {
    const draggedIndex = e.dataTransfer.getData("draggedIndex");
    if (draggedIndex !== targetIndex) {
      const updatedRoomData = [...roomData];
      // Remove the dragged item
      const [draggedItem] = updatedRoomData.splice(draggedIndex, 1);
      // Insert the dragged item at the target index
      updatedRoomData.splice(targetIndex, 0, draggedItem);

      setRoomData(updatedRoomData);
    }
  };

  const handleCancel = () => {
    setAddOpen(false);
    setNewRoomData({
      id: Math.random().toString(),
      name: "",
      displayName: "",
      description: "",
      icon: "",
      isActive: false,
      sortOrder: 0,
    });
  };
  const handleSave = () => {
    if (!newRoomData.description || !newRoomData.displayName) {
      toast(<p className="text-red-500">Please fill in all the fields</p>);
      return;
    }
    const foundIndex = roomData.findIndex((room) => room.id === newRoomData.id);
    if (foundIndex !== -1) {
      const updatedRoomData = [...roomData];
      updatedRoomData[foundIndex] = newRoomData;
      setRoomData(updatedRoomData);
    } else {
      setRoomData([...roomData, newRoomData]);
    }
    handleCancel();
    setAddOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="mb-4 text-xl font-bold ">Room Types</h1>
        <Button onClick={() => setAddOpen(true)}>Add Room Type</Button>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roomData.map((item, index) => (
          <Card
            key={item.id}
            className="flex flex-col justify-between gap-4"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-4">
                  <div className="rounded-md bg-muted w-fit p-2 capitalize">
                    {item.icon}
                  </div>
                  <Button
                    variant="outline"
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => (setAddOpen(true), setNewRoomData(item))}
                  >
                    <SquarePen className=" w-4 h-4 " />
                  </Button>
                </div>
                <div>
                  <div className="text-2xl font-bold ">{item.displayName}</div>
                  <div className="text-muted-foreground text-sm ">
                    {item.description}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="flex justify-between items-center w-full">
                <Switch
                  checked={item.isActive}
                  onCheckedChange={(checked) => {
                    const updatedRoomData = [...roomData];
                    updatedRoomData[index].isActive = checked;
                    setRoomData(updatedRoomData);
                  }}
                />
                <div
                  className={`${
                    item.isActive ? "text-green-500" : "text-red-500"
                  }  text-sm font-semibold`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Sheet open={addOpen} onOpenChange={handleCancel}>
        <SheetContent className=" overflow-y-auto p-5 ">
          <SheetTitle>Add New Room Type</SheetTitle>

          <div className=" scroll-y-auto flex flex-col gap-4 *:flex *:flex-col *:gap-2 *:border-b-2 *:last:border-b-0 *:pb-2">
            <div>
              <label htmlFor="roomname">Room Display Name</label>
              <Input
                id="roomname"
                value={newRoomData.displayName}
                onChange={(e) =>
                  setNewRoomData({
                    ...newRoomData,
                    displayName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="roomdescription">Room Description</label>
              <Textarea
                id="roomdescription"
                value={newRoomData.description}
                onChange={(e) =>
                  setNewRoomData({
                    ...newRoomData,
                    description: e.target.value,
                  })
                }
              ></Textarea>
            </div>
            <div>
              <label htmlFor="isActive">Is Active</label>
              <div className="flex gap-5 mt-2">
                <Switch
                  checked={newRoomData.isActive}
                  onCheckedChange={(checked) =>
                    setNewRoomData({ ...newRoomData, isActive: checked })
                  }
                />
                <div
                  className={`${
                    newRoomData.isActive ? "text-green-500" : "text-red-500"
                  }  text-sm font-semibold`}
                >
                  {newRoomData.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="roomicon">Room Icon</label>
              {newRoomData.icon ? (
                <div className="rounded-md bg-muted w-fit p-2">
                  {newRoomData.icon}
                </div>
              ) : (
                <div className="rounded-md bg-muted w-fit p-2">Select Icon</div>
              )}
              <label htmlFor="roomicon">Select Icon</label>
              <div className="grid grid-cols-4 gap-4">
                {icons.map((icon, index) => (
                  <div
                    key={index}
                    className={`${icon === newRoomData.icon ? "bg-accent" : ""}
                       rounded-md w-fit p-2 cursor-pointer hover:bg-accent`}
                    onClick={() => {
                      setNewRoomData({ ...newRoomData, icon });
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Toaster position="top-center" />
    </div>
  );
}
