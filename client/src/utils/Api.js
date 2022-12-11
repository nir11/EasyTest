import axios from "axios";

const Api = axios.create({
  // baseURL: "http://localhost:4000/",
  // baseURL: "/api",
  baseURL: "https://easy-test-israel.netlify.app",
});
export default Api;
