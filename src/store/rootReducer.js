import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import hotelsReducer from "../features/hotels/hotelsSlice";
import singleHotelReducer from "../features/hotels/singleHotelSlice";
import hotelRequestsReducer from "../features/hotel_requests/hotelRequestsSlice";
import countriesReducer from "../features/countries/countriesSlice";
import locationReducer from "../features/locations/locationSlice";
// import authReducer from '../features/auth/authSlice';
// import dashboardReducer from '../features/dashboard/dashboardSlice';
// import globalAmenitiesReducer from '../features/global_amenities/globalAmenitiesSlice';
// import filtersReducer from '../features/filters/filtersSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  hotels: hotelsReducer,
  singleHotel: singleHotelReducer,
  hotelRequests: hotelRequestsReducer,
  countries: countriesReducer,
  locations: locationReducer,
  // auth: authReducer,
  // dashboard: dashboardReducer,
  // globalAmenities: globalAmenitiesReducer,
  // filters: filtersReducer,
});

export default rootReducer;
