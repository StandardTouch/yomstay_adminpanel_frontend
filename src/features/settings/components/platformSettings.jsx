import React, { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PlatformSettings() {
  const [platformSettings, setPlatformSettings] = useState({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    minStartHour: 6,
    maxEndHour: 22,
    minDuration: 2,
    maxDuration: 10,
    minCheckInTime: "06:00",
    maxCheckOutTime: "22:00",
    defaultDuration: 8,
    updatedAt: "2025-08-29T06:03:38.708Z",
  });
  const handleDate = (e) => {
    setPlatformSettings({
      ...platformSettings,
      [e.target.name]: e.target.value,
      updatedAt: new Date().toISOString(),
    });
  };
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold ">Platform Settings</h1>
      <div className=" flex flex-col gap-4 p-2">
        <div className="flex gap-4 *:w-full">
          <div className=" flex flex-col justify-between">
            <span className="font-semibold w-full">Min Start Hour:</span>{" "}
            <Input
              type="number"
              value={platformSettings.minStartHour}
              name="minStartHour"
              onChange={(e) => handleDate(e)}
            />
          </div>
          <div className=" flex flex-col justify-between">
            <span className="font-semibold w-full">Max End Hour:</span>{" "}
            <Input
              type="number"
              value={platformSettings.maxEndHour}
              name="maxEndHour"
              onChange={(e) => handleDate(e)}
            />
          </div>
        </div>
        <div className="flex gap-4 *:w-full">
          <div className=" flex flex-col justify-between">
            <span className="font-semibold w-full">Min Duration:</span>{" "}
            <Input
              type="number"
              value={platformSettings.minDuration}
              name="minDuration"
              onChange={(e) => handleDate(e)}
            />
          </div>
          <div className=" flex flex-col justify-between">
            <span className="font-semibold w-full">Max Duration:</span>{" "}
            <Input
              type="number"
              value={platformSettings.maxDuration}
              name="maxDuration"
              onChange={(e) => handleDate(e)}
            />
          </div>
        </div>
        <div className="flex gap-4 *:w-full">
          <div className=" flex flex-col justify-between">
            <span className="font-semibold w-full">Min Check In Time:</span>{" "}
            <Input
              type="time"
              value={platformSettings.minCheckInTime}
              name="minCheckInTime"
              onChange={(e) => handleDate(e)}
            />
          </div>
          <div className=" flex flex-col justify-between">
            <span className="font-semibold w-full">Max Check Out Time:</span>{" "}
            <Input
              type="time"
              value={platformSettings.maxCheckOutTime}
              name="maxCheckOutTime"
              onChange={(e) => handleDate(e)}
            />
          </div>
        </div>
        <div className=" flex flex-col justify-between">
          <span className="font-semibold w-full">Default Duration:</span>{" "}
          <Input
            type="number"
            value={platformSettings.defaultDuration}
            name="defaultDuration"
            onChange={(e) => handleDate(e)}
          />
        </div>
      </div>
    </div>
  );
}
