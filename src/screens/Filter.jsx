import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FilterTabContent from './FilterTabContent'

function Filter() {
    const [showTrue, setShowTrue] = useState({
        sortby: false,
        prices: false,
        time: false,
        numberOfStars: false,
        amenities: false,
        roomFacilities: false,
        themedOffers: false,
        moreDetails: false
    });
    // console.log(showTrue)
    const [allValues, setAllValues] = useState({
        sortby: [],
        prices: [],
        time: [],
        numberOfStars: [],
        amenities: [],
        roomFacilities: [],
        themedOffers: [],
        moreDetails: []
    })
    return (
        <div className="p-4 sm:p-8 w-full relative  ">
            <div className="flex items-center justify-between mb-5 w-full ">
                <h1 className="text-2xl font-bold">Filter</h1>
            </div>
            <div className='relative w-full '>
                <Tabs defaultValue="sort-by" className=" w-full absolute top-0 left-0 ">
                    <div className="w-full overflow-x-auto rounded-md">
                        <TabsList className="flex gap-2 *:cursor-pointer z-20">
                            <TabsTrigger value="sort-by">Sort by</TabsTrigger>
                            <TabsTrigger value="prices">Prices</TabsTrigger>
                            <TabsTrigger value="time">Time</TabsTrigger>
                            <TabsTrigger value="number-of-stars">Number of stars</TabsTrigger>
                            <TabsTrigger value="amenities">Amenities</TabsTrigger>
                            <TabsTrigger value="room-facilities">Room facilities</TabsTrigger>
                            <TabsTrigger value="themed-offers">Themed offers</TabsTrigger>
                            <TabsTrigger value="more-details">More details</TabsTrigger>
                            <TabsTrigger value="all-details">All Details</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="sort-by">
                        <FilterTabContent
                            value="sort-by"
                            title="Sort by"
                            stateKey="sortby"
                            data={[
                                { name: "Popularity" },
                                { name: "Distance" },
                                { name: "Top review" },
                                { name: "Increasing prices" },
                            ]}
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="prices">
                        <FilterTabContent
                            value="prices"
                            title="Prices"
                            stateKey="prices"
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="time">
                        <FilterTabContent
                            value="time"
                            title="Time"
                            stateKey="time"
                            data={[
                                { name: "Time of arrival" },
                                { name: "Time of departure" },
                                { name: "Duration" },
                            ]}
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="number-of-stars">
                        <FilterTabContent
                            value="number-of-stars"
                            title="Number Of Stars"
                            stateKey="numberOfStars"
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="amenities">
                        <FilterTabContent
                            value="amenities"
                            title="Amenities"
                            stateKey="amenities"
                            data={[
                                { name: "Free WiFi" },
                                { name: "Elevator" },
                                { name: "Fitness room" },
                                { name: "Wheelchair accessible rooms (on request)" },
                                { name: "Business center" },
                                { name: "Bar / Café" },
                                { name: "Breakfast Area" },
                                { name: "Meeting room" },
                            ]}
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="room-facilities">
                        <FilterTabContent
                            value="room-facilities"
                            title="Room Facilities"
                            stateKey="roomFacilities"
                            data={[
                                { name: "Flat screen TV" },
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
                            ]}
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="themed-offers">
                        <FilterTabContent
                            value="themed-offers"
                            title="Themed Offers"
                            stateKey="themedOffers"
                            data={[
                                { name: "Wellness" },
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
                            ]}
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="more-details">
                        <FilterTabContent
                            value="more-details"
                            title="More details"
                            stateKey="moreDetails"
                            data={[
                                { name: "See only the offers without pre-payment" },
                                { name: "Pool access included" },
                                { name: "Pay later in Cash" },
                                { name: "King Size Bed" },
                            ]}
                            showTrue={showTrue}
                            setShowTrue={setShowTrue}
                            allValues={allValues}
                            setAllValues={setAllValues}
                        />
                    </TabsContent>

                    <TabsContent value="all-details"><div className='flex flex-col gap-2 *:border-b-2 *:p-1'>

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
                                <div key={key}>
                                    <h2 className="text-lg font-medium">{titleMap[key]}</h2>
                                    {Array.isArray(allValues[key]) && allValues[key].length > 0 && (
                                        allValues[key].map((item) => (
                                            <li className="text-sm" key={item.name}>{item.name}</li>
                                        ))
                                    )}
                                </div>
                            );
                        })}

                    </div></TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Filter