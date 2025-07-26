import React from 'react'
import { Switch } from "@/components/ui/switch"

function NumberOfStars({ showTrue, setShowTrue }) {
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>NumberOfStars</h2>
                <Switch defaultChecked={showTrue.numberOfStars} onCheckedChange={(e) => { setShowTrue({ ...showTrue, numberOfStars: e }); }} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default NumberOfStars