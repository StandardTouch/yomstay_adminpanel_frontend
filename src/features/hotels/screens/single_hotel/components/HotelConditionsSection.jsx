import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
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

const HotelConditionsSection = memo(
  ({ conditions = [], onUpdateConditions }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCondition, setEditingCondition] = useState(null);
    const [conditionForm, setConditionForm] = useState({
      name: "",
      displayName: "",
      description: "",
      isRequired: false,
      isAccepted: false,
    });

    const handleAddCondition = useCallback(() => {
      const newCondition = {
        id: Math.random().toString(),
        ...conditionForm,
        acceptedAt: conditionForm.isAccepted ? new Date().toISOString() : null,
      };
      onUpdateConditions([...conditions, newCondition]);
      handleCloseModal();
    }, [conditionForm, conditions, onUpdateConditions]);

    const handleEditCondition = useCallback((condition) => {
      setEditingCondition(condition);
      setConditionForm(condition);
      setIsModalOpen(true);
    }, []);

    const handleUpdateCondition = useCallback(() => {
      const updatedConditions = conditions.map((condition) =>
        condition.id === editingCondition.id
          ? {
              ...condition,
              ...conditionForm,
              acceptedAt: conditionForm.isAccepted
                ? new Date().toISOString()
                : null,
            }
          : condition
      );
      onUpdateConditions(updatedConditions);
      handleCloseModal();
    }, [conditions, editingCondition, conditionForm, onUpdateConditions]);

    const handleDeleteCondition = useCallback(
      (conditionId) => {
        const updatedConditions = conditions.filter(
          (condition) => condition.id !== conditionId
        );
        onUpdateConditions(updatedConditions);
      },
      [conditions, onUpdateConditions]
    );

    const handleToggleAcceptance = useCallback(
      (conditionId) => {
        const updatedConditions = conditions.map((condition) =>
          condition.id === conditionId
            ? {
                ...condition,
                isAccepted: !condition.isAccepted,
                acceptedAt: !condition.isAccepted
                  ? new Date().toISOString()
                  : null,
              }
            : condition
        );
        onUpdateConditions(updatedConditions);
      },
      [conditions, onUpdateConditions]
    );

    const handleCloseModal = useCallback(() => {
      setIsModalOpen(false);
      setEditingCondition(null);
      setConditionForm({
        name: "",
        displayName: "",
        description: "",
        isRequired: false,
        isAccepted: false,
      });
    }, []);

    const handleFormChange = useCallback((field, value) => {
      setConditionForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h2 className="text-2xl font-semibold">Hotel Conditions</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCondition ? "Edit Condition" : "Add New Condition"}
                </DialogTitle>
                <DialogDescription>
                  {editingCondition
                    ? "Update condition details"
                    : "Add a new condition or term to the hotel"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="condition-name">Condition Name</label>
                  <Input
                    id="condition-name"
                    value={conditionForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter condition name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="condition-display-name">Display Name</label>
                  <Input
                    id="condition-display-name"
                    value={conditionForm.displayName}
                    onChange={(e) =>
                      handleFormChange("displayName", e.target.value)
                    }
                    placeholder="Enter display name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="condition-description">Description</label>
                  <Textarea
                    id="condition-description"
                    value={conditionForm.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                    placeholder="Enter condition description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="condition-required"
                    checked={conditionForm.isRequired}
                    onCheckedChange={(checked) =>
                      handleFormChange("isRequired", checked)
                    }
                  />
                  <Label htmlFor="condition-required">Required Condition</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="condition-accepted"
                    checked={conditionForm.isAccepted}
                    onCheckedChange={(checked) =>
                      handleFormChange("isAccepted", checked)
                    }
                  />
                  <Label htmlFor="condition-accepted">Condition Accepted</Label>
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
                    editingCondition
                      ? handleUpdateCondition
                      : handleAddCondition
                  }
                >
                  {editingCondition ? "Update Condition" : "Add Condition"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conditions.map((condition) => (
            <Card key={condition.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {condition.displayName}
                    </CardTitle>
                    <CardDescription>{condition.name}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCondition(condition)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCondition(condition.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {condition.description && (
                    <p className="text-sm text-gray-600">
                      {condition.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          condition.isRequired ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          condition.isRequired
                            ? "text-orange-600"
                            : "text-gray-600"
                        }
                      >
                        {condition.isRequired ? "Required" : "Optional"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {condition.isAccepted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={
                          condition.isAccepted
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {condition.isAccepted ? "Accepted" : "Not Accepted"}
                      </span>
                    </div>
                  </div>

                  {condition.isAccepted && condition.acceptedAt && (
                    <p className="text-xs text-gray-500">
                      Accepted on:{" "}
                      {new Date(condition.acceptedAt).toLocaleDateString()}
                    </p>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleAcceptance(condition.id)}
                    className="mt-2"
                  >
                    {condition.isAccepted
                      ? "Mark as Not Accepted"
                      : "Mark as Accepted"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {conditions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No conditions configured yet.</p>
            <p className="text-sm">Add conditions and terms for your hotel.</p>
          </div>
        )}
      </div>
    );
  }
);

HotelConditionsSection.displayName = "HotelConditionsSection";

export default HotelConditionsSection;
