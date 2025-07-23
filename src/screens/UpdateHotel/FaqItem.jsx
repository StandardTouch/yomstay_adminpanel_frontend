import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const FaqItem = ({ faq, onChange, onDelete }) => (
  <div className="flex flex-col gap-2 border p-2 rounded relative">
    <label className="text-lg">Question</label>
    <Input type="text" className="w-full p-3" required value={faq.question} onChange={e => onChange({ ...faq, question: e.target.value })} />
    <label className="text-lg">Answer</label>
    <Textarea required value={faq.answer} onChange={e => onChange({ ...faq, answer: e.target.value })} />
    <Badge type="button" onClick={onDelete} variant="destructive" className="absolute top-2 right-2 cursor-pointer">Remove</Badge>
  </div>
); 