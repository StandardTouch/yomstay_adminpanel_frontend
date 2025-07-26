import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";

function ThemedOffers({ showTrue, setShowTrue, setAllValues, allValues }) {
    const data = [
        {
            name: "Wellness",
        },
        {
            name: "Romantic",
        },
        {
            name: "Business",
        },
        {
            name: "Rest between two flights",
        },
        {
            name: "Food",
        },
        {
            name: "Good deals",
        },
        {
            name: "Best Rated",
        },
        {
            name: "Best Deals",
        },
        {
            name: "Top Picks for Leisure & Relaxation",
        },
        {
            name: "Best Views from High Floors",
        },
        {
            name: "Best bars and restaurants",
        },
        {
            name: "Top Leisure Pick",
        },
        {
            name: "Hotel Carousel Leisure",
        },
    ]
    const [themedOffersValue, setThemedOffersValue] = useState(allValues.themedOffers);
    const handleClick = (e) => {
        if (themedOffersValue.find((item) => item.name === e.target.value)) {
            setThemedOffersValue((prev) => prev.filter((item) => item.name !== e.target.value));
            setAllValues((prev) => ({ ...prev, themedOffers: themedOffersValue.filter((item) => item.name !== e.target.value) }));
        }
        else {
            setThemedOffersValue((prev) => ([...prev, { name: e.target.value }]));
            setAllValues((prev) => ({ ...prev, themedOffers: [...prev.themedOffers, { name: e.target.value }] }));
        }
    }
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>Themed Offers</h2>
                <Switch defaultChecked={showTrue.themedOffers} onCheckedChange={(e) => { setShowTrue({ ...showTrue, themedOffers: e }); }} className='cursor-pointer' />
            </div>
            {showTrue.themedOffers && <div className='flex flex-wrap gap-3'>
                {data.map((item) => (
                    <Button className={`border shadow dark:shadow-zinc-600 cursor-pointer hover:bg-zinc-700 hover:text-white ${themedOffersValue.find((i) => i.name === item.name) ? "bg-primary dark:bg-black text-white" : "bg-white text-black"}`} value={item.name} key={item.name} onClick={handleClick}>{item.name}</Button>
                ))}
            </div>}
        </div>
    )
}

export default ThemedOffers