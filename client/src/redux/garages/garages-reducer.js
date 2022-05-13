const initialState = {
    garages: [],
};

export default function garagesReducer(state = initialState, action) {

    switch (action.type) {
        case "GET_GARAGES":
            return { garages: action.payload.garages };

        default:
            return state;
    }
}