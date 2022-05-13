const initialState = {
    appointments: [],
    appointmentTimes: []
};

export default function appointmentReducer(state = initialState, action) {

    switch (action.type) {
        case "CREATE_APPOINTMENT":
            return state;
        case "GET_APPOINTMENT":
            return { appointmentTimes: action.payload.ExcludeDatetime };

        default:
            return state;
    }
}