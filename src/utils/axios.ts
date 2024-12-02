import { Axios } from "axios";

const axios = new Axios({
  baseURL: import.meta.env.VITE_BACKEND,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export default axios;
