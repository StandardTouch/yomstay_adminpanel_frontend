import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PenBoxIcon, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function states() {
  const states = [
    {
      id: "c4f84273-c452-46a4-9a34-a6bedaee3c7e",
      name: "'Asir",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      slug: "asir",
      ar: {
        name: "عسير\n",
      },
    },
    {
      id: "5bf7c584-007b-42ec-ab7e-2405bb4e2423",
      name: "Al Bahah",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      slug: "al-bahah",
      ar: {
        name: "الباحة\n",
      },
    },
    {
      id: "3e1d676c-6cd5-4ae5-bdeb-64435805ef27",
      name: "Al Jawf",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      slug: "al-jawf",
      ar: {
        name: "الجوف\n",
      },
    },
    {
      id: "299545b1-49fd-42b8-bd3e-27a076cc2676",
      name: "Al Madinah",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      slug: "al-madinah",
      ar: {
        name: "المدينة المنورة\n",
      },
    },
    {
      id: "ae5c2ec5-be28-43ae-b864-8bb90ce820db",
      name: "Al-Qassim",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      slug: "al-qassim",
      ar: {
        name: "القصيم\n",
      },
    },
  ];
  const [statesList, setStatesList] = useState(states);
  const [showmodal, setShowModal] = useState(false);
  const [index, setIndex] = useState(null);
  const [state, setState] = useState({
    id: Math.random().toString(),
    name: "",
    ar: { name: "" },
    countryId: "",
    slug: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!state.name || !state.slug) {
      alert("Please fill in all required fields.");
      return;
    }
    if (index !== null) {
      // Edit existing state
      const updatedStates = [...statesList];
      updatedStates[index] = state;
      setStatesList(updatedStates);
    } else {
      // Add new state
      setStatesList([...statesList, state]);
    }
    handleClose(e);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setShowModal(false);
    setState({
      id: Math.random().toString(),
      name: "",
      ar: { name: "" },
      countryId: "",
      slug: "",
    });
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">States</h1>
        <Button className="cursor-pointer" onClick={() => setShowModal(true)}>
          Add State
        </Button>
      </div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {statesList.map((state, index) => (
          <Card key={index} className="p-4 gap-2">
            <div className="flex items-center justify-between ">
              <h2 className="text-lg font-semibold">{state.name}</h2>
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => {
                    const updatedStates = [...statesList];
                    updatedStates.splice(index, 1);
                    setStatesList(updatedStates);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setIndex(index);
                    setState(state);
                  }}
                >
                  <PenBoxIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <p>Arabic Name: {state.ar.name}</p>
              <p>Slug: {state.slug}</p>
              <p>Country ID: {state.countryId}</p>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={showmodal} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {index === null ? "Add State" : "Update State"}
            </DialogTitle>
            <form>
              <Card className="p-4">
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name</label>
                    <Input
                      id="name"
                      value={state.name}
                      onChange={(e) =>
                        setState({ ...state, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="ar-name">Arabic Name</label>
                    <Input
                      id="ar-name"
                      value={state.ar.name}
                      onChange={(e) =>
                        setState({ ...state, ar: { name: e.target.value } })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="slug">Slug</label>
                    <Input
                      id="slug"
                      value={state.slug}
                      onChange={(e) =>
                        setState({ ...state, slug: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="country">Country</label>
                    <Input
                      id="country"
                      value={state.countryId}
                      onChange={(e) =>
                        setState({ ...state, countryId: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant={"outline"} onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default states;
