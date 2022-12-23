import axios from "axios";

const Api = axios.create({
  // baseURL: "http://localhost:4000/",
  baseURL: "https://easytest.onrender.com",
});
export default Api;
