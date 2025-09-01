import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { isAction } from "@reduxjs/toolkit";

export default function DocumentVerification() {
  const [showModal, setShowModal] = useState(false);
  const [documentName, setDocumentName] = useState([
    {
      label: "Document Name",
      value: "",
      id: "documentName",
      isActive: false,
    },
  ]);
  return (
    <div>
      <div className="flex justify-between gap-5 md:items-center mb-4 md:flex-row flex-col">
        <h1 className="text-xl font-bold text-nowrap ">
          Document Verification
        </h1>
        <Button
          className="cursor-pointer"
          onClick={() =>
            setDocumentName([
              ...documentName,
              { label: "Document Name", value: "", id: Date.now() },
            ])
          }
        >
          Add New Document
        </Button>
      </div>
      <div>
        {documentName.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 pb-2 mb-2 border-b-2 relative"
          >
            <div className="flex items-center gap-3">
              <label htmlFor={item.id}>{item.label}</label>
              <Switch
                checked={item.isActive}
                onCheckedChange={() => {
                  setDocumentName(
                    documentName.map((item, i) =>
                      i === index ? { ...item, isActive: !item.isActive } : item
                    )
                  );
                }}
              />
              <p
                className={`text-sm font-semibold ${
                  item.isActive ? "text-green-700" : "text-red-500"
                }`}
              >
                {item.isActive ? "Enabled" : "Disabled"}
              </p>
            </div>
            <Input
              type="text"
              id={item.id}
              autocomplete="off"
              value={item.value}
              onChange={(e) => {
                const updatedDocumentName = [...documentName];
                updatedDocumentName[index] = {
                  ...item,
                  value: e.target.value,
                };
                setDocumentName(updatedDocumentName);
              }}
            />
            <Button
              variant="destructive"
              className="cursor-pointer absolute bottom-2 right-0"
              onClick={() =>
                setDocumentName(documentName.filter((_, i) => i !== index))
              }
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
