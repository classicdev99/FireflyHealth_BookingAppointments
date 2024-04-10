import _ from "axios";

// shared axios instance with the base URL set to the API URL of the backend server
const axios = _.create({
    baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:3001",
});

export default axios;