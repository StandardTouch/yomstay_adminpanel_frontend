import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";

function Time({ showTrue, setShowTrue, setAllValues, allValues }) {
    const data = [
        {
            name: "Time of arrival",
        },
        {
            name: "Time of departure",
        },
        {
            name: "Duration",
        },
    ]
    const [timeValue, setTimeValue] = useState(allValues.time);
    const handleClick = (e) => {
        if (timeValue.find((item) => item.name === e.target.value)) {
            setTimeValue((prev) => prev.filter((item) => item.name !== e.target.value));
            setAllValues((prev) => ({ ...prev, time: timeValue.filter((item) => item.name !== e.target.value) }));
        }
        else {
            setTimeValue((prev) => ([...prev, { name: e.target.value }]));
            setAllValues((prev) => ({ ...prev, time: [...prev.time, { name: e.target.value }] }));
        }
    }
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>Time</h2>
                <Switch defaultChecked={showTrue.time} onCheckedChange={(e) => { setShowTrue({ ...showTrue, time: e }); }} className='cursor-pointer' />
            </div>
            {showTrue.time && <div className='flex flex-wrap gap-2'>
                {data.map((item) => (
                    <Button className={`border shadow dark:shadow-zinc-600 cursor-pointer hover:bg-zinc-700 hover:text-white ${timeValue.find((i) => i.name === item.name) ? "bg-primary dark:bg-black text-white" : "bg-white text-black"}`} value={item.name} key={item.name} onClick={handleClick}>{item.name}</Button>
                ))}
            </div>}
        </div>
    )
}

export default Time