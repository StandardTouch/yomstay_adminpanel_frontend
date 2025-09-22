import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import RoomType from "../components/roomType";
import PlatformSettings from "../components/platformSettings";
import DocumentVerification from "../components/documentVerification";

function Settings() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState({
    roomType: true,
    notifications: false,
    platformSettings: false,
    documentVerification: false,
    members: false,
    userRoles: false,
  });
  const settingsMenu = [
    {
      name: "Room Type",
      value: "roomType",
    },
    // {
    //   name: "Notifications",
    //   value: "notifications",
    // },
    {
      name: "Platform Settings",
      value: "platformSettings",
    },
    {
      name: "Document Verification",
      value: "documentVerification",
    },
  ];
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className=" mt-4 border-t-2 pt-4 w-full max-w-7xl mx-auto relative grid grid-cols-4 gap-4 ">
        <div className=" md:col-span-1 col-span-4 md:border-r-2 md:border-b-0 md:pr-4 border-b-2 ">
          <div className="flex flex-col mb-5 w-full ">
            <div className=" flex flex-col gap-2 ">
              {settingsMenu.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    showModal[item.value] && "bg-accent"
                  } p-2 border rounded-md cursor-pointer hover:bg-accent `}
                  onClick={() => setShowModal({ [item.value]: true })}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        {showModal.roomType && (
          <div className=" col-span-4 md:col-span-3 ">
            <RoomType />
          </div>
        )}
        {showModal.notifications && (
          <div className=" col-span-4 md:col-span-3 ">Notifications</div>
        )}
        {showModal.platformSettings && (
          <div className=" col-span-4 md:col-span-3 ">
            <PlatformSettings />
          </div>
        )}
        {showModal.documentVerification && (
          <div className=" col-span-4 md:col-span-3 ">
            <DocumentVerification />
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
