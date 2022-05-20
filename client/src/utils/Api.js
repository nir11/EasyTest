import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:4000/",
  // baseURL: "/api"
  // baseURL: "https://meshekalmog.co.il/api"
});
export default Api;
