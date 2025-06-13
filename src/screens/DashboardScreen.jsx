import React from "react";
import { Component } from "../components/card";
import { Piecard } from "../components/pie-card";

export default function DashboardScreen() {
  return (
    <div className="flex pt-4 flex-col gap-4 sm:flex-row px-4">
      <Component />
      <Piecard />
    </div>
  );
}
