import axios from "axios";

const apiExterna = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiExterna;
