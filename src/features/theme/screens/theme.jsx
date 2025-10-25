import React, { useState } from "react";
import AddButton from "@/components/AddButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function theme() {
  const themes = [
    {
      id: 1,
      name: "Business",
    },
    {
      id: 2,
      name: "Rest between flights",
    },
    {
      id: 3,
      name: "Romantic",
    },
    {
      id: 4,
      name: "Wellness",
    },
    {
      id: 5,
      name: "Family",
    },
  ];
  const [addOpen, setAddOpen] = useState(false);
  const [btnOpen, setBtnOpen] = useState(false);
  const [allThemes, setAllThemes] = useState(themes);
  const [theme, setTheme] = useState({
    id: Math.random().toString(),
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!theme.name) return alert("Please fill out all fields");
    setAllThemes((prevThemes) => {
      const themeExists = prevThemes.some((th) => th.id === theme.id);
      if (themeExists) {
        // Replace the existing theme with the new one
        return prevThemes.map((th) => (th.id === theme.id ? theme : th));
      } else {
        // Add new theme if ID doesn't exist
        return [theme, ...prevThemes];
      }
    });
    handleCancel();
  };
  const handleCancel = () => {
    setAddOpen(false);
    setTheme({ id: Math.random().toString(), name: "" });
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Themes</h1>
        <AddButton
          buttonValue="Add Theme"
          onAdd={() => {
            setAddOpen(!addOpen);
            setBtnOpen(false);
            setTheme({ id: Math.random().toString(), name: "" });
          }}
        />
      </div>
      <div>
        <div className=" grid grid-cols-3 gap-4 mt-4 ">
          {allThemes.map((theme) => (
            <div
              key={theme.id}
              className=" rounded-2xl border p-4 flex  justify-between"
            >
              <h2 className="text-lg font-semibold">
                {theme.name.slice(0, 15)}
                {theme.name.length > 15 && "..."}
              </h2>
              <div className="flex gap-2 *:cursor-pointer">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddOpen(!addOpen);
                    setBtnOpen(true);
                    setTheme(theme);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setAllThemes(allThemes.filter((th) => th.id !== theme.id));
                  }}
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
            <DialogHeader>
              <DialogTitle>{btnOpen ? "Update" : "Add New"} Theme</DialogTitle>
              <form className=" flex flex-col gap-4 ">
                <div className=" flex flex-col gap-2 mt-4">
                  <label htmlFor="themeName">Theme Name</label>
                  <Input
                    type="text"
                    name="themeName"
                    id="themeName"
                    required
                    value={theme.name}
                    onChange={(e) =>
                      setTheme({ ...theme, name: e.target.value })
                    }
                    placeholder="Theme Name"
                  />
                </div>
                <div className=" flex justify-end gap-2 mt-2 ">
                  <Button onClick={handleSubmit} className=" cursor-pointer ">
                    {btnOpen ? "Update" : "Add"} Theme
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
