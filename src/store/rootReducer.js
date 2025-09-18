import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import hotelsReducer from "../features/hotels/hotelsSlice";
// import authReducer from '../features/auth/authSlice';
// import dashboardReducer from '../features/dashboard/dashboardSlice';
// import globalAmenitiesReducer from '../features/global_amenities/globalAmenitiesSlice';
// import filtersReducer from '../features/filters/filtersSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  hotels: hotelsReducer,
  // auth: authReducer,
  // dashboard: dashboardReducer,
  // globalAmenities: globalAmenitiesReducer,
  // filters: filtersReducer,
});

export default rootReducer;
