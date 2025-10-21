import axios from "axios";
import { BASE_URL } from "./config";

const axios_api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios_api;
