import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { AmenityItem } from "../../../../../common/components/hotel/AmenityItem";
import { FaqItem } from "./FaqItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HotelAmenitiesSection = memo(
  ({
    amenitiesList = [],
    onUpdateAmenities,
    defaultAmenities = [],
    faqs = [],
    onUpdateFaqs,
  }) => {
    const [addAmenity, setAddAmenity] = useState({
      id: Math.random().toString(),
      name: "",
      icon: "",
    });
    const [addFaq, setAddFaq] = useState({ question: "", answer: "" });
    const [modal, setModal] = useState({ open: false, type: "amenity" });

    const handleAddAmenity = useCallback(
      (e) => {
        e.preventDefault();
        const amenityExists = amenitiesList.some(
          (item) => item.id === addAmenity.id
        );

        if (!amenityExists) {
          if (!addAmenity.name) return alert("Please fill out all fields");
          const newAmenities = [addAmenity, ...amenitiesList];
          onUpdateAmenities(newAmenities);
          handleCancel();
          return;
        }
        alert("Amenity already exists");
      },
      [addAmenity, amenitiesList, onUpdateAmenities]
    );

    const handleAddFaq = useCallback(
      (e) => {
        e.preventDefault();
        if (!addFaq.question || !addFaq.answer) {
          return alert("Please fill out all fields");
        }

        const newFaqs = [addFaq, ...faqs];
        onUpdateFaqs(newFaqs);
        handleCancelFaq();
      },
      [addFaq, faqs, onUpdateFaqs]
    );

    const handleCancel = useCallback(() => {
      setAddAmenity({ id: Math.random().toString(), name: "", icon: "" });
      setModal({ ...modal, open: false });
    }, [modal]);

    const handleCancelFaq = useCallback(() => {
      setAddFaq({ question: "", answer: "" });
      setModal({ ...modal, open: false });
    }, [modal]);

    const handleDeleteAmenity = useCallback(
      (index) => {
        const updatedAmenities = amenitiesList.filter((_, i) => i !== index);
        onUpdateAmenities(updatedAmenities);
      },
      [amenitiesList, onUpdateAmenities]
    );

    const handleDeleteFaq = useCallback(
      (index) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        onUpdateFaqs(newFaqs);
      },
      [faqs, onUpdateFaqs]
    );

    const handleUpdateFaq = useCallback(
      (index, updatedFaq) => {
        const newFaqs = faqs.map((f, i) => (i === index ? updatedFaq : f));
        onUpdateFaqs(newFaqs);
      },
      [faqs, onUpdateFaqs]
    );

    const handleDefaultAmenitySelect = useCallback(
      (amenity) => {
        setAddAmenity(amenity);
        setModal({ ...modal, open: true });
      },
      [modal]
    );

    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h2 className="text-2xl font-semibold">Amenities & Policies</h2>
        </div>

        <Tabs defaultValue="amenities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-4">
            <div className="flex gap-2">
              <Dialog
                open={modal.open && modal.type === "amenity"}
                onOpenChange={(open) => setModal({ ...modal, open })}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    onClick={() =>
                      setModal({ ...modal, open: true, type: "amenity" })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Amenity
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Amenity</DialogTitle>
                    <DialogDescription>
                      Add a new amenity to the hotel listing.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddAmenity} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="amenity-name">Amenity Name</label>
                      <Input
                        id="amenity-name"
                        type="text"
                        value={addAmenity.name}
                        onChange={(e) =>
                          setAddAmenity({ ...addAmenity, name: e.target.value })
                        }
                        placeholder="Enter amenity name"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Amenity</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Add Amenities</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(defaultAmenities || []).map((amenity, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => handleDefaultAmenitySelect(amenity)}
                    >
                      {amenity.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
              {amenitiesList.map((amenity, idx) => (
                <AmenityItem
                  key={amenity.id || idx}
                  amenity={amenity}
                  onDelete={() => handleDeleteAmenity(idx)}
                />
              ))}
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-4">
            <Dialog
              open={modal.open && modal.type === "faq"}
              onOpenChange={(open) => setModal({ ...modal, open })}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    setModal({ ...modal, open: true, type: "faq" })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New FAQ</DialogTitle>
                  <DialogDescription>
                    Add a new frequently asked question to the hotel listing.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddFaq} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="faq-question">Question</label>
                    <Input
                      id="faq-question"
                      type="text"
                      value={addFaq.question}
                      onChange={(e) =>
                        setAddFaq({ ...addFaq, question: e.target.value })
                      }
                      placeholder="Enter question"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="faq-answer">Answer</label>
                    <Textarea
                      id="faq-answer"
                      value={addFaq.answer}
                      onChange={(e) =>
                        setAddFaq({ ...addFaq, answer: e.target.value })
                      }
                      placeholder="Enter answer"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelFaq}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add FAQ</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-2">
              {faqs.map((faq, idx) => (
                <FaqItem
                  key={idx}
                  faq={faq}
                  onUpdate={(updatedFaq) => handleUpdateFaq(idx, updatedFaq)}
                  onDelete={() => handleDeleteFaq(idx)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

HotelAmenitiesSection.displayName = "HotelAmenitiesSection";

export default HotelAmenitiesSection;
