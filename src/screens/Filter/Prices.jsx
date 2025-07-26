import React from 'react'
import { Switch } from "@/components/ui/switch"

function Prices({ showTrue, setShowTrue }) {
    return (
        <div className='w-full flex flex-col gap-2 border rounded-md shadow p-2'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>Prices</h2>
                <Switch defaultChecked={showTrue.prices} onCheckedChange={(e) => { setShowTrue({ ...showTrue, prices: e });}} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default Prices