import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AlertBox from "../../../../../components/AlertBox";

// The Arabic fields were missing here, so a hotel question written in
// Arabic was invisible to an admin and wiped on the next save.
export const FaqItem = ({ faq, onUpdate, onDelete }) => (
  <div className="flex flex-col gap-2 border p-2 rounded relative">
    <label className="text-lg">Question (English)</label>
    <Input
      type="text"
      className="w-full p-3"
      required
      value={faq.question}
      onChange={(e) => onUpdate({ ...faq, question: e.target.value })}
    />
    <label className="text-lg">Question (Arabic)</label>
    <Input
      type="text"
      dir="rtl"
      className="w-full p-3"
      value={faq.questionAr || ""}
      onChange={(e) => onUpdate({ ...faq, questionAr: e.target.value })}
    />
    <label className="text-lg">Answer (English)</label>
    <Textarea
      required
      value={faq.answer}
      onChange={(e) => onUpdate({ ...faq, answer: e.target.value })}
    />
    <label className="text-lg">Answer (Arabic)</label>
    <Textarea
      dir="rtl"
      value={faq.answerAr || ""}
      onChange={(e) => onUpdate({ ...faq, answerAr: e.target.value })}
    />
    <AlertBox Check="Faq" onDelete={onDelete} />
  </div>
);
