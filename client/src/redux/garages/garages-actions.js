import Api from "../../utils/Api";

export const getGarages = () => async (dispatch) => {
  try {
    const res = await Api.get(`garages`);

    dispatch({
      type: "GET_GARAGES",
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (e) {
    // console.log(e);
    return Promise.reject(e);
  }
};
