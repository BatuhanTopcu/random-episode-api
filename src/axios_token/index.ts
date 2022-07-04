import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const BASE_URL = process.env.TMDB_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

export default instance;
