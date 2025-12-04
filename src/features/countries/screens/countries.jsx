import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenBoxIcon, Trash } from "lucide-react";

function countries() {
  const countries = [
    {
      id: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      name: "Saudi Arabia",
      iso2: "SA",
      iso3: "SAU",
      slug: "saudi-arabia",
      ar: {
        name: "المملكة العربية السعودية\n",
      },
    },
    {
      id: "b4f5f3e4-1f4e-4d3b-8e2d-5f6c8e2d3b4a",
      name: "United Arab Emirates",
      iso2: "AE",
      iso3: "ARE",
      slug: "united-arab-emirates",
      ar: {
        name: "الإمارات العربية المتحدة",
      },
    },
  ];
  const [countriesList, setCountriesList] = useState(countries);
  const [showmodal, setShowModal] = useState(false);
  const [index, setIndex] = useState(null);
  const [country, setCountry] = useState({
    id: Math.random().toString(),
    name: "",
    ar: { name: "" },
    iso2: "",
    iso3: "",
    slug: "",
  });
  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    if (placeholder === "Country Name") {
      setCountry({ ...country, name: value });
    }
    if (placeholder === "Arabic Name") {
      setCountry({ ...country, ar: { name: value } });
    }
    if (placeholder === "ISO2 Code") {
      setCountry({ ...country, iso2: value });
    }
    if (placeholder === "ISO3 Code") {
      setCountry({ ...country, iso3: value });
    }
    if (placeholder === "Slug") {
      setCountry({ ...country, slug: value });
    }
  };
  const handleClose = (e) => {
    e.preventDefault();
    setShowModal(false);
    setCountry({
      id: Math.random().toString(),
      name: "",
      ar: { name: "" },
      iso2: "",
      iso3: "",
      slug: "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!country.name || !country.iso2 || !country.iso3 || !country.slug) {
      alert("Please fill in all required fields.");
      return;
    }
    if (index !== null) {
      // Edit existing country
      const updatedCountries = [...countriesList];
      updatedCountries[index] = country;
      setCountriesList(updatedCountries);
    } else {
      // Add new country
      setCountriesList([...countriesList, country]);
    }
    handleClose(e);
  };

  const handleDelete = (e) => {
    setShowModal(false);
    const updatedCountries = [...countriesList];
    updatedCountries.splice(index, 1);
    setCountriesList(updatedCountries);
    handleClose(e);
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Countries</h1>
        <Button
          onClick={() => {
            setShowModal(true);
            setIndex(null);
          }}
          className="cursor-pointer"
        >
          Add Country
        </Button>
      </div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {countriesList.map((country, index) => (
          <Card key={country.id} className="p-4 gap-1 ">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{country.name}</h2>
              <div className=" flex justify-end gap-2 mb-2 ">
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleDelete}
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setIndex(index);
                    setCountry({
                      id: country.id,
                      name: country.name,
                      ar: {
                        name: country.ar.name,
                      },
                      iso2: country.iso2,
                      iso3: country.iso3,
                      slug: country.slug,
                    });
                  }}
                >
                  <PenBoxIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className=" *:text-sm *:font-medium *:text-gray-600 dark:*:text-gray-400 flex flex-col gap-1">
              <p>Arabic Name: {country.ar.name}</p>
              <p>ISO2 Code: {country.iso2}</p>
              <p>ISO3 Code: {country.iso3}</p>
              <p>Slug: {country.slug}</p>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={showmodal} onOpenChange={handleClose}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {index !== null ? "Edit Country" : "Add Country"}
            </DialogTitle>
            <form>
              <Card className="p-4 w-full *:flex *:flex-col *:space-y-2 mt-4 ">
                <div>
                  <label htmlFor="name">Country Name</label>
                  <Input
                    value={country.name}
                    id="name"
                    onChange={handleInputChange}
                    placeholder="Country Name"
                  />
                </div>
                <div>
                  <label htmlFor="arname">Arabic Name</label>
                  <Input
                    value={country.ar.name}
                    id="arname"
                    onChange={handleInputChange}
                    placeholder="Arabic Name"
                  />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="iso2">ISO2 Code</label>
                      <Input
                        value={country.iso2}
                        id="iso2"
                        onChange={handleInputChange}
                        placeholder="ISO2 Code"
                      />
                    </div>
                    <div>
                      <label htmlFor="iso3">ISO3 Code</label>
                      <Input
                        value={country.iso3}
                        id="iso3"
                        onChange={handleInputChange}
                        placeholder="ISO3 Code"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="slug">Slug</label>
                  <Input
                    value={country.slug}
                    id="slug"
                    onChange={handleInputChange}
                    placeholder="Slug"
                  />
                </div>
              </Card>
              <div className="flex flex-row justify-end gap-2 mt-4">
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default countries;
