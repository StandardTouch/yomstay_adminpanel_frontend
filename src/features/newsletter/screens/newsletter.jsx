import React from "react";

export default function newsletter() {
  const newsletters = [
    {
      id: 1,
      email: "test@example.com",
    },
    {
      id: 2,
      email: "haris@example.com",
    },
    {
      id: 3,
      email: "gaffor@example.com",
    },
    {
      id: 4,
      email: "ali@example.com",
    },
  ];
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Newsletter</h1>
      </div>
      <div>
        <div className=" mt-4 rounded-2xl ">
          {newsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              className="border-b p-4 flex justify-between"
            >
              <h2 className="text-lg font-semibold">{newsletter.email}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
