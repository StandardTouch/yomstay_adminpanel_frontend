import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddButton from "@/components/AddButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function conditions() {
  const conditions = [
    {
      id: 1,
      name: "Free Cancellation",
      described: "Free cancellation within 24 hours",
    },
    { id: 2, name: "No Pets Allowed", described: "Sorry, no pets allowed" },
    { id: 3, name: "Check-in after 3 PM", described: "Check-in after 3 PM" },
  ];
  const [allconditions, setAllConditions] = useState(conditions);
  const [addOpen, setAddOpen] = useState(false);
  const [btnOpen, setBtnOpen] = useState(false);
  const [condition, setCondition] = useState({
    id: Math.random().toString(),
    name: "",
    described: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!condition.name || !condition.described)
      return alert("Please fill out all fields");
    setAllConditions((prevConditions) => {
      const conditionExists = prevConditions.some(
        (cond) => cond.id === condition.id
      );
      if (conditionExists) {
        // Replace the existing condition with the new one
        return prevConditions.map((cond) =>
          cond.id === condition.id ? condition : cond
        );
      } else {
        // Add new condition if ID doesn't exist
        return [condition, ...prevConditions];
      }
    });
    handleCancel();
  };
  const handleCancel = () => {
    setAddOpen(false);
    setCondition({ id: Math.random().toString(), name: "", described: "" });
  };
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Conditions</h1>
        <AddButton
          buttonValue="Add Condition"
          onAdd={() => {
            setAddOpen(!addOpen);
            setBtnOpen(false);
            setCondition({
              id: Math.random().toString(),
              name: "",
              described: "",
            });
          }}
        />
      </div>
      <div>
        <div className=" mt-4 rounded-2xl ">
          {allconditions.map((condition) => (
            <div
              key={condition.id}
              className="border-b p-4 flex justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{condition.name}</h2>
                <p>{condition.described}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className=" cursor-pointer"
                  onClick={() => {
                    setAddOpen(true);
                    setBtnOpen(true);
                    setCondition({
                      id: condition.id,
                      name: condition.name,
                      described: condition.described,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className=" cursor-pointer"
                  onClick={() =>
                    setAllConditions(
                      allconditions.filter((c) => c.id !== condition.id)
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {addOpen && (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader className=" text-left ">
              <DialogTitle>
                {btnOpen ? "Update" : "Add New"} Condition
              </DialogTitle>
              <form action="" className=" flex flex-col gap-2">
                <label htmlFor="conditionName">Condition Name</label>
                <Input
                  placeholder="Condition Name"
                  type="text"
                  id="conditionName"
                  value={condition.name}
                  onChange={(e) => {
                    setCondition({ ...condition, name: e.target.value });
                  }}
                  required
                  className="w-full"
                />
                <label htmlFor="conditionDescription">
                  Condition Description
                </label>
                <Textarea
                  placeholder="Condition Description"
                  id="conditionDescription"
                  value={condition.described}
                  onChange={(e) =>
                    setCondition({ ...condition, described: e.target.value })
                  }
                  className="w-full"
                  required
                ></Textarea>
                <div className="flex justify-center mt-2 gap-2 *:w-1/3 *:hover:cursor-pointer">
                  <Button type="submit" onClick={handleSubmit}>
                    {btnOpen ? "Update" : "Add New"} Condition
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleCancel()}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
