import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { FaqItem } from "./FaqItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const HotelFaqsSection = memo(({ faqs = [], onUpdateFaqs }) => {
  const [addFaq, setAddFaq] = useState({ question: "", answer: "" });
  const [modal, setModal] = useState({ open: false, type: "faq" });

  const handleAddFaq = useCallback(
    (e) => {
      e.preventDefault();
      if (!addFaq.question || !addFaq.answer) {
        return alert("Please fill out all fields");
      }

      const newFaqs = [addFaq, ...faqs];
      onUpdateFaqs(newFaqs);
      handleCancel();
    },
    [addFaq, faqs, onUpdateFaqs]
  );

  const handleCancel = useCallback(() => {
    setAddFaq({ question: "", answer: "" });
    setModal({ ...modal, open: false });
  }, [modal]);

  const handleUpdateFaq = useCallback(
    (index, updatedFaq) => {
      const newFaqs = faqs.map((f, i) => (i === index ? updatedFaq : f));
      onUpdateFaqs(newFaqs);
    },
    [faqs, onUpdateFaqs]
  );

  const handleDeleteFaq = useCallback(
    (index) => {
      const newFaqs = faqs.filter((_, i) => i !== index);
      onUpdateFaqs(newFaqs);
    },
    [faqs, onUpdateFaqs]
  );

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <Dialog
          open={modal.open}
          onOpenChange={(open) => setModal({ ...modal, open })}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setModal({ ...modal, open: true })}
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
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">Add FAQ</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
    </div>
  );
});

HotelFaqsSection.displayName = "HotelFaqsSection";

export default HotelFaqsSection;
