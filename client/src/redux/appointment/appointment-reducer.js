const initialState = {
    appointments: [],
    appointment: {},
    appointmentTimes: []
};

export default function appointmentReducer(state = initialState, action) {
    console.log("action payload", action.payload);
    switch (action.type) {
        case "CREATE_APPOINTMENT":
            return { ...state, appointment: action.payload.Appointment };
        case "GET_APPOINTMENT":
            return { ...state, appointmentTimes: action.payload.ExcludeDatetime };
        case "GET_REACOMMENDED_APPOINTMENT":
            return { ...state, appointments: action.payload.Recommendations };
        case "GET_FIRST_FREE_APPOINTMENT":
            return { ...state, appointments: action.payload.Appointments };

        default:
            return state;
    }
}