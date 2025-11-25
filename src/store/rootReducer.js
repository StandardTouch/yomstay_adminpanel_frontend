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
import thematicsReducer from "../features/thematics/thematicsSlice";
import newsletterReducer from "../features/newsletter/newsletterSlice";
import contactRequestsReducer from "../features/contact_request/contactRequestsSlice";
import cancellationPolicyReducer from "../features/settings/cancellationPolicySlice";
import termsOfUseReducer from "../features/settings/termsOfUseSlice";
import privacyPolicyReducer from "../features/settings/privacyPolicySlice";
import documentTypesReducer from "../features/settings/documentTypesSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
// import authReducer from '../features/auth/authSlice';
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
  thematics: thematicsReducer,
  newsletter: newsletterReducer,
  contactRequests: contactRequestsReducer,
  cancellationPolicy: cancellationPolicyReducer,
  termsOfUse: termsOfUseReducer,
  privacyPolicy: privacyPolicyReducer,
  documentTypes: documentTypesReducer,
  dashboard: dashboardReducer,
  // auth: authReducer,
  // filters: filtersReducer,
});

export default rootReducer;
