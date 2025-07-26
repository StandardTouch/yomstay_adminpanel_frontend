import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";

function RoomFacilities({ showTrue, setShowTrue, setAllValues, allValues }) {
    const data = [
        {
            name: "Flat screen TV",
        },
        {
            name: "Air conditioned",
        },
        {
            name: "Free WiFi",
        },
        {
            name: "Desk",
        },
        {
            name: "Fridge / Mini fridge",
        },
        {
            name: "Wheelchair accessibility (on request)",
        },
        {
            name: "Room service",
        },
        {
            name: "Bathtub",
        },
        {
            name: "DVD player",
        },
        {
            name: "Extra bed (charged)",
        },
        {
            name: "Bathtub / Jacuzzi",
        },
    ]
    const [roomFacilitiesValue, setRoomFacilitiesValue] = useState(allValues.roomFacilities);
    const handleClick = (e) => {
        if (roomFacilitiesValue.find((item) => item.name === e.target.value)) {
            setRoomFacilitiesValue((prev) => prev.filter((item) => item.name !== e.target.value));
            setAllValues((prev) => ({ ...prev, roomFacilities: roomFacilitiesValue.filter((item) => item.name !== e.target.value) }));
        }
        else {
            setRoomFacilitiesValue((prev) => ([...prev, { name: e.target.value }]));
            setAllValues((prev) => ({ ...prev, roomFacilities: [...prev.roomFacilities, { name: e.target.value }] }));
        }
    }
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>RoomFacilities</h2>
                <Switch defaultChecked={showTrue.roomFacilities} onCheckedChange={(e) => { setShowTrue({ ...showTrue, roomFacilities: e }); }} className='cursor-pointer' />
            </div>
            {showTrue.roomFacilities && <div className='flex flex-wrap gap-3'>
                {data.map((item) => (
                    <Button className={`border shadow dark:shadow-zinc-600 cursor-pointer hover:bg-zinc-700 hover:text-white ${roomFacilitiesValue.find((i) => i.name === item.name) ? "bg-primary dark:bg-black text-white" : "bg-white text-black"}`} value={item.name} key={item.name} onClick={handleClick}>{item.name}</Button>
                ))}
            </div>}
        </div>
    )
}

export default RoomFacilities