import { combineReducers } from "redux";
import garagesReducer from "./garages/garages-reducer";
import appointmentReducer from './appointment/appointment-reducer'

const rootReducer = combineReducers({
    garagesReducer,
    appointmentReducer
});

export default rootReducer;