import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import hotelsReducer from "../features/hotels/hotelsSlice";
import singleHotelReducer from "../features/hotels/singleHotelSlice";
import hotelRequestsReducer from "../features/hotel_requests/hotelRequestsSlice";
import locationReducer from "../features/locations/locationSlice";
import settingsReducer from "../features/settings/settingsSlice";
import roomTypesReducer from "../features/settings/roomTypesSlice";
import amenitiesReducer from "../features/global_amenities/amenitiesSlice";
import conditionsReducer from "../features/conditions/conditionsSlice";
// import authReducer from '../features/auth/authSlice';
// import dashboardReducer from '../features/dashboard/dashboardSlice';
// import filtersReducer from '../features/filters/filtersSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  hotels: hotelsReducer,
  singleHotel: singleHotelReducer,
  hotelRequests: hotelRequestsReducer,
  locations: locationReducer,
  settings: settingsReducer,
  roomTypes: roomTypesReducer,
  amenities: amenitiesReducer,
  conditions: conditionsReducer,
  // auth: authReducer,
  // dashboard: dashboardReducer,
  // filters: filtersReducer,
});

export default rootReducer;
