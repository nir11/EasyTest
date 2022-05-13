import Api from "../../utilis/Api";

export const createAppointment = (data) => async dispatch => {
    try {

        const res = await Api.post(`appointments`, data)

        dispatch({
            type: 'CREATE_APPOINTMENT',
            payload: res.data
        })

        if (data.status == 200)
            return Promise.resolve(res.data);
        else
            return Promise.reject(res.data);

    }
    catch (e) {
        // console.log(e);
        return Promise.reject(e);
    }
}
export const getAppointments = (garageId, dateNumber) => async dispatch => {
    try {

        const res = await Api.get(`appointments/${garageId}/${dateNumber}`)

        dispatch({
            type: 'GET_APPOINTMENT',
            payload: res.data
        })

        if (res.status == 200)
            return Promise.resolve(res.data);
        else
            Promise.reject(res.data);

    }
    catch (e) {
        // console.log(e);
        return Promise.reject(e);
    }
}
