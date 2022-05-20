const initialState = {
    garages: JSON.parse(sessionStorage.getItem("garages")) != null ? JSON.parse(sessionStorage.getItem("garages")) : []
};

export default function garagesReducer(state = initialState, action) {

    switch (action.type) {
        case "GET_GARAGES":
            return { garages: action.payload.garages.sort((a, b) => a.Name.localeCompare(b.Name)) };

        default:
            return state;
    }
}