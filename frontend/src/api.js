import axios from "axios";

export default axios.create({
  baseURL: "https://mern-authentication-backend-ma24.onrender.com/api",
  withCredentials: true,
});
