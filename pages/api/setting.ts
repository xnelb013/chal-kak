import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "https://chal-kak.vercel.app/",
  withCredentials: true,
});
