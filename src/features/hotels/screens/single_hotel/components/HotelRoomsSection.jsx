import React, { memo, useCallback, useEffect, useState } from "react";
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
import { useApi } from "@/contexts/ApiContext";
import { showError, showSuccess } from "@/utils/toast";

const emptyForm = {
  name: "",
  description: "",
  roomNumber: "",
  floor: "",
  maxOccupancy: 1,
  minOccupancy: 1,
  childOccupancy: 0,
  size: 0,
  totalRooms: 1,
  isActive: true,
  roomTypeId: "",
  bedTypes: [],
  amenities: [],
  timeSlots: [],
};

const HotelRoomsSection = memo(({ hotelId, rooms = [], onUpdateRooms }) => {
  const api = useApi();
  const [editingRoom, setEditingRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bedTypeOptions, setBedTypeOptions] = useState([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);
  const [roomForm, setRoomForm] = useState({ ...emptyForm });

  // Bed types have no admin endpoint of their own, so they come from the
  // public filter list. Room types come from the admin list.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [filters, types] = await Promise.all([
          api.admin.listBedTypes(),
          api.admin.listRoomTypes({ limit: 100 }),
        ]);

        if (cancelled) return;

        setBedTypeOptions(
          filters?.data?.availableFilters?.bedTypes || []
        );
        setRoomTypeOptions(types?.data?.roomTypes || []);
      } catch (error) {
        if (!cancelled) {
          showError("Could not load the bed types and room types.");
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [api]);


  // What the admin room endpoints expect. The form keeps strings because the
  // inputs produce strings, so the numbers are made here, once.
  const toPayload = useCallback(
    () => ({
      name: roomForm.name,
      description: roomForm.description,
      roomTypeId: roomForm.roomTypeId || undefined,
      maxOccupancy: Number(roomForm.maxOccupancy) || 1,
      minOccupancy: Number(roomForm.minOccupancy) || 1,
      childOccupancy: Number(roomForm.childOccupancy) || 0,
      size: Number(roomForm.size) || 0,
      totalRooms: Number(roomForm.totalRooms) || 1,
      floor: roomForm.floor === "" ? undefined : Number(roomForm.floor),
      isActive: roomForm.isActive,
      bedTypes: roomForm.bedTypes
        .filter((bed) => bed.id)
        .map((bed) => ({
          bedTypeId: bed.id,
          quantity: Number(bed.quantity) || 1,
        })),
    }),
    [roomForm]
  );

  // These three used to change React state only, so every edit was lost on
  // the next page load and nothing ever reached the hotel.
  const handleAddRoom = useCallback(async () => {
    if (!hotelId) {
      showError("Save the hotel first, then add its rooms.");
      return;
    }

    if (!roomForm.name || !roomForm.roomTypeId) {
      showError("A room needs a name and a room type.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.admin.createHotelRoom(hotelId, toPayload());
      const saved = response?.data?.room;
      onUpdateRooms([...rooms, saved || { ...roomForm }]);
      showSuccess("Room added");
      handleCloseModal();
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          "Could not add the room. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }, [api, hotelId, roomForm, rooms, onUpdateRooms, toPayload]);

  const handleEditRoom = useCallback((room) => {
    setEditingRoom(room);
    setRoomForm({
      ...emptyForm,
      name: room.name || "",
      description: room.description || "",
      roomNumber: room.roomNumber || "",
      floor: room.floor === null || room.floor === undefined ? "" : room.floor,
      maxOccupancy: room.maxOccupancy || 1,
      minOccupancy: room.minOccupancy || 1,
      childOccupancy: room.childOccupancy || 0,
      size: room.size || 0,
      totalRooms: room.totalRooms || 1,
      isActive: room.isActive !== false,
      roomTypeId: room.roomType?.id || room.roomTypeId || "",
      bedTypes: (room.bedTypes || []).map((bed) => ({
        id: bed.id,
        quantity: bed.quantity || 1,
      })),
      amenities: room.amenities || [],
      timeSlots: room.timeSlots || [],
    });
    setIsModalOpen(true);
  }, []);

  const handleUpdateRoom = useCallback(async () => {
    if (!editingRoom?.id || !hotelId) {
      showError("This room has no record on the server yet.");
      return;
    }

    setSaving(true);
    try {
      await api.admin.updateHotelRoom(hotelId, editingRoom.id, toPayload());
      onUpdateRooms(
        rooms.map((room) =>
          room.id === editingRoom.id ? { ...room, ...roomForm } : room
        )
      );
      showSuccess("Room updated");
      handleCloseModal();
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          "Could not save the room. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }, [api, hotelId, rooms, editingRoom, roomForm, onUpdateRooms, toPayload]);

  const handleDeleteRoom = useCallback(
    async (roomId) => {
      if (!roomId || !hotelId) return;

      setSaving(true);
      try {
        await api.admin.deleteHotelRoom(hotelId, roomId);
        onUpdateRooms(rooms.filter((room) => room.id !== roomId));
        showSuccess("Room deleted");
      } catch (error) {
        showError(
          error?.response?.data?.message ||
            "Could not delete the room. Please try again."
        );
      } finally {
        setSaving(false);
      }
    },
    [api, hotelId, rooms, onUpdateRooms]
  );

  const handleAddBed = useCallback(() => {
    setRoomForm((prev) => ({
      ...prev,
      bedTypes: [...prev.bedTypes, { id: "", quantity: 1 }],
    }));
  }, []);

  const handleBedChange = useCallback((index, field, value) => {
    setRoomForm((prev) => ({
      ...prev,
      bedTypes: prev.bedTypes.map((bed, i) =>
        i === index ? { ...bed, [field]: value } : bed
      ),
    }));
  }, []);

  const handleRemoveBed = useCallback((index) => {
    setRoomForm((prev) => ({
      ...prev,
      bedTypes: prev.bedTypes.filter((_, i) => i !== index),
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setRoomForm({ ...emptyForm });
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
                  <Label htmlFor="size">Room Size (m²)</Label>
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

              {/* Room Type. The four names here used to be hard coded, so the
                  value never matched a real room type. */}
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                <Select
                  value={roomForm.roomTypeId}
                  onValueChange={(value) =>
                    handleFormChange("roomTypeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.displayName || option.name}
                      </SelectItem>
                    ))}
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

              {/* Total Rooms */}
              <div className="space-y-2">
                <Label htmlFor="total-rooms">Total Rooms</Label>
                <Input
                  id="total-rooms"
                  type="number"
                  min={1}
                  value={roomForm.totalRooms}
                  onChange={(e) =>
                    handleFormChange("totalRooms", e.target.value)
                  }
                />
              </div>

              {/* Beds */}
              <div className="space-y-2">
                <Label>Beds</Label>
                {roomForm.bedTypes.length === 0 && (
                  <p className="text-sm text-gray-500">No beds added yet</p>
                )}
                {roomForm.bedTypes.map((bed, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Select
                      value={bed.id || ""}
                      onValueChange={(value) =>
                        handleBedChange(index, "id", value)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a bed" />
                      </SelectTrigger>
                      <SelectContent>
                        {bedTypeOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.displayName || option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={1}
                      className="w-20"
                      value={bed.quantity}
                      onChange={(e) =>
                        handleBedChange(index, "quantity", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveBed(index)}
                    >
                      <Trash2 className="w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBed}
                >
                  <Plus className="w-4 mr-1" />
                  Add a bed
                </Button>
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
                disabled={saving}
                onClick={editingRoom ? handleUpdateRoom : handleAddRoom}
              >
                {saving
                  ? "Saving..."
                  : editingRoom
                    ? "Update Room"
                    : "Add Room"}
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
                    <span>{room.size} m²</span>
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
