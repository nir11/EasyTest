import axios from "axios";

const Api = axios.create({
  // baseURL: "http://localhost:4000/",
  // baseURL: "/api",
  baseURL: "https://easytest.onrender.com",
});
export default Api;
