import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Clock, Bed, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HotelRoomsSection = memo(({ rooms = [], onUpdateRooms }) => {
  const [editingRoom, setEditingRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    roomNumber: "",
    floor: "",
    maxOccupancy: 1,
    minOccupancy: 1,
    childOccupancy: 0,
    size: 0,
    isActive: true,
    roomType: "",
    bedTypes: [],
    amenities: [],
    timeSlots: [],
  });

  const handleAddRoom = useCallback(() => {
    const newRoom = {
      id: Math.random().toString(),
      ...roomForm,
    };
    onUpdateRooms([...rooms, newRoom]);
    handleCloseModal();
  }, [roomForm, rooms, onUpdateRooms]);

  const handleEditRoom = useCallback((room) => {
    setEditingRoom(room);
    setRoomForm(room);
    setIsModalOpen(true);
  }, []);

  const handleUpdateRoom = useCallback(() => {
    const updatedRooms = rooms.map((room) =>
      room.id === editingRoom.id ? { ...room, ...roomForm } : room
    );
    onUpdateRooms(updatedRooms);
    handleCloseModal();
  }, [rooms, editingRoom, roomForm, onUpdateRooms]);

  const handleDeleteRoom = useCallback(
    (roomId) => {
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      onUpdateRooms(updatedRooms);
    },
    [rooms, onUpdateRooms]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setRoomForm({
      name: "",
      description: "",
      roomNumber: "",
      floor: "",
      maxOccupancy: 1,
      minOccupancy: 1,
      childOccupancy: 0,
      size: 0,
      isActive: true,
      roomType: "",
      bedTypes: [],
      amenities: [],
      timeSlots: [],
    });
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setRoomForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Rooms & Pricing</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? "Edit Room" : "Add New Room"}
              </DialogTitle>
              <DialogDescription>
                {editingRoom
                  ? "Update room details and pricing"
                  : "Add a new room to the hotel"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    value={roomForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter room name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-number">Room Number</Label>
                  <Input
                    id="room-number"
                    value={roomForm.roomNumber}
                    onChange={(e) =>
                      handleFormChange("roomNumber", e.target.value)
                    }
                    placeholder="Enter room number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    value={roomForm.floor}
                    onChange={(e) => handleFormChange("floor", e.target.value)}
                    placeholder="Enter floor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Room Size (sq ft)</Label>
                  <Input
                    id="size"
                    type="number"
                    value={roomForm.size}
                    onChange={(e) =>
                      handleFormChange("size", parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter room size"
                    min="0"
                  />
                </div>
              </div>

              {/* Occupancy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-occupancy">Max Occupancy</Label>
                  <Input
                    id="max-occupancy"
                    type="number"
                    value={roomForm.maxOccupancy}
                    onChange={(e) =>
                      handleFormChange(
                        "maxOccupancy",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="Max guests"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-occupancy">Min Occupancy</Label>
                  <Input
                    id="min-occupancy"
                    type="number"
                    value={roomForm.minOccupancy}
                    onChange={(e) =>
                      handleFormChange(
                        "minOccupancy",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="Min guests"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="child-occupancy">Child Occupancy</Label>
                  <Input
                    id="child-occupancy"
                    type="number"
                    value={roomForm.childOccupancy}
                    onChange={(e) =>
                      handleFormChange(
                        "childOccupancy",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Child capacity"
                    min="0"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                <Select
                  value={roomForm.roomType}
                  onValueChange={(value) => handleFormChange("roomType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="room-description">Description</Label>
                <Textarea
                  id="room-description"
                  value={roomForm.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  placeholder="Enter room description"
                  rows={3}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="room-active"
                  checked={roomForm.isActive}
                  onCheckedChange={(checked) =>
                    handleFormChange("isActive", checked)
                  }
                />
                <Label htmlFor="room-active">Room is active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={editingRoom ? handleUpdateRoom : handleAddRoom}
              >
                {editingRoom ? "Update Room" : "Add Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <CardDescription>
                    {room.roomNumber && `Room ${room.roomNumber}`}
                    {room.floor && ` • Floor ${room.floor}`}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditRoom(room)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {room.minOccupancy}-{room.maxOccupancy} guests
                  </span>
                </div>
                {room.childOccupancy > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{room.childOccupancy} children</span>
                  </div>
                )}
                {room.size > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bed className="w-4 h-4" />
                    <span>{room.size} sq ft</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      room.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={
                      room.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {room.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No rooms added yet.</p>
          <p className="text-sm">
            Add rooms to configure pricing and availability.
          </p>
        </div>
      )}
    </div>
  );
});

HotelRoomsSection.displayName = "HotelRoomsSection";

export default HotelRoomsSection;
