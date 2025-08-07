import { combineReducers } from "@reduxjs/toolkit";

// Import feature reducers (we'll create these next)
// import authReducer from '../features/auth/authSlice';
// import usersReducer from '../features/users/usersSlice';
// import hotelsReducer from '../features/hotels/hotelsSlice';
// import dashboardReducer from '../features/dashboard/dashboardSlice';
// import globalAmenitiesReducer from '../features/global_amenities/globalAmenitiesSlice';
// import filtersReducer from '../features/filters/filtersSlice';

const rootReducer = combineReducers({
  // auth: authReducer,
  // users: usersReducer,
  // hotels: hotelsReducer,
  // dashboard: dashboardReducer,
  // globalAmenities: globalAmenitiesReducer,
  // filters: filtersReducer,
});

export default rootReducer;
