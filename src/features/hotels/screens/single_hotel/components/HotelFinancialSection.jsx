import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HotelFinancialSection = memo(
  ({
    taxes = [],
    platform = { commissionPercentage: 0, platformTaxPercentage: 0 },
    onUpdateTaxes,
    onUpdatePlatform,
  }) => {
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);
    const [taxForm, setTaxForm] = useState({
      name: "",
      taxType: "percentage",
      rate: 0,
      description: "",
      isActive: true,
    });

    const handleAddTax = useCallback(() => {
      const newTax = {
        id: Math.random().toString(),
        ...taxForm,
      };
      onUpdateTaxes([...taxes, newTax]);
      handleCloseTaxModal();
    }, [taxForm, taxes, onUpdateTaxes]);

    const handleEditTax = useCallback((tax) => {
      setEditingTax(tax);
      setTaxForm(tax);
      setIsTaxModalOpen(true);
    }, []);

    const handleUpdateTax = useCallback(() => {
      const updatedTaxes = taxes.map((tax) =>
        tax.id === editingTax.id ? { ...tax, ...taxForm } : tax
      );
      onUpdateTaxes(updatedTaxes);
      handleCloseTaxModal();
    }, [taxes, editingTax, taxForm, onUpdateTaxes]);

    const handleDeleteTax = useCallback(
      (taxId) => {
        const updatedTaxes = taxes.filter((tax) => tax.id !== taxId);
        onUpdateTaxes(updatedTaxes);
      },
      [taxes, onUpdateTaxes]
    );

    const handleCloseTaxModal = useCallback(() => {
      setIsTaxModalOpen(false);
      setEditingTax(null);
      setTaxForm({
        name: "",
        taxType: "percentage",
        rate: 0,
        description: "",
        isActive: true,
      });
    }, []);

    const handleTaxFormChange = useCallback((field, value) => {
      setTaxForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handlePlatformChange = useCallback(
      (field, value) => {
        onUpdatePlatform({
          ...platform,
          [field]: parseFloat(value) || 0,
        });
      },
      [platform, onUpdatePlatform]
    );

    return (
      <div className="flex flex-col gap-6 p-1">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h2 className="text-2xl font-semibold">Financial Settings</h2>
        </div>

        {/* Platform Fees */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Platform Fees</h3>
          <Card>
            <CardHeader>
              <CardTitle>Commission & Platform Tax</CardTitle>
              <CardDescription>
                Configure platform fees and tax percentages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commission-percentage">
                    Commission Percentage
                  </Label>
                  <div className="relative">
                    <Input
                      id="commission-percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={platform.commissionPercentage}
                      onChange={(e) =>
                        handlePlatformChange(
                          "commissionPercentage",
                          e.target.value
                        )
                      }
                      placeholder="Enter commission percentage"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform-tax-percentage">
                    Platform Tax Percentage
                  </Label>
                  <div className="relative">
                    <Input
                      id="platform-tax-percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={platform.platformTaxPercentage}
                      onChange={(e) =>
                        handlePlatformChange(
                          "platformTaxPercentage",
                          e.target.value
                        )
                      }
                      placeholder="Enter platform tax percentage"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Taxes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Hotel Taxes</h3>
            <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={() => setIsTaxModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tax
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTax ? "Edit Tax" : "Add New Tax"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTax
                      ? "Update tax details and rates"
                      : "Add a new tax to the hotel"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-name">Tax Name</Label>
                    <Input
                      id="tax-name"
                      value={taxForm.name}
                      onChange={(e) =>
                        handleTaxFormChange("name", e.target.value)
                      }
                      placeholder="Enter tax name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-type">Tax Type</Label>
                    <Select
                      value={taxForm.taxType}
                      onValueChange={(value) =>
                        handleTaxFormChange("taxType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_fee">Fixed Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">
                      {taxForm.taxType === "percentage"
                        ? "Rate (%)"
                        : "Rate (cents)"}
                    </Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      step={taxForm.taxType === "percentage" ? "0.01" : "1"}
                      min="0"
                      value={taxForm.rate}
                      onChange={(e) =>
                        handleTaxFormChange(
                          "rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder={
                        taxForm.taxType === "percentage"
                          ? "Enter percentage (e.g., 15.0 for 15%)"
                          : "Enter amount in cents (e.g., 500 for 5.00 SAR)"
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-description">Description</Label>
                    <Input
                      id="tax-description"
                      value={taxForm.description}
                      onChange={(e) =>
                        handleTaxFormChange("description", e.target.value)
                      }
                      placeholder="Enter tax description (optional)"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseTaxModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={editingTax ? handleUpdateTax : handleAddTax}
                  >
                    {editingTax ? "Update Tax" : "Add Tax"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taxes.map((tax) => (
              <Card key={tax.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tax.name}</CardTitle>
                      <CardDescription>
                        {tax.taxType === "percentage"
                          ? `${tax.rate}%`
                          : `${(tax.rate / 100).toFixed(2)} SAR`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTax(tax)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTax(tax.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tax.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span
                        className={
                          tax.isActive ? "text-green-600" : "text-red-600"
                        }
                      >
                        {tax.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {tax.description && (
                      <p className="text-sm text-gray-600">{tax.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {taxes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No taxes configured yet.</p>
              <p className="text-sm">
                Add taxes to configure hotel-specific charges.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

HotelFinancialSection.displayName = "HotelFinancialSection";

export default HotelFinancialSection;
