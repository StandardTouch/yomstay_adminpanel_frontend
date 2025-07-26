import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";

function Amenities({ showTrue, setShowTrue, setAllValues, allValues }) {
    const data = [
        {
            name: "Free WiFi",
        },
        {
            name: "Elevator",
        },
        {
            name: "Fitness room",
        },
        {
            name: "Wheelchair accessible rooms (on request)",
        },
        {
            name: "Business center",
        },
        {
            name: "Bar / Café",
        },
        {
            name: "Breakfast Area",
        },
        {
            name: "Meeting room",
        },
    ]
    const [amenitiesValue, setAmenitiesValue] = useState(allValues.amenities);
    const handleClick = (e) => {
        if (amenitiesValue.find((item) => item.name === e.target.value)) {
            setAmenitiesValue((prev) => prev.filter((item) => item.name !== e.target.value));
            setAllValues((prev) => ({ ...prev, amenities: amenitiesValue.filter((item) => item.name !== e.target.value) }));
        }
        else {
            setAmenitiesValue((prev) => ([...prev, { name: e.target.value }]));
            setAllValues((prev) => ({ ...prev, amenities: [...prev.amenities, { name: e.target.value }] }));
        }
    }
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>Amenities</h2>
                <Switch defaultChecked={showTrue.amenities} onCheckedChange={(e) => { setShowTrue({ ...showTrue, amenities: e }); }} className='cursor-pointer' />
            </div>
            {showTrue.amenities && <div className='flex flex-wrap gap-3'>
                {data.map((item) => (
                    <Button className={`border shadow dark:shadow-zinc-600 cursor-pointer hover:bg-zinc-700 hover:text-white ${amenitiesValue.find((i) => i.name === item.name) ? "bg-primary dark:bg-black text-white" : "bg-white text-black"}`} value={item.name} key={item.name} onClick={handleClick}>{item.name}</Button>
                ))}
            </div>}
        </div>
    )
}

export default Amenities