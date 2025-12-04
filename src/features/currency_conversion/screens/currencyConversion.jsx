import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function currencyConversion() {
  const currencyInput = [
    {
      label: "SAR to USD Exchange Rate",
      placeholder: "Enter exchange rate",
      text: "enter SAR to USD exchange rate. eg: 1SAR = ? USD",
    },
    {
      label: "SAR to AED Exchange Rate",
      placeholder: "Enter exchange rate",
      text: "enter SAR to AED exchange rate. eg: 1SAR = ? AED",
    },
    {
      label: "SAR to IIR Exchange Rate",
      placeholder: "Enter exchange rate",
      text: "enter SAR to IIR exchange rate. eg: 1SAR = ? IIR",
    },
    {
      label: "SAR to KWD Exchange Rate",
      placeholder: "Enter exchange rate",
      text: "enter SAR to KWD exchange rate. eg: 1SAR = ? KWD",
    },
    {
      label: "SAR to OMR Exchange Rate",
      placeholder: "Enter exchange rate",
      text: "enter SAR to OMR exchange rate. eg: 1SAR = ? OMR",
    },
    {
      label: "SAR to QAR Exchange Rate",
      placeholder: "Enter exchange rate",
      text: "enter SAR to QAR exchange rate. eg: 1SAR = ? QAR",
    },
  ];
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <h1 className="text-2xl font-bold mb-4">Currency Conversion</h1>
      <Card className="p-4 w-full *:flex *:flex-col *:space-y-1 *:mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Site Global Currency</h2>
          <Input placeholder="SAR" />
        </div>
        {currencyInput.map((currency, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold">{currency.label}</h2>
            <Input placeholder={currency.placeholder} />
            <p className="font-medium text-gray-600 dark:text-gray-400 text-sm ">
              {currency.text}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default currencyConversion;
