import React from "react";
import { Button } from "@/components/ui/button";
import { ListFilterPlus, Plus } from "lucide-react";

function AddButton({ buttonValue, onAdd }) {
  return (
    <Button className="gap-2 cursor-pointer" onClick={onAdd}>
      {buttonValue === "Update" || buttonValue === "Cancel" ? (
        ""
      ) : buttonValue === "Filter" ? (
        <ListFilterPlus size={16} />
      ) : (
        <Plus size={16} />
      )}
      {buttonValue}
    </Button>
  );
}

export default AddButton;
