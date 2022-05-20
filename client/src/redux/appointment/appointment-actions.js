import Api from "../../utils/Api";

export const createAppointment = (data) => async (dispatch) => {
  try {
    const res = await Api.post(`appointments`, data);

    dispatch({
      type: "CREATE_APPOINTMENT",
      payload: res.data,
    });

    if (res.status == 200) return Promise.resolve(res.data);
    else return Promise.reject(res.data);
  } catch (e) {
    // console.log(e);
    return Promise.reject(e);
  }
};
export const getAppointments =
  (garageId, dateYear, dateNumber) => async (dispatch) => {
    try {
      const res = await Api.get(
        `appointments/${garageId}/${dateYear}/${dateNumber}`
      );

      dispatch({
        type: "GET_APPOINTMENT",
        payload: res.data,
      });

      if (res.status == 200) return Promise.resolve(res.data);
      else Promise.reject(res.data);
    } catch (e) {
      // console.log(e);
      return Promise.reject(e);
    }
  };

export const getRecommendedAppointments = (userLoction) => async (dispatch) => {
  try {
    // console.log("userLoction", userLoction)
    const res = await Api.put(`/appointments/recommended`, userLoction);

    dispatch({
      type: "GET_REACOMMENDED_APPOINTMENT",
      payload: res.data,
    });

    if (res.status == 200) return Promise.resolve(res.data);
    else Promise.reject(res.data);
  } catch (e) {
    // console.log(e);
    return Promise.reject(e);
  }
};

export const getFirstFreeAppointment = (selectedGarages) => async (dispatch) => {
  console.log('selectedGarages', selectedGarages);
  try {
    const res = await Api.put(`appointments/free`, selectedGarages);

    dispatch({
      type: "GET_FIRST_FREE_APPOINTMENT",
      payload: res.data,
    });

    if (res.status == 200) return Promise.resolve(res.data);
    else Promise.reject(res.data);
  } catch (e) {
    // console.log(e);
    return Promise.reject(e);
  }
};
