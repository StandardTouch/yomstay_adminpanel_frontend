import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit } from "lucide-react";
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

const HotelThematicsSection = memo(({ thematics = [], onUpdateThematics }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThematic, setEditingThematic] = useState(null);
  const [thematicForm, setThematicForm] = useState({
    name: "",
    displayName: "",
  });

  const handleAddThematic = useCallback(() => {
    const newThematic = {
      id: Math.random().toString(),
      ...thematicForm,
    };
    onUpdateThematics([...thematics, newThematic]);
    handleCloseModal();
  }, [thematicForm, thematics, onUpdateThematics]);

  const handleEditThematic = useCallback((thematic) => {
    setEditingThematic(thematic);
    setThematicForm(thematic);
    setIsModalOpen(true);
  }, []);

  const handleUpdateThematic = useCallback(() => {
    const updatedThematics = thematics.map((thematic) =>
      thematic.id === editingThematic.id
        ? { ...thematic, ...thematicForm }
        : thematic
    );
    onUpdateThematics(updatedThematics);
    handleCloseModal();
  }, [thematics, editingThematic, thematicForm, onUpdateThematics]);

  const handleDeleteThematic = useCallback(
    (thematicId) => {
      const updatedThematics = thematics.filter(
        (thematic) => thematic.id !== thematicId
      );
      onUpdateThematics(updatedThematics);
    },
    [thematics, onUpdateThematics]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingThematic(null);
    setThematicForm({
      name: "",
      displayName: "",
    });
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setThematicForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Hotel Thematics</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Thematic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingThematic ? "Edit Thematic" : "Add New Thematic"}
              </DialogTitle>
              <DialogDescription>
                {editingThematic
                  ? "Update thematic details"
                  : "Add a new thematic category to the hotel"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="thematic-name">Thematic Name</label>
                <Input
                  id="thematic-name"
                  value={thematicForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter thematic name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="thematic-display-name">Display Name</label>
                <Input
                  id="thematic-display-name"
                  value={thematicForm.displayName}
                  onChange={(e) =>
                    handleFormChange("displayName", e.target.value)
                  }
                  placeholder="Enter display name"
                  required
                />
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
                onClick={
                  editingThematic ? handleUpdateThematic : handleAddThematic
                }
              >
                {editingThematic ? "Update Thematic" : "Add Thematic"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {thematics.map((thematic) => (
          <Card key={thematic.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {thematic.displayName}
                  </CardTitle>
                  <CardDescription>{thematic.name}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditThematic(thematic)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteThematic(thematic.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {thematics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No thematics configured yet.</p>
          <p className="text-sm">Add thematics to categorize your hotel.</p>
        </div>
      )}
    </div>
  );
});

HotelThematicsSection.displayName = "HotelThematicsSection";

export default HotelThematicsSection;
