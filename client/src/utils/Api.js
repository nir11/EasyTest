import axios from "axios";

const Api = axios.create({
  // baseURL: "http://localhost:4000/",
  // baseURL: "/api",
  baseURL: "https://easy-test-israel.herokuapp.com/api",
});
export default Api;
