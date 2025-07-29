import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

function FilterTabContent({
  value,
  title,
  data = [],
  stateKey,
  showTrue,
  setShowTrue,
  allValues,
  setAllValues,
}) {
  const [selectedValues, setSelectedValues] = useState(allValues[stateKey]);

  useEffect(() => {
    setSelectedValues(allValues[stateKey]);
  }, [allValues, stateKey]);

  const handleClick = (e) => {
    const selected = e.target.value;
    const exists = selectedValues.find((item) => item.name === selected);
    const updated = exists
      ? selectedValues.filter((item) => item.name !== selected)
      : [
          ...selectedValues,
          {
            name: selected,
            icon: data.find((item) => item.name === selected)?.icon,
          },
        ];

    const isActive = updated.some((item) => item.name === selected);
    alert(`The ${selected} is now ${isActive ? "active" : "disabled"}.`);

    setSelectedValues(updated);
    setAllValues((prev) => ({
      ...prev,
      [stateKey]: updated,
    }));
  };

  return (
    <div className=" w-full flex flex-col gap-2 border rounded-md shadow p-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">{title}</h2>
        {stateKey === "sortby" ? null : (
          <Switch
            defaultChecked={showTrue[stateKey]}
            onCheckedChange={(e) => {
              if (!e) {
                setAllValues((prev) => ({
                  ...prev,
                  [stateKey]: [],
                }));
              }
              setShowTrue({ ...showTrue, [stateKey]: e });
            }}
          />
        )}
      </div>
      {showTrue[stateKey] && data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((item) => (
            <Button
              key={item.name}
              value={item.name}
              onClick={handleClick}
              className={`border shadow dark:shadow-zinc-600 cursor-pointer hover:bg-zinc-300 hover:text-black ${
                selectedValues.find((i) => i.name === item.name)
                  ? "bg-green-600 dark:text-white text-white"
                  : "bg-white dark:bg-black dark:text-gray-500 text-gray-500"
              }`}
            >
              {item.icon && <img src={item.icon} className="w-5 h-5" alt="" />}
              {item.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterTabContent;
