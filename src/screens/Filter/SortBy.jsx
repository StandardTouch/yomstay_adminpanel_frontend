import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";

function SortBy({ showTrue, setShowTrue, setAllValues, allValues }) {
    const data = [
        {
            name: "Popularity",
        },
        {
            name: "Distance",
        },
        {
            name: "Top review",
        },
        {
            name: "Increasing prices",
        },
    ]
    const [sortValue, setSortValue] = useState(allValues.sortby);
    const handleClick = (e) => {
        if (sortValue.find((item) => item.name === e.target.value)) {
            setSortValue((prev) => prev.filter((item) => item.name !== e.target.value));
            setAllValues((prev) => ({ ...prev, sortby: sortValue.filter((item) => item.name !== e.target.value) }));
        }
        else {
            setSortValue((prev) => ([...prev, { name: e.target.value }]));
            setAllValues((prev) => ({ ...prev, sortby: [...prev.sortby, { name: e.target.value }] }));
        }
    }
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>Sort by</h2>
                <Switch defaultChecked={showTrue.sortby} onCheckedChange={(e) => { setShowTrue({ ...showTrue, sortby: e }); }} className='cursor-pointer' />
            </div>
            {showTrue.sortby && <div className='flex flex-wrap gap-2'>
                {data.map((item) => (
                    <Button className={`border shadow dark:shadow-zinc-600 cursor-pointer hover:bg-zinc-700 hover:text-white ${sortValue.find((i) => i.name === item.name) ? "bg-primary dark:bg-black text-white" : "bg-white text-black"}`} value={item.name} key={item.name} onClick={handleClick}>{item.name}</Button>
                ))}
            </div>}
        </div>
    )
}

export default SortBy