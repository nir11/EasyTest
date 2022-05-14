const initialState = {
    appointments: [],
    appointmentTimes: []
};

export default function appointmentReducer(state = initialState, action) {

    switch (action.type) {
        case "CREATE_APPOINTMENT":
            return state;
        case "GET_APPOINTMENT":
            return { ...state, appointmentTimes: action.payload.ExcludeDatetime };
        case "GET_REACOMMENDED_APPOINTMENT":
            return { ...state, appointments: action.payload.Recommendations };

        default:
            return state;
    }
}