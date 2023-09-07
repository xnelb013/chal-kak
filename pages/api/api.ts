import axios from "axios";
import Cookies from "js-cookie";

export const apiInstance = axios.create({
  baseURL: "https://www.chla-kak-back.store",
});

// 인터셉터 사용
apiInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
