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

function cities() {
  const cities = [
    {
      id: "7eaa93cf-d8db-43da-88fb-41499e1c5982",
      name: "Abha",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      stateId: "c4f84273-c452-46a4-9a34-a6bedaee3c7e",
      slug: "abha",
      breadcrumb: "saudi-arabia/asir/abha",
      ar: {
        name: "أبها\n",
        breadcrumb: "المملكة-العربية-السعودية/عسير/أبها",
      },
    },
    {
      id: "01357bba-0c1d-4adc-b71f-e45030577d66",
      name: "Abqaiq",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      stateId: "d71acaa9-dbb3-4e86-963f-a2fdc77fa2ec",
      slug: "abqaiq",
      breadcrumb: "saudi-arabia/eastern-province/abqaiq",
      ar: {
        name: "بقيق\n",
        breadcrumb: "المملكة-العربية-السعودية/المنطقة-الشرقية/بقيق",
      },
    },
    {
      id: "b1aa4a1e-9636-4b90-8650-14f579851822",
      name: "Abu Hisani",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      stateId: "8e26bcd3-c650-4e55-89f0-be8014213e28",
      slug: "abu-hisani",
      breadcrumb: "saudi-arabia/makkah/abu-hisani",
      ar: {
        name: "ابو حساني\n",
        breadcrumb: "المملكة-العربية-السعودية/مكة/ابو-حساني",
      },
    },
    {
      id: "4f6e80f1-4ba8-4b07-b9af-63b85b422b66",
      name: "Abu Qirfah",
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      stateId: "8e26bcd3-c650-4e55-89f0-be8014213e28",
      slug: "abu-qirfah",
      breadcrumb: "saudi-arabia/makkah/abu-qirfah",
      ar: {
        name: "أبو قرفة\n",
        breadcrumb: "المملكة-العربية-السعودية/مكة/أبو-قرفة",
      },
    },
  ];
  const [cityList, setCityList] = useState(cities);
  const [showmodal, setShowModal] = useState(false);
  const [index, setIndex] = useState(null);
  const [city, setCity] = useState({
    id: Math.random().toString(),
    name: "",
    ar: { name: "" },
    countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
    stateId: "8e26bcd3-c650-4e55-89f0-be8014213e28",
    slug: "",
    breadcrumb: "",
    ar: {
      breadcrumb: "",
    },
  });

  const handleDelete = (e) => {
    setShowModal(false);
    const updatedCities = [...cityList];
    updatedCities.splice(index, 1);
    setCityList(updatedCities);
    handleClose(e);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!city.name || !city.slug) {
      alert("Please fill in all required fields.");
      return;
    }
    if (index !== null) {
      // Edit existing city
      const updatedCities = [...cityList];
      updatedCities[index] = city;
      setCityList(updatedCities);
    } else {
      // Add new city
      setCityList([...cityList, city]);
    }
    handleClose(e);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setShowModal(false);
    setCity({
      id: Math.random().toString(),
      name: "",
      ar: { name: "" },
      countryId: "33a8e8a2-950e-48b7-92c1-c32a38f4a4ad",
      stateId: "8e26bcd3-c650-4e55-89f0-be8014213e28",
      slug: "",
      breadcrumb: "",
      ar: {
        breadcrumb: "",
      },
    });
  };
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Cities</h1>
        <Button
          className="cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setIndex(null);
          }}
        >
          Add City
        </Button>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cityList.map((city, index) => (
          <Card
            key={city.id}
            className="p-4 gap-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div>{city.name}</div>
              <div className="flex items-center gap-2">
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
                    setCity({
                      id: city.id,
                      name: city.name,
                      countryId: city.countryId,
                      stateId: city.stateId,
                      slug: city.slug,
                      breadcrumb: city.breadcrumb,
                      ar: city.ar,
                    });
                  }}
                >
                  <PenBoxIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Country ID:
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                {city.countryId}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                State ID:
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                {city.stateId}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Slug:
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                {city.slug}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Breadcrumb:
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                {city.breadcrumb}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Dialog
        open={showmodal}
        onOpenChange={() => {
          handleClose;
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {index === null ? "Add City" : "Edit City"}
            </DialogTitle>
            <form>
              <Card className="p-4 mt-4">
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={city.name}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="arname" className="text-right">
                      Arabic Name
                    </label>
                    <Input
                      id="arname"
                      value={city.ar.name}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          ar: {
                            ...city.ar,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="slug" className="text-right">
                      Slug
                    </label>
                    <Input
                      id="slug"
                      value={city.slug}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          slug: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="breadcrumb" className="text-right">
                      Breadcrumb
                    </label>
                    <Input
                      id="breadcrumb"
                      value={city.breadcrumb}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          breadcrumb: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="arbreadcrumb" className="text-right">
                      Arabic Breadcrumb
                    </label>
                    <Input
                      id="arbreadcrumb"
                      value={city.ar.breadcrumb}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          ar: {
                            ...city.ar,
                            breadcrumb: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </Card>
              <div className="flex gap-2 justify-end mt-4">
                <Button type="button" onClick={handleClose} variant={"outline"}>
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

export default cities;
