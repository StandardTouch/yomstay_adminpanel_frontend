import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FilterTabContent from './FilterTabContent'

function Filter() {
    const [showTrue, setShowTrue] = useState({
        sortby: false,
        time: false,
        prices: false,
        numberOfStars: false,
        amenities: false,
        roomFacilities: false,
        themedOffers: false,
        moreDetails: false
    });

    const [allValues, setAllValues] = useState({
        sortby: [],
        time: [],
        prices: [],
        numberOfStars: [],
        amenities: [],
        roomFacilities: [],
        themedOffers: [],
        moreDetails: []
    })

    const data = [{
        sortby: [
            { name: "Popularity" },
            { name: "Distance" },
            { name: "Top review" },
            { name: "Increasing prices" },
        ],
        prices: [],
        time: [
            { name: "Time of arrival" },
            { name: "Time of departure" },
            { name: "Duration" },
        ],
        numberOfStars: [],
        amenities: [{ name: "Free WiFi" },
        { name: "Elevator" },
        { name: "Fitness room" },
        { name: "Wheelchair accessible rooms (on request)" },
        { name: "Business center" },
        { name: "Bar / Café" },
        { name: "Breakfast Area" },
        { name: "Meeting room" },
        ],
        roomFacilities: [{ name: "Flat screen TV" },
        { name: "Air conditioned" },
        { name: "Free WiFi" },
        { name: "Desk" },
        { name: "Fridge / Mini fridge" },
        { name: "Wheelchair accessibility (on request)" },
        { name: "Room service" },
        { name: "Bathtub" },
        { name: "DVD player" },
        { name: "Extra bed (charged)" },
        { name: "Bathtub / Jacuzzi" },
        ],
        themedOffers: [{ name: "Wellness" },
        { name: "Romantic" },
        { name: "Business" },
        { name: "Rest between two flights" },
        { name: "Food" },
        { name: "Good deals" },
        { name: "Best Rated" },
        { name: "Best Deals" },
        { name: "Top Picks for Leisure & Relaxation" },
        { name: "Best Views from High Floors" },
        { name: "Best bars and restaurants" },
        { name: "Top Leisure Pick" },
        { name: "Hotel Carousel Leisure" },
        ],
        moreDetails: [{ name: "See only the offers without pre-payment" },
        { name: "Pool access included" },
        { name: "Pay later in Cash" },
        { name: "King Size Bed" },
        ]
    }]
    return (
        <div className="p-4 sm:p-8 w-full relative ">
            <div className="flex items-center justify-between mb-5 w-full ">
                <h1 className="text-2xl font-bold">Filter</h1>
            </div>
            <div className='relative w-full'>
                <Tabs defaultValue="select" className=" w-full absolute top-0 left-0 pb-20 ">
                    <div className="w-full overflow-x-auto rounded-md">
                        <TabsList className="flex gap-2 *:cursor-pointer z-20">
                            <TabsTrigger value="select">Select Filters</TabsTrigger>
                            <TabsTrigger value="selected">Selected Filters</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="select">
                        <div className='grid grid-cols-1 lg:grid-cols-2 pt-5 gap-4 w-full'>

                            <FilterTabContent
                                value="sort-by"
                                title="Sort by"
                                stateKey="sortby"
                                data={data[0].sortby}
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />

                            <FilterTabContent
                                value="time"
                                title="Time"
                                stateKey="time"
                                data={data[0].time}
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />
                            <FilterTabContent
                                value="prices"
                                title="Prices"
                                stateKey="prices"
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />

                            <FilterTabContent
                                value="number-of-stars"
                                title="Number Of Stars"
                                stateKey="numberOfStars"
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />

                            <FilterTabContent
                                value="amenities"
                                title="Amenities"
                                stateKey="amenities"
                                data={data[0].amenities}
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />

                            <FilterTabContent
                                value="room-facilities"
                                title="Room Facilities"
                                stateKey="roomFacilities"
                                data={data[0].roomFacilities}
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />

                            <FilterTabContent
                                value="themed-offers"
                                title="Themed Offers"
                                stateKey="themedOffers"
                                data={data[0].themedOffers}
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />

                            <FilterTabContent
                                value="more-details"
                                title="More details"
                                stateKey="moreDetails"
                                data={data[0].moreDetails}
                                showTrue={showTrue}
                                setShowTrue={setShowTrue}
                                allValues={allValues}
                                setAllValues={setAllValues}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="selected">
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5'>
                            {!Object.values(showTrue).some((value) => value) && (
                                <p className="col-span-full text-center text-sm text-gray-500">
                                    Please select a filter
                                </p>
                            )}
                            {Object.keys(showTrue).map((key) => {
                                if (!showTrue[key]) return null;
                                const titleMap = {
                                    sortby: 'Sort by',
                                    prices: 'Prices',
                                    time: 'Time',
                                    numberOfStars: 'Number of stars',
                                    amenities: 'Amenities',
                                    roomFacilities: 'Room facilities',
                                    themedOffers: 'Themed offers',
                                    moreDetails: 'More Details'
                                };
                                return (
                                    <div key={key} className=' p-4 border-b-2 border shadow rounded-sm'>
                                        <h2 className="text-xl font-medium pb-2">{titleMap[key]}</h2>
                                        {Array.isArray(allValues[key]) && allValues[key].length > 0 && (
                                            allValues[key].map((item) => (
                                                <li className="text-sm pl-2" key={item.name}>{item.name}</li>
                                            ))
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Filter